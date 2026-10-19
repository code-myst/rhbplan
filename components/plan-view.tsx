"use client";

import Link from "next/link";
import { useMemo } from "react";
import CopyButton from "./copy-button";
import { CONFIG } from "@/lib/config";
import { GLOSSARY } from "@/lib/planner-data";
import { buildPlan, type Answers } from "@/lib/planner";

export default function PlanView({ answers, onEdit, onReset }: { answers: Answers; onEdit: () => void; onReset: () => void }) {
  const { st, sections, text, who } = useMemo(() => buildPlan(answers), [answers]);
  return (
    <>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10"><i className="block h-full w-full bg-primary" /></div>
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">আপনার ই-কমার্স প্ল্যান</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">{who.n ? who.n + ", এটি" : "এটি"} আপনার উত্তরের ভিত্তিতে তৈরি। পাঠানোর আগে দেখে নিন।</p>

      <div className="my-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[st.fe, st.be, st.db, st.sv].map((a) => (
          <div key={a[0]} className="flow-box"><small className="block text-xs text-muted-foreground">{a[0]}</small><b className="block">{a[1]}</b></div>
        ))}
      </div>

      {sections.filter((s) => s.h !== "টেক স্ট্যাক").map((s) => (
        <div key={s.h} className="sec">
          <h3>{s.h}</h3>
          {s.w ? s.l.map((x, i) => <div key={i} className="warn">{x}</div>) : <ul className="list-disc space-y-0.5 pl-5">{s.l.map((x, i) => <li key={i}>{x}</li>)}</ul>}
        </div>
      ))}
      <div className="sec"><h3>টেক স্ট্যাকের কারণ</h3><p>{st.n}</p></div>
      <div className="sec">
        <h3>শব্দের মানে (সহজ ভাষায়)</h3>
        {GLOSSARY.map(([t, d]) => <details key={t} className="dtl"><summary>{t}</summary><p>{d}</p></details>)}
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button className="btn btn-outline btn-lg" onClick={onEdit}>তথ্য বদলান</button>
        <CopyButton text={text} />
        <button className="btn btn-outline btn-lg" onClick={() => window.print()}>প্রিন্ট</button>
        <a className="btn btn-success btn-lg" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`}>WhatsApp-এ পাঠান</a>
        <Link className="btn btn-primary btn-lg" href={`/db#r=${encodeURIComponent(text)}`}>ডাটাবেস স্ট্রাকচার বানান</Link>
        <button className="btn btn-outline btn-lg" onClick={onReset}>নতুন করে শুরু</button>
      </div>
    </>
  );
}
