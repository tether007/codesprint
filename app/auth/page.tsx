"use client";

import { useState } from "react";
import CloudWatchForm from "@/components/formui/CloudWatch";

export default function AuthPage() {

  //to swap login n signup
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return <CloudWatchForm mode={mode} onModeChange={setMode} />;
}
