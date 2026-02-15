"use client";

import { useState, useEffect } from "react";
import { useConfettiFireworks } from "@/components/confetti/ConfettiFireworks";

export default function ForensicsChallenge() {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const { fire } = useConfettiFireworks();

  const correctFlag = "CTF{hidden_metadata_found}"; // change later

  useEffect(() => {
    if (status === "correct") {
      fire({ duration: 5000, particleCount: 100 });
    }
  }, [status, fire]);

  const handleSubmit = () => {
    if (flag.trim() === "cubbonpark_4") {
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
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header Info */}
      <div>
        <h2 className="text-4xl font-bold text-red-500">
          Digital Footprint
        </h2>

        <div className="flex gap-6 mt-3 text-sm text-zinc-400">
          <span>Category: Forensics</span>
          
        </div>
      </div>

      {/* Description */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-zinc-300 leading-relaxed">
         A mobile device was recovered as part of an active investigation.
         <br />
        The device has been forensically acquired using standard extraction procedures, and the full data dump has been provided to you as a compressed archive. The integrity of the evidence has been preserved. No alterations have been made beyond the extraction process.
         <br />
        As part of the digital forensics team, you are tasked with examining the contents of this device. The case hinges on identifying a specific, critical piece of information hidden within the data.
         <br />
        You are not being told what to look for. That determination is part of your job.
         <br />
        The archive may contain system artifacts, application data, caches, logs, media files, and other remnants typical of a modern smartphone. Some artifacts may be relevant. Others may not. Your responsibility is to separate signal from noise.
         <br />
        Approach this as you would a real-world forensic investigation:
         <br />
        Preserve structure.
         <br />
        Establish context.
         <br />
        Reconstruct activity.
<br />
        Correlate artifacts.
<br />  
        Draw defensible conclusions.
        <br /><br />
        All necessary evidence is contained within the provided files.
        <br /><br />
        When you are confident in your findings, submit the flag in the format
                  <br /><br />
          Flag format: <span className="text-red-400">CTF&#123;word_number&#125;</span>
        </p>
      </div>

      {/* Download Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Evidence</h3>

        <button
          onClick={handleDownload}
          className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition"
        >
          Download Evidence File
        </button>
      </div>

      {/* Hints */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Hints</h3>

        <ul className="space-y-2 text-zinc-400 text-sm">
          <li>• Check file metadata.</li>
          <li>• Try common decoding tools.</li>
          <li>• Don’t ignore file headers.</li>
        </ul>
      </div>

      {/* Flag Submission */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Submit Flag</h3>

        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="Enter flag..."
          className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-red-500"
        />

        <button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
        >
          Submit
        </button>

        {status === "correct" && (
          <p className="text-green-400 font-semibold">
             YES, YOU FOUND IT. LESSGOO
          </p>
        )}

        {status === "wrong" && (
          <p className="text-red-400 font-semibold">
            NOPE NOT RIGHT, TRY AGAIN
          </p>
        )}
      </div>

    </div>
  );
}
