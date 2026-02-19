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

  /* Fetch challenge from DB */
  useEffect(() => {
    async function fetchChallenge() {
      const res = await fetch("/api/challenges/2");
      if (!res.ok) return;

      const data = await res.json();
      setChallengeId(data.id);
    }

    fetchChallenge();
  }, []);

  /* Check if already solved */
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

  /* Confetti */
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
      setMessage("Correct! Points awarded.");
    } else {
      setStatus("wrong");
      setMessage("Not quite. Look deeper.");
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

      {/* Description */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-zinc-300 leading-relaxed">
          You have been given access to a frontend application and its source code repository.
          <br /><br />
          The application works perfectly when run locally.
          However, the deployed version shows a vague 
          <span className="text-red-400"> "Service unavailable"</span> message.
          <br /><br />
          There are no visible errors in the application logic.
          There are no failing network requests.
          The backend appears to be reachable.
          <br /><br />
          The issue is subtle.
          It is not in the runtime.
          It is not in the React components.
          It is not in the API logic.
          <br /><br />
          Something about the way this application was built is not what it seems.
          <br /><br />
          Flag format: <span className="text-red-400">CTF&#123;something_here&#125;</span>
        </p>
      </div>

      {/* Resources */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Resources</h3>

        <div className="space-y-4 text-zinc-400 text-sm">
          <p>
            • GitHub Repository:
            <br />
            <a
              href="https://github.com/tether007/challenge_2.git"
              target="_blank"
              className="text-red-400 underline"
            >
              https://github.com/tether007/challenge_2.git
            </a>
          </p>

          <p>
            • Deployed Application:
            <br />
            <a
              href="https://challenge-2-red.vercel.app/"
              target="_blank"
              className="text-red-400 underline"
            >
              https://challenge-2-red.vercel.app/
            </a>
          </p>
        </div>
      </div>

      {/* Hinte sections */}

      

      {/* Submission */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Submit Flag</h3>

        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="Enter flag..."
          disabled={alreadySolved}
          className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-red-500 disabled:opacity-50"
        />

        <button
          onClick={handleSubmit}
          disabled={alreadySolved || loading}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p
            className={`font-semibold ${
              status === "correct"
                ? "text-green-400"
                : status === "wrong"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

    </div>
  );
}
