import { ROADMAP_PHASES, CHECKLIST, type ChecklistItem } from "@/lib/roadmap-data"
import type { Section } from "@/lib/planner"

function phaseFor(section: Section) {
  if (section.h.includes("প্রথম")) return "mvp"
  if (section.h.includes("দ্বিতীয়")) return "scale"
  if (section.h.includes("তৃতীয়")) return "growth"
  return "later"
}

export function RoadmapSections({ sections }: { sections: Section[] }) {
  const roadmap = sections.filter((s) => s.h.includes("ধাপ"))
  return <section className="mt-8 border-t border-border/60 pt-8">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Build sequence</p><h3 className="mt-1 text-2xl font-extrabold">ডেভেলপমেন্ট রোডম্যাপ</h3></div>
      <p className="max-w-sm text-right text-sm text-muted-foreground">সব ফিচার একসাথে না বানিয়ে, ব্যবসার প্রমাণ ও cashflow অনুযায়ী ধাপে এগোন।</p>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {roadmap.map((section) => { const phase = ROADMAP_PHASES.find((item) => item.id === phaseFor(section)) ?? ROADMAP_PHASES[3]; return <article key={section.h} className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
        <div className="flex items-start gap-3"><span className={`mt-1 size-3 shrink-0 rounded-full ${phase.color}`} /><div className="min-w-0"><h4 className="font-bold">{phase.title}</h4><p className="mt-1 text-xs font-medium text-muted-foreground">{phase.subtitle}</p></div></div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{phase.description}</p>
        <ul className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4 text-sm">{section.l.map((item) => <li key={item} className="flex gap-2"><span className="text-primary">✓</span><span>{item}</span></li>)}</ul>
      </article> })}
    </div>
  </section>
}

export function ProjectChecklist() {
  const groups = [...new Set(CHECKLIST.map((item) => item.group))]
  return <section className="mt-8 border-t border-border/60 pt-8">
    <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Developer handoff</p><h3 className="mt-1 text-2xl font-extrabold">লঞ্চের আগে চেকলিস্ট</h3><p className="mt-2 text-sm text-muted-foreground">Developer-এর সঙ্গে কাজ ভাগ করে নেওয়ার জন্য এই তালিকাটি ব্যবহার করুন।</p></div>
    <div className="grid gap-3 sm:grid-cols-2">{groups.map((group) => <div key={group} className="rounded-2xl border border-border/70 bg-card/50 p-4"><h4 className="mb-3 text-sm font-bold">{group}</h4><div className="flex flex-col gap-3">{CHECKLIST.filter((item) => item.group === group).map((item: ChecklistItem) => <label key={item.id} className="flex cursor-pointer gap-3 text-sm"><input type="checkbox" className="mt-0.5 size-4 accent-primary" /><span><span className="font-medium">{item.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.note}</span></span></label>)}</div></div>)}</div>
  </section>
}
