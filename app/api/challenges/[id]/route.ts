import { NextResponse } from "next/server";

type ChallengeData = {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  hints: string[];
  attachments: string[];
  extra: Record<string, unknown>;
};

type ChallengeEntry = {
  flag: string;
  data: ChallengeData;
};

const CHALLENGES: Record<string, ChallengeEntry> = {
  "crypto-1": {
    flag: "CTF{crypto_flag}",
    data: {
      id: "crypto-1",
      title: "Basic Crypto",
      description: "Decode the secret message",
      instructions: ["The cipher is very common"],
      hints: ["Shift letters"],
      attachments: [],
      extra: { difficulty: "easy" },
    },
  },
  "web-1": {
    flag: "CTF{web_flag}",
    data: {
      id: "web-1",
      title: "Hidden Path",
      description: "Find the hidden flag on the website",
      instructions: [],
      hints: ["Check network requests"],
      attachments: [],
      extra: {},
    },
  },
  "misc-1": {
    flag: "CTF{misc_flag}",
    data: {
      id: "misc-1",
      title: "Logic Puzzle",
      description: "Solve the logic to find the flag",
      instructions: ["Think step by step"],
      hints: [],
      attachments: [],
      extra: {},
    },
  },
};

export async function GET(_req: Request, context: any) {
  const params = await context.params;  
  const challengeId = params.id as string;

  const challenge = CHALLENGES[challengeId];
  if (!challenge)
    return NextResponse.json(
      { message: "Challenge not found" },
      { status: 404 }
    );

  return NextResponse.json(challenge.data);
}
