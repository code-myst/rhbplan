import Link from "next/link"
import type { Metadata } from "next"
import { LEARN_TOPICS } from "@/lib/learn-data"

export const metadata: Metadata = { title: "সহজ ভাষায় শিখুন · ই-কমার্স প্ল্যানার", description: "Website planning, developer handoff এবং database-এর গুরুত্বপূর্ণ শব্দ সহজ বাংলায় বুঝুন।" }

export default function LearnPage() {
  return <main className="dot-grid"><div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6"><Link href="/" className="text-sm font-semibold text-primary hover:underline">← প্ল্যানারে ফিরুন</Link><header className="mb-8 mt-5 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Decision library</p><h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">শব্দ নয়, সিদ্ধান্ত বুঝুন</h1><p className="mt-3 text-base leading-7 text-muted-foreground">Website বানানোর আগে roadmap, developer brief এবং database নিয়ে কথা বলার জন্য দরকারি বিষয়গুলো সহজ ভাষায় সাজানো।</p></header><div className="grid gap-4 md:grid-cols-2">{LEARN_TOPICS.map((topic) => <article key={topic.title} className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{topic.category}</span><span className="text-xs text-muted-foreground">{topic.english}</span></div><h2 className="mt-4 text-xl font-bold">{topic.title}</h2><p className="mt-2 leading-7 text-muted-foreground">{topic.description}</p><div className="mt-4 rounded-xl bg-muted/60 p-3 text-sm leading-6"><b>সহজ উদাহরণ:</b> {topic.example}</div></article>)}</div></div></main>
}
