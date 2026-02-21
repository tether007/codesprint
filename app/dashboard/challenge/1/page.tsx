"use client";

import { useState, useEffect } from "react";
import { useConfettiFireworks } from "@/components/confetti/ConfettiFireworks";

export default function ForensicsChallenge() {
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
      const res = await fetch("/api/challenges/1");
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

  const handleDownload = async () => {
    try {
      const response = await fetch("/files/CTF_forensics.zip");
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "CTF_forensics.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-red-500">
          Digital Footprint
        </h2>
        <div className="flex gap-6 mt-3 text-sm text-zinc-400">
          <span>Category: Forensics</span>
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

        <p className="text-zinc-400 leading-relaxed space-y-3 text-sm">
          A mobile device was recovered during an active investigation.
          <br /><br />
          The device has been forensically acquired and preserved.
          Your task is to analyze the extracted archive and uncover the
          critical piece of hidden information.
          <br /><br />
          You are not told what to find.
          That determination is part of your responsibility.
          <br /><br />
          Separate signal from noise. Reconstruct activity.
          Correlate artifacts. Draw defensible conclusions.
          <br /><br />
          Submit the flag in the format:
          <br />
          <span className="text-red-500 font-bold">CTF{"{place_digit}"}</span>
        </p>
      </div>

      {/* EVIDENCE SECTION */}
      <div className="bg-black border border-zinc-800 p-6 hover:border-red-600 transition-all duration-300">
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4">
          Evidence Archive
        </h3>

        <button
          onClick={handleDownload}
          className="px-8 py-3 bg-red-600 text-black font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-red-600"
        >
          Download Evidence →
        </button>
      </div>

      {/* HINTS */}
      <div className="bg-black border border-zinc-800 p-6 hover:border-red-600 transition-all duration-300">
        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4">
          Hints
        </h3>

        <ul className="space-y-3 text-zinc-400 text-sm">
          <li>• Deleted does not mean gone.</li>
          <li>• Applications remember more than users do.</li>
          <li>• Consider decoding artifacts.</li>
        </ul>
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

        {status === "correct" && (
          <p className="text-red-500 font-bold mt-4 uppercase tracking-wider">
            ✔ Flag Verified — {message}
          </p>
        )}

        {status === "wrong" && (
          <p className="text-zinc-400 font-bold mt-4 uppercase tracking-wider">
            ✖ Incorrect Flag — Reassess Evidence
          </p>
        )}
      </div>

    </div>
  );
}