import { NextResponse } from "next/server";

const CORRECT_FLAG = "CTF{intro_flag}";

export async function GET() {
  return NextResponse.json({
    id: "intro",
    title: "Intro Challenge",
    description: "Solve this challenge to unlock signup/login",
    instructions: ["Solve this before signup/login", "Flag format: CTF{...}"],
    hints: ["Check the page carefully"],
    attachments: [],
    extra: {},
    compulsory: true,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || !("flag" in body)) {
      return NextResponse.json({ correct: false, message: "Flag is required" }, { status: 400 });
    }

    const submittedFlag = (body as { flag: string }).flag?.trim();
    if (!submittedFlag) {
      return NextResponse.json({ correct: false, message: "Flag cannot be empty" }, { status: 400 });
    }

    if (submittedFlag === CORRECT_FLAG) {
      const response = NextResponse.json({
        correct: true,
        message: "Correct flag! Signup/Login unlocked.",
      });

      response.cookies.set("introSolved", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return response;
    }

    const wrongResponse = NextResponse.json({ correct: false, message: "Incorrect flag." });
    wrongResponse.cookies.delete({
      name: "introSolved",
      path: "/",
    });

    return wrongResponse;
  } catch (error) {
    console.error("Intro challenge POST error:", error);
    return NextResponse.json({ correct: false, message: "Server error" }, { status: 500 });
  }
}
