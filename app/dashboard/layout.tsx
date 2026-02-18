"use client";
import Image from "next/image";
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
            const isActive = pathname.startsWith(`/dashboard/challenge/${challenge.id}`);

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

       
      </header>

      {/* PAGE CONTENT */}
      <main className="p-10">
        {children}
      </main>

    </div>
  );
}
