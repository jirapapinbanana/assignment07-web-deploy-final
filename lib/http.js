import { NextResponse } from "next/server";

export function jsonError(message, status = 400) {
  return NextResponse.json(
    { status: "error", message },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  };
}
