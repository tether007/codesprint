import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const challenges = await prisma.challenge.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      points: true,
      createdAt: true,
    },
  });

  return NextResponse.json(challenges);
}