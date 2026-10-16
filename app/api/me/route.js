import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request) {
  const user = await verifyToken(request.cookies.get("token")?.value);
  if (!user) {
    return NextResponse.json(
      { status: "error", message: "กรุณาเข้าสู่ระบบอีกครั้ง" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
