"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [score, setScore] = useState(0);

  const challenges = [
    { id: "1", name: "Challenge 1" },
    { id: "2", name: "Challenge 2" },
    { id: "3", name: "Challenge 3" },
  ];

  useEffect(() => {
  async function fetchScore() {
    const res = await fetch("/api/user/score", {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();
    setScore(data.score);
  }

  fetchScore();
}, [pathname]); 

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between">

        <Image
          src="/CodeSprint.svg"
          alt="CodeSprint 4.0"
          width={150}
          height={100}
          priority
          className="ml-10"
        />

        <div className="flex gap-8">
          {challenges.map((challenge) => {
            const isActive =
              pathname === `/dashboard/challenge/${challenge.id}`;

            return (
              <Link
                key={challenge.id}
                href={`/dashboard/challenge/${challenge.id}`}
                className={`
                  px-5 py-2.5 rounded-xl border text-sm font-semibold
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-red-500/10 border-red-500 text-red-400 shadow-md shadow-red-500/20"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                  }
                `}
              >
                {challenge.name}
              </Link>

            );
          })}
        </div>

        <div className="text-sm text-zinc-400">
          Score: <span className="text-white font-bold">{score}</span>
        </div>

      </header>

      <main className="p-10">
        {children}
      </main>

    </div>
  );
}
