import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const user = await verifyToken(token);
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/dashboard");
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
