"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CloudWatchForm from "@/components/formui/CloudWatch";

// client side veryfication , if the access is allowd
export default function AuthPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup");

  useEffect(() => {
    const introSolved = document.cookie
      .split("; ")
      .find((row) => row.startsWith("introSolved="))
      ?.split("=")[1];

    if (!introSolved) {
      router.push("/");//rollback 
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 font-mono">VERIFYING ACCESS...</div>
      </div>
    );
  }

  return <CloudWatchForm mode={mode} onModeChange={setMode} />;
}