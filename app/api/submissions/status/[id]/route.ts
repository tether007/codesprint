import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const challengeId = Number(id);

    if (isNaN(challengeId)) {
      return NextResponse.json(
        { message: "Invalid challenge id" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: {
        userId_challengeId: {
          userId: payload.userId,
          challengeId,
        },
      },
    });

    return NextResponse.json({
      solved: submission?.isCorrect ?? false,
    });

  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
