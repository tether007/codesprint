"use client";

import { useState, useEffect } from "react";
import { useConfettiFireworks } from "@/components/confetti/ConfettiFireworks";

export default function ForensicsChallenge() {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const { fire } = useConfettiFireworks();

  const correctFlag = "CTF{cubbonpark_4}"; // change later

  useEffect(() => {
    if (status === "correct") {
      fire({ duration: 5000, particleCount: 100 });
    }
  }, [status, fire]);

  const handleSubmit = () => {
    if (flag.trim().toLowerCase() === correctFlag.toLowerCase()){
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/files/forensics1.zip");
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "forensics1.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 text-white font-mono">

  {/* HEADER */}
  <div className="border-b border-red-600 pb-6">
    <h2 className="text-5xl font-extrabold uppercase tracking-wider text-red-500">
      Digital FORENSICS
    </h2>

    <div className="flex gap-6 mt-4 text-sm text-zinc-500 uppercase tracking-widest">
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
      <span className="text-red-500 font-bold">CTF{"{word_digit}"}</span>
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
      <li>• Examine metadata thoroughly.</li>
      <li>• Verify file headers.</li>
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
        ✔ Flag Verified
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
