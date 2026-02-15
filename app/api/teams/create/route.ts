import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateTeamCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}


export async function GET() {
  return NextResponse.json({ message: "API working" });
}
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

    const { teamName } = await req.json();

    if (!teamName || teamName.trim().length === 0) {
      return NextResponse.json(
        { error: "Team name required" },
        { status: 400 }
      );
    }

    const trimmedName = teamName.trim();
    const teamCode = generateTeamCode();

    const team = await prisma.$transaction(async (tx) => {
      const existingMembership = await tx.teamMember.findFirst({
        where: { userId: payload.userId },
      });

      if (existingMembership) {
        throw new Error("User already in a team");
      }

      const existingTeam = await tx.team.findUnique({
        where: { name: trimmedName },
      });

      if (existingTeam) {
        throw new Error("Team name already taken");
      }

      const newTeam = await tx.team.create({
        data: {
          name: trimmedName,
          teamCode,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId: payload.userId,
        },
      });

      return newTeam;
    });

    return NextResponse.json({
      success: true,
      teamCode: team.teamCode,
      message: "Team created successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Team creation failed" },
      { status: 400 }
    );
  }
}