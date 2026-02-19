"use client";

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
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-red-500">
          CodeSprint 4.0
        </h1>

        <div className="flex gap-8">
          {challenges.map((challenge) => {
            const isActive =
              pathname === `/dashboard/challenge/${challenge.id}`;

            return (
              <Link
                key={challenge.id}
                href={`/dashboard/challenge/${challenge.id}`}
                className={`${
                  isActive
                    ? "text-red-400 border-b-2 border-red-500 pb-1"
                    : "text-zinc-400 hover:text-white"
                } transition`}
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
