"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CopyButton from "./copy-button";
import Erd from "./erd";
import FlowChain from "./flow-chain";
import { AUTOMATION_LABELS, DB_GLOSSARY, FEATURE_LABELS, GUIDE, NO_TABLE, NO_TABLE_NOTE, SAMPLE_REPORT, STARTER_FILES, STARTER_STEPS } from "@/lib/db-data";
import { buildTables, flows, generateCode, parseField, parseReport, sampleSql, typeName, type Fmt, type Parsed } from "@/lib/db-generate";

const TYPE_NAME = { s: "স্ট্যাটিক", d: "ডায়নামিক", m: "মার্কেটপ্লেস" } as const;

export default function DbTool({ starters }: { starters: Record<string, string> }) {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [fmt, setFmt] = useState<Fmt>("pg");
  const outRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(false);

  function generate(t: string) {
    setMsg("");
    if (t.trim().length < 10) { setMsg("আগে প্ল্যানারের রিপোর্ট পেস্ট করুন।"); setParsed(null); return; }
    const p = parseReport(t);
    if (!p.ok) { setMsg("রিপোর্টে সাইটের ধরন, ডাটাবেস বা ফিচার কিছুই পাওয়া যায়নি। প্ল্যানারের কপি করা লেখা পেস্ট করুন।"); return; }
    setParsed(p); setFmt(p.fmt); setScroll(true);
  }

  useEffect(() => {
    try {
      if (window.location.hash.startsWith("#r=")) {
        const r = decodeURIComponent(window.location.hash.slice(3));
        if (r) { setText(r); generate(r); }
      }
    } catch {}
  }, []);

  useEffect(() => { if (scroll && parsed) { outRef.current?.scrollIntoView({ behavior: "smooth" }); setScroll(false); } }, [scroll, parsed]);

  const T = useMemo(() => (parsed ? buildTables(parsed, fmt) : []), [parsed, fmt]);
  const code = useMemo(() => generateCode(T, fmt), [T, fmt]);
  const sample = useMemo(() => (parsed && fmt === "pg" && parsed.ty !== "s" ? sampleSql(parsed) : ""), [parsed, fmt]);
  const fl = useMemo(() => (parsed ? flows(parsed) : null), [parsed]);

  return (
    <>
      <section className="card glass mb-5 p-5">
        <label className="mb-1 block text-sm font-semibold" htmlFor="rep">প্ল্যানারের রিপোর্ট (কপি করা লেখা)</label>
        <textarea id="rep" className="sel min-h-[190px] resize-y" placeholder="এখানে পেস্ট করুন" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex flex-wrap gap-3">
          <button className="btn btn-primary btn-lg" onClick={() => generate(text)}>স্ট্রাকচার বানান</button>
          <button className="btn btn-outline btn-lg" onClick={() => { setText(SAMPLE_REPORT); generate(SAMPLE_REPORT); }}>নমুনা রিপোর্ট বসান</button>
        </div>
        {msg && <p role="alert" className="mt-3 font-semibold text-red-400">{msg}</p>}
      </section>

      <div ref={outRef}>
        {parsed && (
          <div className="space-y-5">
            <section className="card glass p-5">
              <h2 className="mb-2 text-xl font-bold">রিপোর্ট থেকে যা পাওয়া গেছে</h2>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-pri">ধরন: {TYPE_NAME[parsed.ty]}</span>
                <span className="badge badge-pri">ডাটাবেস: {parsed.db || "-"}</span>
                <span className="badge badge-sec">ফিচার: {Object.keys(parsed.F).length}টি</span>
                <span className="badge badge-sec">অটোমেশন: {Object.keys(parsed.A).length}টি</span>
              </div>
              {Object.keys(parsed.F).length === 0 && <div className="note">রিপোর্টে কোনো ফিচার পাওয়া যায়নি, তাই শুধু মূল টেবিলগুলো বানানো হয়েছে। প্ল্যানারের &quot;কপি করুন&quot; বাটনের লেখা পেস্ট করছেন কিনা দেখুন।</div>}
              {Object.keys(parsed.F).some((k) => NO_TABLE.includes(k)) && (
                <p className="mt-3 text-sm"><b>আলাদা টেবিল লাগবে না:</b> {Object.keys(parsed.F).filter((k) => NO_TABLE.includes(k)).map((k) => `${FEATURE_LABELS[k]} (${NO_TABLE_NOTE[k]})`).join("، ")}</p>
              )}
              <label className="mb-1 mt-4 block text-sm font-semibold" htmlFor="fmt">আউটপুটের ধরন</label>
              <select id="fmt" className="sel" value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)}>
                <option value="pg">PostgreSQL (SQL)</option>
                <option value="fs">Firestore (কালেকশন)</option>
                <option value="json">JSON ফাইল (স্ট্যাটিক)</option>
              </select>
            </section>

            <section className="card glass p-5">
              <h2 className="mb-2 text-xl font-bold">টেবিল ও কলাম ({T.length}টি)</h2>
              {T.map((x) => (
                <details key={x.n} className="dtl">
                  <summary><b>{x.n}</b><small className="ml-2 text-muted-foreground">{x.w}</small></summary>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead><tr><th className="px-3 py-1 font-medium">কলাম</th><th className="px-3 py-1 font-medium">ধরন</th><th className="px-3 py-1 font-medium">নোট</th></tr></thead>
                      <tbody>
                        {x.f.map((s) => { const f = parseField(s); return (
                          <tr key={s} className="border-t border-white/10"><td className="px-3 py-1 text-foreground">{f.c}</td><td className="px-3 py-1">{typeName(f)}</td><td className="px-3 py-1">{f.u ? "ইউনিক " : ""}{f.nl ? "ঐচ্ছিক" : ""}</td></tr>
                        ); })}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
              {T.some((x) => x.f.some((s) => parseField(s).ref)) && (
                <>
                  <h2 className="mb-1 mt-5 text-xl font-bold">সম্পর্ক</h2>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {T.flatMap((x) => x.f.map(parseField).filter((f) => f.ref).map((f) => <li key={x.n + f.c}>{x.n} → {f.ref} ({f.c})</li>))}
                  </ul>
                </>
              )}
              {fmt === "fs" && <div className="note">Firestore-এ order_items আলাদা কালেকশনের বদলে orders ডকুমেন্টের ভেতরে অ্যারে হিসেবে রাখলে রিড খরচ কমে। orders-এ (user_id, created_at) কম্পোজিট ইনডেক্স লাগবে।</div>}
              {fmt === "pg" && <div className="note">gen_random_uuid() Postgres 13-এ বা তার পরে সরাসরি কাজ করে। Neon ও Supabase-এ কোনো এক্সটেনশন লাগে না।</div>}
            </section>

            <section className="card glass p-5">
              <h2 className="text-xl font-bold">ER ডায়াগ্রাম</h2>
              <p className="mb-2 text-sm text-muted-foreground">প্রতিটি বক্স একটি টেবিল। PK মানে নিজের ID, FK মানে অন্য টেবিলের ID। তীর দেখায় কোন টেবিল কোনটির সাথে যুক্ত। সব কলাম উপরের তালিকায় আছে।</p>
              <div className="overflow-x-auto"><Erd tables={T} /></div>
            </section>

            {fl && (
              <section className="card glass p-5">
                <h2 className="text-xl font-bold">ডেটা প্রবাহ ও ইউজার জার্নি</h2>
                <h3 className="mt-3 font-bold">ডেটা কোথা দিয়ে যায়</h3>
                <FlowChain items={fl.data} />
                {fl.ex.length > 0 && <p className="mb-2 text-sm"><b>বাইরের সেবা:</b> {fl.ex.join(", ")}</p>}
                <h3 className="mt-3 font-bold">গ্রাহকের যাত্রা (কোন ধাপে কোন টেবিল)</h3>
                <FlowChain items={fl.customer} />
                <h3 className="mt-3 font-bold">অ্যাডমিনের যাত্রা</h3>
                <FlowChain items={fl.admin} />
              </section>
            )}

            <section className="card glass p-5">
              <h2 className="mb-2 text-xl font-bold">কোড</h2>
              <CopyButton text={code} className="btn btn-primary btn-lg" />
              <pre className="pre">{code}</pre>
            </section>

            <section className="card glass p-5">
              <h2 className="mb-2 text-xl font-bold">কোড কোথায় বসাবেন</h2>
              <ol className="list-decimal space-y-1 pl-6">{GUIDE[fmt].map((x) => <li key={x}>{x}</li>)}</ol>
            </section>

            {sample && (
              <section className="card glass p-5">
                <h2 className="text-xl font-bold">নমুনা ডেটা ও পরীক্ষা</h2>
                <p className="mb-2 text-sm text-muted-foreground">টেবিল বানানোর পর এটি Run করলে কয়েকটি নমুনা তথ্য ঢুকবে। তারপর পরীক্ষার কোয়েরি চালিয়ে দেখুন সবকিছু ঠিক আছে কিনা।</p>
                <CopyButton text={sample} className="btn btn-primary btn-lg" />
                <pre className="pre">{sample}</pre>
              </section>
            )}

            <section className="card glass p-5">
              <h2 className="text-xl font-bold">স্টার্টার কোড (চালু করার মতো ছোট নমুনা)</h2>
              <p className="mb-2 text-sm text-muted-foreground">ফোল্ডারে নিচের ফাইলগুলো এই নামে বানিয়ে কোড বসান। নাম, ছবি ও রং পরে নিজের মতো বদলে নিন।</p>
              {STARTER_FILES[fmt].map(([name, key]) => {
                const content = starters[key.replace(/^st-/, "")] ?? "";
                return (
                  <div key={key} className="mb-3">
                    <h3 className="mt-3 font-bold">{name}</h3>
                    <CopyButton text={content} className="btn btn-outline btn-sm mt-1" />
                    <pre className="pre">{content}</pre>
                  </div>
                );
              })}
              <h3 className="mt-4 font-bold">চালানোর নিয়ম</h3>
              <ol className="list-decimal space-y-1 pl-6">{STARTER_STEPS[fmt].map((x) => <li key={x}>{x}</li>)}</ol>
            </section>

            <section className="card glass p-5">
              <h2 className="mb-2 text-xl font-bold">শব্দের মানে (সহজ ভাষায়)</h2>
              {DB_GLOSSARY.map(([t, d]) => <details key={t} className="dtl"><summary><b>{t}</b></summary><p>{d}</p></details>)}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
