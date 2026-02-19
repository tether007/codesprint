import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const challengeId = Number(id);

  if (!challengeId || isNaN(challengeId)) {
    return NextResponse.json(
      { message: "Invalid challenge id" },
      { status: 400 }
    );
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      title: true,
      description: true,
      points: true,
      createdAt: true,
    },
  });

  if (!challenge) {
    return NextResponse.json(
      { message: "Challenge not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(challenge);
}
