"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamSelectionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choice" | "create" | "join">("choice");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teamName }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        setError(data.error || "Failed to create team");
        setLoading(false);
        return;
      }

      setGeneratedCode(data.teamCode);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teamCode }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        setError(data.error || "Failed to join team");
        setLoading(false);
        return;
      }

      alert("Joined team successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "500px", margin: "0 auto", color: "white" }}>
      <h1>Team Setup</h1>

      {mode === "choice" && (
        <div>
          <button onClick={() => setMode("create")} style={buttonStyle}>
            Create Team
          </button>
          <button onClick={() => setMode("join")} style={buttonStyle}>
            Join Team
          </button>
        </div>
      )}

      {mode === "create" && !generatedCode && (
        <form onSubmit={handleCreateTeam}>
          <h2>Create Team</h2>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={inputStyle}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="button" onClick={() => setMode("choice")} style={buttonStyle}>
            Back
          </button>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {mode === "create" && generatedCode && (
        <div>
          <h2>Team Created!</h2>
          <p>Your team code is:</p>
          <h1 style={{ fontSize: "48px", color: "lime" }}>{generatedCode}</h1>
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              alert("Copied!");
            }}
            style={buttonStyle}
          >
            Copy Code
          </button>
          <button onClick={() => router.push("/dashboard")} style={buttonStyle}>
            Continue
          </button>
        </div>
      )}

      {mode === "join" && (
        <form onSubmit={handleJoinTeam}>
          <h2>Join Team</h2>
          <input
            type="text"
            placeholder="Team Code"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
            style={inputStyle}
            maxLength={6}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="button" onClick={() => setMode("choice")} style={buttonStyle}>
            Back
          </button>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Joining..." : "Join"}
          </button>
        </form>
      )}
    </div>
  );
}

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "15px",
  margin: "10px 0",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "15px",
  margin: "10px 0",
  fontSize: "16px",
  backgroundColor: "#1a1a1a",
  color: "white",
  border: "1px solid #333",
  borderRadius: "5px",
};