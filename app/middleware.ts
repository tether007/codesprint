import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith("/api/challenges/intro")) return NextResponse.next();

  if (path.startsWith("/api/auth/signup") || path.startsWith("/api/auth/login")) {
    const introSolved = req.cookies.get("introSolved")?.value;
    if (!introSolved) {
      return NextResponse.json({ message: "You must solve the intro challenge first" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (path.startsWith("/api/challenges/") || path.startsWith("/api/submissions")) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Login required" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/challenges/:path*",
    "/api/submissions",
    "/api/auth/signup",
    "/api/auth/login",
  ],
};
