"use client";

import { useState, useEffect } from "react";
import { useConfettiFireworks } from "@/components/confetti/ConfettiFireworks";

export default function WebPuzzleChallenge() {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [loading, setLoading] = useState(false);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [message, setMessage] = useState("");
  const [challengeId, setChallengeId] = useState<number | null>(null);

  const { fire } = useConfettiFireworks();

  // Fetch challenge from DB (by title or ID)
  useEffect(() => {
    async function fetchChallenge() {
      const res = await fetch("/api/challenges/2");
      if (!res.ok) return;

      const data = await res.json();
      setChallengeId(data.id);

      if (data.alreadySolved) {
        setAlreadySolved(true);
        setStatus("correct");
        setMessage("Flag already captured.");
      }
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

  // Fire confetti once
  useEffect(() => {
    if (status === "correct") {
      fire({ duration: 5000, particleCount: 100 });
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
      setMessage("Correct! Points awarded.");
    } else {
      setStatus("wrong");
      setMessage("Incorrect flag.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-red-500">
          Built Once
        </h2>
        <div className="flex gap-6 mt-3 text-sm text-zinc-400">
          <span>Category: Web</span>
        </div>
      </div>

      {/* DESCRIPTION TERMINAL BLOCK */}
      <div
        className="relative bg-black border border-red-600 p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,0,0.2)]"
        style={{
          clipPath:
            "polygon(0% 20px, 20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%)",
        }}
      >
        <h3 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-6">
          Mission Briefing
        </h3>

        <p className="text-zinc-400 leading-relaxed text-sm">
          You have been granted access to a frontend application and its full source code repository.
          <br /><br />
          On the surface, the application appears functional. It runs without errors locally.
          All components render as expected. API calls return valid responses.
          The build succeeds without warnings. Every log looks clean.
          <br /><br />
          Yet the deployed version tells a different story.
          Users are met with a vague{" "}
          <span className="text-red-500 font-semibold">"Service unavailable"</span>{" "}
          message — no stack trace, no indication of what went wrong, no obvious point of failure.
          <br /><br />
          The issue is not in the runtime. It is not in the React component tree.
          It is not in the API handlers or the network layer.
          The backend is reachable. The environment variables are set.
          There are no failing requests in the network tab.
          <br /><br />
          Something about the way this application was{" "}
          <span className="text-red-500 font-semibold">built</span> is not what it seems.
          The answer is not hidden in the logic — it is hidden in the structure.
          In the decisions made before a single line of user-facing code runs.
          <br /><br />
          You are given two resources: the source repository and the live deployment.
          Compare them carefully. Audit the build configuration. Trace the dependency tree.
          Examine what gets included — and what gets quietly left out.
          <br /><br />
          The flag is embedded in plain sight, waiting for the right set of eyes.
          <br /><br />
          Submit the flag in the format:{" "}
          <span className="text-red-500 font-bold">CTF&#123;something_here&#125;</span>
        </p>
      </div>

      {/* RESOURCES SECTION */}
      <div className="bg-black border border-zinc-800 p-6 hover:border-red-600 transition-all duration-300">
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4">
          Resources
        </h3>

        <ul className="space-y-4 text-zinc-400 text-sm">
          <li>
            • GitHub Repository:
            <br />
            <a
              href="https://github.com/tether007/challenge_2.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 underline hover:text-white transition-colors duration-200"
            >
              https://github.com/tether007/challenge_2.git
            </a>
          </li>
          <li>
            • Deployed Application:
            <br />
            <a
              href="https://challenge-2-red.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 underline hover:text-white transition-colors duration-200"
            >
              https://challenge-2-red.vercel.app/
            </a>
          </li>
        </ul>
      </div>

      {/* HINTS */}
      <div className="bg-black border border-zinc-800 p-6 hover:border-red-600 transition-all duration-300">
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4">
          Hints
        </h3>

        <ul className="space-y-3 text-zinc-400 text-sm">
          <li>• The answer is not in the source code logic — look at the build pipeline.</li>
          <li>• Compare what is committed to the repo versus what actually ships.</li>
          <li>• Configuration files can carry more than just settings.</li>
        </ul>
      </div>

      {/* FLAG SUBMISSION */}
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

        {status === "correct" && (
          <p className="text-red-500 font-bold mt-4 uppercase tracking-wider">
            ✔ Flag Verified — {message}
          </p>
        )}

        {status === "wrong" && (
          <p className="text-zinc-400 font-bold mt-4 uppercase tracking-wider">
            ✖ Incorrect Flag — Check build
          </p>
        )}
      </div>

    </div>
  );
} 