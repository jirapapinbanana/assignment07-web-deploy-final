import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const fullname = typeof body.fullname === "string" ? body.fullname.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!fullname || !email || !password) {
      return jsonError("กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบถ้วน");
    }
    if (fullname.length > 255) return jsonError("ชื่อยาวเกิน 255 ตัวอักษร");
    if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("กรุณากรอกอีเมลให้ถูกต้อง");
    }
    if (password.length < 8) return jsonError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    if (password.length > 72) return jsonError("รหัสผ่านยาวเกินไป กรุณาใช้ไม่เกิน 72 ตัวอักษร");

    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existing.length > 0) return jsonError("อีเมลนี้สมัครสมาชิกแล้ว กรุณาเข้าสู่ระบบ", 409);

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)",
      [email, hash, fullname]
    );

    return NextResponse.json(
      { status: "ok", id: result.insertId, message: "สมัครสมาชิกสำเร็จ" },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    // A UNIQUE index also protects against two simultaneous registrations.
    if (error?.code === "ER_DUP_ENTRY") {
      return jsonError("อีเมลนี้สมัครสมาชิกแล้ว กรุณาเข้าสู่ระบบ", 409);
    }
    console.error("[api/register] Request failed:", error?.message || error);
    return jsonError("ไม่สามารถสมัครสมาชิกได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล", 500);
  }
}
