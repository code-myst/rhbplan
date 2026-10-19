import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import DbTool from "@/components/db-tool";

export const metadata: Metadata = { title: "ডাটাবেস স্ট্রাকচার জেনারেটর · ই-কমার্স প্ল্যানার" };

function loadStarters() {
  const dir = path.join(process.cwd(), "content", "starters");
  const out: Record<string, string> = {};
  for (const f of fs.readdirSync(dir)) out[f.replace(/\.txt$/, "")] = fs.readFileSync(path.join(dir, f), "utf8");
  return out;
}

export default function DbPage() {
  return (
    <main className="dot-grid">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6">
        <p className="mb-2"><Link href="/" className="text-sm font-semibold text-violet-300 hover:underline">← প্ল্যানারে ফিরুন</Link></p>
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">ডাটাবেস স্ট্রাকচার জেনারেটর</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">আপনার roadmap-এর feature list থেকে developer-এর জন্য table, relation, constraint ও starter structure তৈরি করুন। Production-এ দেওয়ার আগে generated blueprint review করুন।</p>
        </header>
        <DbTool starters={loadStarters()} />
      </div>
    </main>
  );
}
