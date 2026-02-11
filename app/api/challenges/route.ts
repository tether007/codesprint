import { NextResponse } from "next/server";

const CHALLENGE_LIST = [
  { id: "crypto-1", title: "Basic Crypto", difficulty: "easy" },
  { id: "web-1", title: "Hidden Path", difficulty: "medium" },
  { id: "misc-1", title: "Logic Puzzle", difficulty: "easy" },
];

export async function GET() {
  return NextResponse.json(CHALLENGE_LIST);
}
