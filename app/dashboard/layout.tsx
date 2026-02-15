"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const challenges = [
    { id: "1", name: "Challenge 1" },
    { id: "2", name: "Challenge 2" },
    { id: "3", name: "Challenge 3" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-red-500">
          CodeSprint 4.0
        </h1>

        <div className="flex gap-8">
          {challenges.map((challenge) => {
            const isActive = pathname === `/dashboard/challenge/${challenge.id}`;

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
          Score: <span className="text-white font-bold">120</span>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="p-10">
        {children}
      </main>

    </div>
  );
}
