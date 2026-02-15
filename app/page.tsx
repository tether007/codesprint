"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Intro() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const konamiRef = useRef<string[]>([]);
  const router = useRouter();

  const correctSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "B",
    "A",
  ];

  const handleSuccess = () => {
  document.cookie = "introSolved=true; path=/; max-age=84600"; 
  router.push("/auth");
};

  const handleKonamiCode = useCallback((e: KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;

    const allowed = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "B",
      "A",
    ];

    if (!allowed.includes(key)) return;

    konamiRef.current.push(key);

    if (konamiRef.current.length > correctSequence.length) {
      konamiRef.current.shift();
    }

    const matched =
      konamiRef.current.length === correctSequence.length &&
      correctSequence.every((val, i) => val === konamiRef.current[i]);

    if (matched) {
      konamiRef.current = [];
      handleSuccess();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKonamiCode);
    return () => window.removeEventListener("keydown", handleKonamiCode);
  }, [handleKonamiCode]);

  const handleInputSubmit = () => {
    const normalized = input.toLowerCase().trim();

    const validAnswers = [
      "up up down down left right left right b a",
      "konami",
      "konami code",
    ];

    if (validAnswers.some((ans) => normalized.includes(ans))) {
      handleSuccess();
    } else {
      setError("INVALID ACCESS CODE. TRY AGAIN.");
      setInput("");
      konamiRef.current = [];

      const modal = document.getElementById("spy-modal");
      modal?.classList.add("animate-shake");
      setTimeout(() => modal?.classList.remove("animate-shake"), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        id="spy-modal"
        className="relative w-full max-w-md rounded-xl border border-red-500/30 bg-zinc-950/95 p-6 shadow-xl"
        style={{
          boxShadow:
            "0 0 40px rgba(239,68,68,0.35), inset 0 0 25px rgba(0,0,0,0.5)",
        }}
      >
        <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
          <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-red-600 opacity-30 animate-pulse" />
          <div className="absolute inset-[2px] rounded-xl bg-zinc-950/95" />
        </div>

        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-red-500/30 to-transparent animate-[scan_4s_linear_infinite]" />
        </div>

        <div className="relative z-10 space-y-5 text-center">
          <div className="inline-block border border-red-500 px-5 py-2 rounded-full bg-black/80">
            <span className="text-xs font-mono tracking-widest text-red-500 font-bold">
              ■ CLASSIFIED ■
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white">
            SECURITY CLEARANCE
          </h2>

          <div className="bg-black/40 border border-red-500/20 rounded-lg p-4 text-gray-300 italic text-sm leading-relaxed">
          <div className="text-red-400/80 font-semibold not-italic text-xs uppercase tracking-wider mb-2">
            Quote by the Devs
          </div>
          "Climb the heavens twice, bow twice to the earth,
          sway west and east in balance,
          and seal it with B and A."
          </div>

          <div className="bg-black/40 border border-red-500/20 rounded-lg p-4 text-gray-300 italic text-sm leading-relaxed">
          <div className="text-red-400/80 font-semibold not-italic text-xs uppercase tracking-wider mb-2">
            HINT
          </div>
              To get an hint you need to do , what <strong><u>detectives</u> </strong> do. 
              <span hidden>Use you arrow keys and decode the quote</span>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInputSubmit();
            }}
            placeholder="Enter access code..."
            className="w-full rounded-lg bg-black/60 border border-red-500/40 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
          />

          {error && (
            <p className="text-red-500 font-mono text-sm">
              ⚠ {error}
            </p>
          )}

          <button
            onClick={handleInputSubmit}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-3 font-bold tracking-wide text-white hover:from-red-700 hover:to-red-800 transition"
          >
            AUTHENTICATE
          </button>

          <div className="text-xs text-gray-600 pt-2">
            GDG NMIT'26
          </div>
        </div>
      </div>
    </div>
  );
}