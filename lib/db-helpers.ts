import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function userHasTeam(userId: number): Promise<boolean> {
  const teamMember = await prisma.teamMember.findFirst({
    where: { userId },
  });
  return !!teamMember;
}

export async function getUserTeam(userId: number) {
  const teamMember = await prisma.teamMember.findFirst({
    where: { userId },
    include: { team: true },
  });
  return teamMember?.team || null;
}

export { prisma };