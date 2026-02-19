import Link from "next/link";
export default function DashboardHome() {
  const challenges = [
  {
    id: 1,
    title: "Digital Forensics",
    description:
      "Think like a forensic analyst. Every file, every byte, every anomaly matters. Search thoroughly and extract the hidden flag from the evidence.",
  },
  {
    id: 2,
    title: "Web Exploitation",
    description:
      "Explore the surface. Then go deeper. Break assumptions, identify vulnerabilities, and uncover the hidden flag.",
  },
  {
    id: 3,
    title: "Final Sprint",
    description:
      "Precision. Speed. Strategy. This final challenge will push your limits. One insight could win everything.",
  },
];

  return (
   <div className="space-y-16 px-6">

  {/* Header */}
  <div className="text-center">
    <h1 className="text-5xl font-extrabold uppercase tracking-wider text-white">
      Welcome to <span className="text-red-500">CodeSprint 4.0</span>
    </h1>
    <p className="text-zinc-500 mt-4 font-mono">
      Solve all 3 challenges. Only the sharpest teams survive.
    </p>
  </div>

  {/* Cards */}
  <div className="grid md:grid-cols-3 gap-10">

    {challenges.map((challenge) => (
      <div
        key={challenge.id}
        className="relative p-8 bg-black border border-red-600
        transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,0,0.25)]"
        style={{
          clipPath:
            "polygon(0% 20px, 20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%)",
        }}
      >
        {/* subtle background glow */}
        <div className="absolute inset-0 bg-red-600/5 opacity-0 hover:opacity-100 transition duration-500 blur-2xl"></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-red-500 uppercase tracking-wide">
            {challenge.title}
          </h3>

          <div className="h-[2px] w-12 bg-white mt-2 mb-4"></div>

          <p className="text-zinc-400 font-mono text-sm leading-relaxed">
            {challenge.description}
          </p>

          <Link href={`/dashboard/challenge/${challenge.id}`}>
            <button
              className="mt-6 w-full py-3 bg-red-600 text-black font-black uppercase tracking-widest
              transition-all duration-300 hover:bg-white hover:text-red-600"
            >
              START CHALLENGE
            </button>
          </Link>
        </div>
      </div>
    ))}

  </div>
</div>

  );
}
