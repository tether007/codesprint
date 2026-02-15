import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

//intro(/) -> introSolved(T?F) Cookie 
//auth(/auth) -> token
//team-setup(/team-setup) -> verifies the token

// After joining/creating a team → User CANNOT go back to /team-setup
// After joining/creating a team → User CANNOT go back to /auth
// After joining/creating a team → User CANNOT go back to / (intro)
// User can ONLY access /dashboard and challenge pages

async function userHasTeam(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") return false;

    const teamMember = await prisma.teamMember.findFirst({
      where: { userId: payload.userId },
    });

    return !!teamMember;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // if (path.startsWith("/api/challenges/intro")) return NextResponse.next();
  if (path.startsWith("/api/teams/")) return NextResponse.next();
  if (path.startsWith("/api/user/")) return NextResponse.next();

  const introSolved = req.cookies.get("introSolved")?.value;
  const token = req.cookies.get("token")?.value;

  if (path === "/") {
    if (token) {
      const hasTeam = await userHasTeam(token);
      if (hasTeam) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  if (path === "/auth") {
    if (!introSolved) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (token) {
      const hasTeam = await userHasTeam(token);
      if (hasTeam) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  }

  if (path === "/team-setup") {
    if (!token) {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    const hasTeam = await userHasTeam(token);
    if (hasTeam) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (path.startsWith("/dashboard")) {
    if (!token) {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    const hasTeam = await userHasTeam(token);
    if (!hasTeam) {
      url.pathname = "/team-setup";
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
    if (!token) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/team-setup",
    "/dashboard/:path*",
    "/api/challenges/:path*",
    "/api/submissions",
    "/api/auth/signup",
    "/api/auth/login",
  ],
};