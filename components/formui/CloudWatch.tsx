"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CloudWatchForm({
  mode,
  onModeChange,
} : {
   mode: "login" | "signup";
   onModeChange: (m: "login" | "signup") => void;
}) {
  const [isTyping, setIsTyping] = useState(false);
  const cursorRef = React.useRef({ x: 0, y: 0 });
  const rafRef = React.useRef<number | null>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  //form states 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  const handleMouse = (e: MouseEvent) => {
    cursorRef.current = { x: e.clientX, y: e.clientY };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        const { x, y } = cursorRef.current;

        const offsetX = ((x / window.innerWidth) - 0.5) * 40;
        const offsetY = ((y / window.innerHeight) - 0.5) * 20;

        setEyePos({ x: offsetX, y: offsetY });
        rafRef.current = null;
      });
    }
  };

  window.addEventListener("mousemove", handleMouse);
  return () => {
    window.removeEventListener("mousemove", handleMouse);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


    //server side code
    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

    const payload =
      mode === "signup"
        ? { name, email, password }
        : { email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Authentication failed");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-zinc-900 backdrop-blur-md rounded-xl shadow-xl shadow-red-500/50 p-8 flex flex-col items-center gap-6 w-md border border-zinc-800">
        
        {/* Robot face */}
          <div className="relative w-70 h-40">
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-60 h-30 bg-gradient-to-b from-gray-300 to-gray-400 rounded-2xl border-4 border-red-500 flex justify-center items-center shadow-lg" style={{boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2), 0 4px 12px rgba(239,68,68,0.3)"}}>
              {/* Screen/Display */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-16 bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl border-2 border-blue-800 flex flex-col items-center justify-center" style={{boxShadow: "inset 0 0 8px rgba(0,0,0,0.8)"}}/>
              
              {/* Power indicator light */}
              <div className="absolute bottom-3 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{boxShadow: "0 0 8px rgb(239,68,68)"}}></div>
            </div>

            {["left", "right"].map((side, idx) => (
              <div
                key={side}
                className="absolute flex justify-center items-end overflow-hidden"
                style={{
                  top: 60,
                  left: idx === 0 ? 80 : 150,
                  width: 28,
                  height: isTyping
                    ? 4 
                    : blink
                    ? 6 
                    : 35, 
                  borderRadius: isTyping || blink ? "2px" : "50% / 60%",
                  backgroundColor: isTyping ? "black" : "white",
                  transition: "all 0.15s ease",
                }}
              >
                {!isTyping && (
                  <div
                    className="bg-black"
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      marginBottom: 6, // pupil at bottom
                      transform: `translate(${eyePos.x}px, 0px)`,
                      transition: "all 0.1s ease",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit}
          className="w-full flex flex-col gap-3 px-4">
          
          {mode === "signup" && (
          <div className="flex flex-col">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

          <div className="flex flex-col">
            <Label className="mb-1 text-base">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* <div className="flex flex-col">
            <Label>Username</Label>
            <Input placeholder="Username" />
          </div> */}  
          {/* username not req (not in schema) */}
          <div className="flex flex-col">
            <Label className="mb-1 text-base">Password</Label>
             <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              required
            />  
          </div>
          <Button type="submit" className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white">{loading ? "Signing up..." : "Submit"}</Button>
          <div className="text-sm text-center text-zinc-400">
          {mode === "signup" ? (
            <>
              Already started capturing???{" "}
              <button
                type="button"
                className="text-red-400 hover:underline"
                onClick={() => onModeChange("login")}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Newly Capturing flags???{" "}
              <button
                type="button"
                className="text-red-400 hover:underline"
                onClick={() => onModeChange("signup")}
              >
                Sign up
              </button>
            </>
          )}
        </div>

        </form>
      </div>
    </div>
  );
}
