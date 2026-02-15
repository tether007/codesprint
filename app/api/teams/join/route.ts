import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload.userId !== "number") {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { teamCode } = await req.json();

    if (!teamCode || teamCode.trim().length !== 6) {
      return NextResponse.json(
        { error: "Invalid team code" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
     
      const existingMembership = await tx.teamMember.findFirst({
        where: { userId: payload.userId },
      });

      if (existingMembership) {
        throw new Error("You are already in a team");
      }

      const team = await tx.team.findUnique({
        where: { teamCode: teamCode.toUpperCase() },
      });

      if (!team) {
        throw new Error("Invalid team code");
      }

      
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: payload.userId,
        },
      });

      return team;
    });

    return NextResponse.json({
      success: true,
      teamName: result.name,
      message: "Successfully joined team",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to join team" },
      { status: 400 }
    );
  }
}