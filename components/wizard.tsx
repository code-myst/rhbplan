"use client";

import { useEffect, useState } from "react";
import PlanView from "./plan-view";
import { FEATURE_INFO, GROUPS, QUESTIONS, type Opt } from "@/lib/planner-data";
import { arr, str, type Answers, type Who } from "@/lib/planner";

const KEY = "ecp";

interface ListProps { name: string; opts: Opt[]; type: "radio" | "checkbox"; selected: string[]; onPick: (v: string) => void; info?: Record<string, string>; tip?: string | null; setTip?: (v: string | null) => void }

function OptionList({ name, opts, type, selected, onPick, info, tip, setTip }: ListProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-2.5">
      {opts.map(([id, label, hint]) => {
        const tipText = info?.[id];
        const open = tip === name + id;
        return (
          <div key={id} className="relative">
            <label className="opt h-full">
              <input type={type} name={name} value={id} checked={selected.includes(id)} onChange={() => onPick(id)} />
              <span><b className="block font-semibold leading-snug">{label}</b>{hint && <small className="block text-sm leading-snug text-muted-foreground">{hint}</small>}</span>
              {tipText && (
                <button type="button" aria-label="এই ফিচারের লাভ" aria-expanded={open}
                  className="btn btn-outline ml-auto h-7 w-7 flex-none self-start rounded-full p-0 font-serif italic"
                  onClick={(e) => { e.preventDefault(); setTip?.(open ? null : name + id); }}>i</button>
              )}
            </label>
            {tipText && open && <div className="absolute inset-x-0 top-[calc(100%+4px)] z-10 rounded-md border border-primary bg-card px-3 py-2 text-sm shadow-xl">{tipText}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function Wizard() {
  const [a, setA] = useState<Answers>({});
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(false);
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setA(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(a)); } catch {} }, [a, ready]);

  const go = (n: number) => { setI(n); setTip(null); window.scrollTo({ top: 0 }); };
  const setOne = (id: string, v: string) => setA((p) => ({ ...p, [id]: v }));
  const toggle = (id: string, v: string) => setA((p) => { const cur = arr(p, id); return { ...p, [id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }; });
  const setWho = (k: keyof Who, v: string) => setA((p) => ({ ...p, who: { ...((p.who as Who) ?? {}), [k]: v } }));

  const done = i >= QUESTIONS.length;
  const q = done ? null : QUESTIONS[i];
  const who = (a.who as Who | undefined) ?? {};

  return (
    <div className="grid gap-7 lg:grid-cols-[230px_1fr]">
      <nav className="no-print hidden lg:block" aria-label="ধাপসমূহ">
        <ol className="sticky top-20 m-0 list-none p-0">
          {QUESTIONS.map((x, j) => {
            const state = j < i || done ? "done" : j === i ? "cur" : "";
            return (
              <li key={x.id}
                className={`border-l-[3px] px-3 py-1.5 text-sm ${state === "cur" ? "border-primary bg-white/[0.04] font-semibold text-foreground" : state === "done" ? "cursor-pointer border-success text-foreground hover:bg-white/[0.03]" : "border-white/10 text-muted-foreground"}`}
                onClick={() => state === "done" && go(j)}>
                {x.s}
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="card card-sheen glass p-5 sm:p-7" aria-live="polite">
        {done || !q ? (
          <PlanView answers={a} onEdit={() => go(QUESTIONS.length - 1)} onReset={() => { setA({}); go(0); }} />
        ) : (
          <>
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10"><i className="block h-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.round((i / QUESTIONS.length) * 100)}%` }} /></div>
            <h2 className="text-2xl font-extrabold leading-snug tracking-tight">{q.t}</h2>
            {q.h && <p className="mb-4 mt-1 text-sm text-muted-foreground">{q.h}</p>}
            {!q.h && <div className="mb-4" />}

            {q.k === "s" && <OptionList name={q.id} opts={q.o ?? []} type="radio" selected={[str(a, q.id) ?? ""]} onPick={(v) => setOne(q.id, v)} />}

            {q.k === "m" && (
              <>
                <OptionList name={q.id} opts={q.o ?? []} type="checkbox" selected={arr(a, q.id)} onPick={(v) => toggle(q.id, v)} />
                {q.q2 && (
                  <fieldset className="mt-6">
                    <legend className="mb-2 font-bold">{q.q2.t}</legend>
                    <OptionList name={q.q2.id} opts={q.q2.o} type="radio" selected={[str(a, q.q2.id) ?? ""]} onPick={(v) => setOne(q.q2!.id, v)} />
                  </fieldset>
                )}
              </>
            )}

            {q.k === "g" && GROUPS.map(([g, items]) => (
              <fieldset key={g} className="mb-5">
                <legend className="mb-2 font-bold">{g}</legend>
                <OptionList name="feat" opts={items.map((s) => { const p = s.split("|"); return [p[0], p[1]] as Opt; })} type="checkbox" selected={arr(a, "feat")} onPick={(v) => toggle("feat", v)} info={FEATURE_INFO} tip={tip} setTip={setTip} />
              </fieldset>
            ))}

            {q.k === "f" && (
              <>
                <label className="fld"><span>আপনার নাম</span><input value={who.n ?? ""} onChange={(e) => setWho("n", e.target.value)} /></label>
                <label className="fld"><span>ফোন/WhatsApp নম্বর</span><input inputMode="tel" value={who.p ?? ""} onChange={(e) => setWho("p", e.target.value)} /></label>
                <label className="fld"><span>ব্যবসা ও পণ্যের ধরন</span><input value={who.b ?? ""} onChange={(e) => setWho("b", e.target.value)} /></label>
                <label className="fld"><span>অতিরিক্ত কিছু জানাতে চান?</span><textarea rows={3} value={who.x ?? ""} onChange={(e) => setWho("x", e.target.value)} /></label>
              </>
            )}

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button className="btn btn-outline btn-lg" disabled={i === 0} onClick={() => go(i - 1)}>আগের ধাপ</button>
              <button className="btn btn-primary btn-lg" disabled={q.k === "s" && !str(a, q.id)} onClick={() => go(i + 1)}>{i === QUESTIONS.length - 1 ? "প্ল্যান তৈরি করুন" : "পরের ধাপ"}</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
