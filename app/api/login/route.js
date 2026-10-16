import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { cookieOptions, jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) return jsonError("กรุณากรอกอีเมลและรหัสผ่าน");

    const [rows] = await pool.execute(
      "SELECT id, email, password, fullname, created_at FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return jsonError("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    });
    const response = NextResponse.json(
      { status: "ok", message: "เข้าสู่ระบบสำเร็จ" },
      { headers: { "Cache-Control": "no-store" } }
    );
    response.cookies.set("token", token, cookieOptions());
    return response;
  } catch (error) {
    console.error("[api/login] Request failed:", error?.message || error);
    return jsonError("ไม่สามารถเข้าสู่ระบบได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูลและ JWT_SECRET", 500);
  }
}
