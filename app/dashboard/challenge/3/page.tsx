"use client";

import { useState, useEffect } from "react";
import { useConfettiFireworks } from "@/components/confetti/ConfettiFireworks";

export default function FinalChallenge() {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [loading, setLoading] = useState(false);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [message, setMessage] = useState("");
  const [challengeId, setChallengeId] = useState<number | null>(null);

  const { fire } = useConfettiFireworks();

  // From DB 
  useEffect(() => {
    async function fetchChallenge() {
      const res = await fetch("/api/challenges/3");
      if (!res.ok) return;

      const data = await res.json();
      setChallengeId(data.id);
    }

    fetchChallenge();
  }, []);


  useEffect(() => {
    async function checkIfSolved() {
      if (!challengeId) return;

      const res = await fetch(
        `/api/submissions/status/${challengeId}`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const data = await res.json();
      if (data.solved) {
        setAlreadySolved(true);
      }
    }

    checkIfSolved();
  }, [challengeId]);

  
  useEffect(() => {
    if (status === "correct") {
      fire({ duration: 5000, particleCount: 120 });
    }
  }, [status, fire]);

  const handleSubmit = async () => {
    if (!challengeId) return;

    setLoading(true);

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        challengeId,
        flag,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.status === 409) {
      setAlreadySolved(true);
      setStatus("idle");
      setMessage("Flag already captured.");
      return;
    }

    if (res.ok && data.correct) {
      setStatus("correct");
      setAlreadySolved(true);
      setMessage("Discovery Confirmed. Points awarded.");
    } else {
      setStatus("wrong");
      setMessage("Incorrect Date — Reevaluate the Records.");
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
          <p>
            Dr. Elena Marsh vanished after claiming she had made a historic discovery.
            Before disappearing, she left behind a final puzzle.
          </p>

          <p>
            The exact date of her discovery is hidden across artifacts,
            celestial references, ancient numbering systems, and encrypted fragments.
          </p>

          <p>
            Images may hide more than pixels.
            Comments may reveal more than text.
            Files may contain more than what they show.
          </p>

          <p className="text-white font-semibold">
            Recover the FLAG in format:
            <span className="text-red-500 font-bold"> CTF{"{DD-MM-YYYY}"}</span>
          </p>
        </div>
      </div>

      {/* ARCHIVE LINK */}
      <div className="bg-black border border-zinc-800 p-6 hover:border-red-600 transition-all duration-300">
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4">
          Archive Access
        </h3>

        <a
          href="https://tether007.github.io/challenge_3/"
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
          disabled={alreadySolved}
          className="w-full bg-black border border-zinc-700 p-4 text-white
          focus:outline-none focus:border-red-500 transition-all duration-300 disabled:opacity-50"
        />

        <button
          onClick={handleSubmit}
          disabled={alreadySolved || loading}
          className="mt-6 w-full py-3 bg-red-600 text-black font-black uppercase tracking-widest
          transition-all duration-300 hover:bg-white hover:text-red-600 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit →"}
        </button>

        {status !== "idle" && (
          <p
            className={`mt-4 font-bold uppercase tracking-wider ${
              status === "correct" ? "text-red-500" : "text-zinc-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

    </div>
  );
}