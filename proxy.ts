import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

//intro(/) -> introSolved(T?F) Cookie 
//auth(/auth) -> token

// User can ONLY access /dashboard and challenge pages

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith("/api/challenges/intro")) return NextResponse.next();
  if (path.startsWith("/api/user/")) return NextResponse.next();

  const introSolved = req.cookies.get("introSolved")?.value;
  const token = req.cookies.get("token")?.value;

  let payload = null;

  if (token) {
    try {
      payload = await verifyToken(token);
    } catch {
      payload = null;
    }
  }

  if (path === "/") {
    if (token && payload) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (path === "/auth") {
    if (!introSolved) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (token && payload) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (path.startsWith("/dashboard")) {
    if (!token || !payload) {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    if (!introSolved) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (path.startsWith("/api/auth/signup") || path.startsWith("/api/auth/login")) {
    if (!introSolved) {
      return NextResponse.json(
        { message: "You must solve the intro challenge first" },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  if (path.startsWith("/api/challenges/") || path.startsWith("/api/submissions")) {
    if (!token || !payload) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/dashboard/:path*",
    "/api/challenges/:path*",
    "/api/submissions",
    "/api/auth/signup",
    "/api/auth/login",
  ],
};
