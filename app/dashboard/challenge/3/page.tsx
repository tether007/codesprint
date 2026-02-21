"use client";

import { useState, useEffect } from "react";
import { useConfettiFireworks } from "@/components/confetti/ConfettiFireworks";

export default function FinalChallenge() {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const { fire } = useConfettiFireworks();

  const correctFlag = "CTF{25-10-2021}"; // change if needed

  useEffect(() => {
    if (status === "correct") {
      fire({ duration: 5000, particleCount: 120 });
    }
  }, [status, fire]);

  const handleSubmit = () => {
    if (flag.trim() === correctFlag) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 text-white font-mono">

      {/* HEADER */}
      <div className="border-b border-red-600 pb-6">
        <h2 className="text-5xl font-extrabold uppercase tracking-wider text-red-500">
          When History Was Made
        </h2>

        <div className="flex gap-6 mt-4 text-sm text-zinc-500 uppercase tracking-widest">
          <span>Category: Final Challenge</span>
        </div>
      </div>

      {/* MISSION BRIEFING */}
      <div
        className="relative bg-black border border-red-600 p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,0,0.2)]"
        style={{
          clipPath:
            "polygon(0% 20px, 20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%)",
        }}
      >
        <h3 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-6">
          Final Briefing
        </h3>

        <div className="text-zinc-400 text-sm space-y-6 leading-relaxed">
            <div>
                <p>
                Dr. Elena Marsh vanished after claiming she had made a historic discovery.
                Before disappearing, she left behind a final puzzle.
                </p>
            </div>

            <div>
                <p>
                She believed that only those who could think like the ancients — 
                through symbols, stars, numbers, and hidden fragments — 
                would uncover the exact date of her discovery.
                </p>
                <p className="mt-2">
                The date is not written anywhere directly.
                </p>
            </div>

            <div>
                <p>
                It has been divided into parts and concealed across artifacts,
                source code, metadata, and encrypted files.
                </p>
                <p className="mt-2">
                Every detail matters. Images may hide more than pixels.
                Comments may reveal more than text.
                Clues may confirm each other.
                </p>
            </div>

            <div>
                <h3 className="text-white font-semibold text-base mb-2">
                Your Objective
                </h3>
                <p>
                Recover the FLAG in <span className="text-red-500 font-bold">CTF{"{DD-MM-YYYY}"}</span> format.
                </p>
            </div>

            <div>
                <h3 className="text-white font-semibold text-base mb-2">
                To Succeed, You Must
                </h3>
                <ul className="list-disc list-inside space-y-1">
                <li>Interpret ancient numbering systems</li>
                <li>Decode celestial references</li>
                <li>Solve mathematical constructions</li>
                <li>Reconstruct a fragmented password</li>
                <li>Extract hidden evidence</li>
                </ul>
            </div>

            <div>
                <p>
                Search thoroughly. Think logically. Verify every assumption.
                </p>
                <p className="mt-2 font-medium text-white">
                The truth is there — but only for those patient enough to assemble it.
                </p>
            </div>

            </div>
      </div>

      {/* WEBSITE LINK SECTION */}
      <div className="bg-black border border-zinc-800 p-6 hover:border-red-600 transition-all duration-300">
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4">
          Archive Access
        </h3>

        <a
          href="https://your-marsh-ctf-link.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-red-600 text-black font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-red-600"
        >
          Enter Archive →
        </a>
      </div>

      {/* FLAG SUBMISSION */}
      <div
        className="bg-black border border-red-600 p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,0,0.25)]"
        style={{
          clipPath:
            "polygon(0% 15px, 15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%)",
        }}
      >
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-widest mb-6">
          Submit Flag
        </h3>

        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="CTF{...}"
          className="w-full bg-black border border-zinc-700 p-4 text-white
          focus:outline-none focus:border-red-500 transition-all duration-300"
        />

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 bg-red-600 text-black font-black uppercase tracking-widest
          transition-all duration-300 hover:bg-white hover:text-red-600"
        >
          Submit →
        </button>

        {status === "correct" && (
          <p className="text-red-500 font-bold mt-4 uppercase tracking-wider">
            ✔ Discovery Confirmed
          </p>
        )}

        {status === "wrong" && (
          <p className="text-zinc-400 font-bold mt-4 uppercase tracking-wider">
            ✖ Incorrect Date — Reevaluate the Records
          </p>
        )}
      </div>

    </div>
  );
}