"use client";

import { useState } from "react";

export default function CopyButton({ text, className = "btn btn-outline btn-lg", label = "কপি করুন" }: { text: string; className?: string; label?: string }) {
  const [msg, setMsg] = useState(label);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("কপি হয়েছে");
    } catch {
      setMsg("কপি হয়নি, হাতে নকল করুন");
    }
  }
  return <button type="button" className={className} onClick={copy}>{msg}</button>;
}
