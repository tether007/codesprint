import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Uncomment when DB is available
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Hardcoded flags for challenges
const FLAGS: Record<string, string> = {
  "crypto-1": "CTF{crypto_flag}",
  "web-1": "CTF{web_flag}",
  "misc-1": "CTF{misc_flag}",
};

// In-memory store for submissions (works without DB)
const inMemorySubmissions: { userId: number; challengeId: string; isCorrect: boolean }[] = [];

async function getAuthenticatedUserId(): Promise<number> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const payload = await verifyToken(token);
  if (!payload || typeof payload.userId !== "number") throw new Error("Invalid token");

  return payload.userId;
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || !("challengeId" in body) || !("flag" in body))
      return NextResponse.json({ message: "challengeId and flag are required" }, { status: 400 });

    const challengeId = (body as { challengeId: string }).challengeId;
    const submittedFlag = (body as { flag: string }).flag.trim();

    if (!FLAGS[challengeId]) return NextResponse.json({ message: "Invalid challenge" }, { status: 404 });

    // ----------------------------
    // Hardcoded check (no DB)
    const alreadySolved = inMemorySubmissions.find(
      (s) => s.userId === userId && s.challengeId === challengeId && s.isCorrect
    );
    if (alreadySolved) return NextResponse.json({ correct: false, message: "Already solved." });

    const isCorrect = submittedFlag === FLAGS[challengeId];

    // Save submission in memory
    inMemorySubmissions.push({ userId, challengeId, isCorrect });

    return NextResponse.json({
      correct: isCorrect,
      message: isCorrect ? "Correct flag!" : "Incorrect flag.",
    });

    // ----------------------------
    // Uncomment after initialising Prisma DB
    /*
    const alreadySolvedDB = await prisma.submission.findFirst({
      where: { userId, challengeId, isCorrect: true },
    });
    if (alreadySolvedDB) return NextResponse.json({ correct: false, message: "Already solved." });

    if (submittedFlag !== FLAGS[challengeId])
      return NextResponse.json({ correct: false, message: "Incorrect flag." });

    await prisma.submission.create({ data: { userId, challengeId, isCorrect: true } });
    return NextResponse.json({ correct: true, message: "Correct flag!" });
    */
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ message: "Unauthorized or server error" }, { status: 401 });
  }
}

