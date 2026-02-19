import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || typeof payload.userId !== "number") return null;

  return payload.userId;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const challengeId = Number(body.challengeId);
    const flag = body.flag?.trim();

    if (!challengeId || !flag) {
      return NextResponse.json(
        { message: "challengeId and flag required" },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { message: "Invalid challenge" },
        { status: 404 }
      );
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { message: "Flag already captured." },
        { status: 409 }
      );
    }

    const isCorrect = flag === challenge.flag;

    await prisma.$transaction(async (tx) => {
      await tx.submission.create({
        data: {
          userId,
          challengeId,
          isCorrect,
        },
      });

      if (isCorrect) {
        await tx.user.update({
          where: { id: userId },
          data: {
            score: {
              increment: challenge.points,
            },
          },
        });
      }
    });

    return NextResponse.json({
      correct: isCorrect,
      message: isCorrect ? "Correct flag!" : "Incorrect flag.",
      pointsAwarded: isCorrect ? challenge.points : 0,
    });

  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
