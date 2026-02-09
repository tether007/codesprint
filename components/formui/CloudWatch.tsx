"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CloudWatchForm() {
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 40; // bigger range
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 20;
    setEyePos({ x: offsetX, y: offsetY });
  }, [cursor]);

  // Blinking every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-black backdrop-blur-md rounded-xl shadow-xl shadow-red-500/50 p-8 flex flex-col items-center gap-6 w-md border">
        
        {/* Cartoon Face */}
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
                    ? 4 // fully closed when typing password
                    : blink
                    ? 6 // temporary blink
                    : 35, // open eye
                  borderRadius: isTyping || blink ? "2px" : "50% / 60%",
                  backgroundColor: isTyping ? "black" : "white", // black line when typing
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
        <div className="w-full flex flex-col gap-3 px-4">
          <div className="flex flex-col">
            <Label className="mb-1 text-base">Name</Label>
            <Input placeholder="Your Name" />
          </div>
          <div className="flex flex-col">
            <Label className="mb-1 text-base">Email</Label>
            <Input type="email" placeholder="Your Email" />
          </div>
          <div className="flex flex-col">
            <Label className="mb-1 text-base">Username</Label>
            <Input placeholder="Username" />
          </div>
          <div className="flex flex-col">
            <Label className="mb-1 text-base">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
          </div>
          <Button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white">Submit</Button>
        </div>
      </div>
    </div>
  );
}
