"use client";
import { useRef, useState, useEffect, useCallback, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Intro() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const konamiRef = useRef<string[]>([]);
  const router = useRouter();

  const correctSequence = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight",
    "B","A"
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSuccess = () => {
    document.cookie = "introSolved=true; path=/; max-age=84600";
    router.push("/auth");
  };
  
  const handleKonamiCode = useCallback((e: KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    const allowed = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","B","A"];
    if (!allowed.includes(key)) return;

    konamiRef.current.push(key);
    if (konamiRef.current.length > correctSequence.length) {
      konamiRef.current.shift();
    }

    const matched =
      konamiRef.current.length === correctSequence.length &&
      correctSequence.every((v, i) => v === konamiRef.current[i]);

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
    const valid = [
      "up up down down left right left right b a",
      "konami",
      "konami code",
    ];

    if (valid.some((ans) => normalized.includes(ans))) {
      handleSuccess();
    } else {
      setError("INVALID ACCESS CODE. TRY AGAIN.");
      setInput("");
      konamiRef.current = [];
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const containerStyle: CSSProperties = {
    background: "radial-gradient(circle at center, #220000 0%, #000 60%)",
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  };

  const cardStyle: CSSProperties = {
    background: "#000",
    border: "2px solid #ff0000",
    boxShadow: "0 0 60px rgba(255,0,0,0.5)",
    width: "100%",
    maxWidth: "650px",
    clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)",
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      {hasMounted &&
        [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: "100vw", opacity: [0, 0.5, 0] }}
            transition={{
              duration: Math.random() * 4 + 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 250 + 150}px`,
              height: "1px",
              background: "linear-gradient(90deg, transparent, #ff0000, transparent)",
            }}
          />
        ))}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: shake ? [1, 0.98, 1.02, 0.98, 1] : 1,
          opacity: 1,
        }}
        transition={{ duration: 0.4 }}
        style={cardStyle}
      >
        {[
          { top: 0, left: 0, transform: "rotate(0deg)" },
          { top: 0, right: 0, transform: "rotate(90deg)" },
          { bottom: 0, right: 0, transform: "rotate(180deg)" },
          { bottom: 0, left: 0, transform: "rotate(270deg)" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: "24px",
              height: "24px",
              borderTop: "3px solid #ff0000",
              borderLeft: "3px solid #ff0000",
            }}
          />
        ))}

        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(255,0,0,0.3)",
            textAlign: "center",
            fontFamily: '"Impact", sans-serif',
            letterSpacing: "0.25em",
            color: "#ff0000",
          }}
        >
          ■ CLASSIFIED ■
        </div>

        <div style={{ padding: "30px" }}>
          <div
            style={{
              color: "#fff",
              fontSize: "0.95rem",
              fontStyle: "italic",
              marginBottom: "25px",
              lineHeight: "1.6",
              fontFamily: "monospace",
            }}
          >
            "Climb the heavens twice, bow twice to the earth, sway west and east in balance, and seal it with B and A."
          </div>

          <div
            style={{
              color: "#999",
              fontSize: "0.85rem",
              marginBottom: "25px",
              fontFamily: "monospace",
            }}
          >
            To get a hint you need to do what{" "}
            <span style={{ color: "#ff0000", fontWeight: "bold" }}>
              detectives
            </span>{" "}
            do.
            <span style={{ display: "none" }}>
              Use your arrow keys and decode the quote.
            </span>
          </div>

          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
            placeholder="Enter access code..."
            style={{
              width: "100%",
              padding: "14px",
              background: "#000",
              border: "1px solid rgba(255,0,0,0.4)",
              color: "#fff",
              fontFamily: "monospace",
              outline: "none",
            }}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  border: "1px solid #ff0000",
                  background: "rgba(255,0,0,0.1)",
                  color: "#ff0000",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleInputSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "14px",
              background: "transparent",
              border: "2px solid #ff0000",
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            AUTHENTICATE
          </motion.button>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,0,0,0.3)",
            padding: "15px",
            textAlign: "center",
            color: "#555",
            fontSize: "0.75rem",
            fontFamily: "monospace",
          }}
        >
          GDG NMIT'26
        </div>
      </motion.div>
    </div>
  );
}