import { CONFIG } from "./config";
import { GROUPS, QUESTIONS, SAFE } from "./planner-data";

export interface Who { n?: string; p?: string; b?: string; x?: string }
export type Answers = { [key: string]: string | string[] | Who | undefined };

export const str = (a: Answers, k: string) => (typeof a[k] === "string" ? (a[k] as string) : undefined);
export const arr = (a: Answers, k: string) => (Array.isArray(a[k]) ? (a[k] as string[]) : []);

export const FM: Record<string, { l: string; p: number }> = {};
GROUPS.forEach(([, items]) => items.forEach((s) => { const [id, l, p] = s.split("|"); FM[id] = { l, p: +p }; }));

export function lab(id: string, v?: string): string {
  const opts = QUESTIONS.flatMap((q) => [...(q.id === id ? q.o ?? [] : []), ...(q.q2?.id === id ? q.q2.o : [])]);
  return opts.find((o) => o[0] === v)?.[1] ?? "-";
}

export interface Stack { fe: [string, string]; be: [string, string]; db: [string, string]; sv: [string, string]; n: string }

export function stack(a: Answers): Stack {
  const t = str(a, "type"), sc = Math.max(+(str(a, "prod") ?? 1) || 1, +(str(a, "ord") ?? 1) || 1), seo = str(a, "seo");
  if (t === "static") return { fe: ["ফ্রন্টএন্ড", "HTML, CSS, JS"], be: ["ব্যাকএন্ড", "নেই, WhatsApp/ফোনে অর্ডার"], db: ["ডাটাবেস", "JSON ফাইল বা Google Sheet"], sv: ["হোস্টিং", "Netlify বা GitHub Pages, বিনামূল্যে"], n: "কম খরচ ও দ্রুত লোড। অর্ডার ম্যানেজমেন্ট হাতে করতে হবে।" };
  if (t === "mkt") return { fe: ["ফ্রন্টএন্ড", "Next.js"], be: ["ব্যাকএন্ড", "Node.js (Express/NestJS) বা Medusa"], db: ["ডাটাবেস", "PostgreSQL + Redis ক্যাশ, সার্চের জন্য Meilisearch"], sv: ["হোস্টিং", "VPS বা Docker, ছবি Cloudinary/S3"], n: "ভেন্ডর, কমিশন ও পেআউটের জন্য আলাদা লজিক লাগে। বড় প্রজেক্ট।" };
  if (sc >= 3) return { fe: ["ফ্রন্টএন্ড", "Next.js"], be: ["ব্যাকএন্ড", "Node.js API বা Medusa"], db: ["ডাটাবেস", "PostgreSQL (Neon/Supabase) + Redis"], sv: ["হোস্টিং", "Vercel + ম্যানেজড ডাটাবেস, ছবি Cloudinary"], n: "বেশি অর্ডার ও প্রোডাক্টে রিলেশনাল ডাটাবেস নিরাপদ ও দ্রুত।" };
  if (seo === "adv") return { fe: ["ফ্রন্টএন্ড", "Next.js (সার্ভার রেন্ডারিং)"], be: ["ব্যাকএন্ড", "Next.js API + Firebase Auth"], db: ["ডাটাবেস", "Firestore বা Neon PostgreSQL"], sv: ["হোস্টিং", "Vercel, ছবি Cloudinary"], n: "গুগলে ভালো র‍্যাঙ্কের জন্য সার্ভার রেন্ডারিং দরকার।" };
  return { fe: ["ফ্রন্টএন্ড", "HTML, CSS, JS (ফ্রেমওয়ার্ক ছাড়া)"], be: ["ব্যাকএন্ড", "Firebase Auth + Cloud Functions"], db: ["ডাটাবেস", "Firestore"], sv: ["হোস্টিং", "Netlify, ছবি Cloudinary"], n: "ছোট থেকে মাঝারি দোকানের জন্য সহজ ও কম খরচের সমাধান।" };
}

export interface Section { h: string; l: string[]; w?: boolean }

export function buildPlan(a: Answers) {
  const st = stack(a), f = arr(a, "feat"), sec: Section[] = [], who = (a.who as Who | undefined) ?? {};
  const type = str(a, "type"), time = str(a, "time"), bud = str(a, "bud"), seo = str(a, "seo");
  sec.push({ h: "সারসংক্ষেপ", l: ["ব্যবসা: " + (who.b || "-"), "ধরন: " + lab("type", type), "প্রোডাক্ট: " + lab("prod", str(a, "prod")) + ", মাসিক অর্ডার: " + lab("ord", str(a, "ord")), "বাজেট: " + lab("bud", bud) + ", সময়: " + lab("time", time)] });
  sec.push({ h: "টেক স্ট্যাক", l: [st.fe.join(": "), st.be.join(": "), st.db.join(": "), st.sv.join(": "), "কারণ: " + st.n] });
  const ph = ["প্রথম ধাপ: চালু করার মতো ন্যূনতম সংস্করণ", "দ্বিতীয় ধাপ: পেমেন্ট ও ডেলিভারি", "তৃতীয় ধাপ: বিক্রি বাড়ানোর ফিচার", "চতুর্থ ধাপ: পরে যোগ করার ফিচার"];
  [1, 2, 3, 4].forEach((p) => { const l = f.filter((x) => FM[x]?.p === p).map((x) => FM[x].l); if (l.length) sec.push({ h: ph[p - 1], l }); });
  if (!f.length) sec.push({ h: "ফিচার", l: ["কোনো ফিচার বাছা হয়নি। প্রথমে কার্ট, চেকআউট, অ্যাডমিন ও অর্ডার ম্যানেজমেন্ট দিয়ে শুরু করুন।"] });
  const ui = arr(a, "ui").map((x) => lab("ui", x));
  sec.push({ h: "UI ও অ্যানিমেশন", l: ["অ্যানিমেশন: " + lab("anim", str(a, "anim")), ...(ui.length ? ui : ["বিশেষ কিছু বাছা হয়নি"])] });
  const sl: Record<string, string[]> = {
    none: ["SEO বাদ। কিছু সাধারণ মেটা ট্যাগ রাখাই ভালো।"],
    basic: ["টাইটেল ও মেটা, সাইটম্যাপ, ছবির alt টেক্সট, মোবাইল স্পিড"],
    adv: ["সার্ভার রেন্ডারিং, প্রোডাক্ট স্কিমা, সাইটম্যাপ, Open Graph, Core Web Vitals, ব্লগ ও ক্যাটাগরি পেজের কন্টেন্ট প্ল্যান"],
  };
  sec.push({ h: "SEO", l: sl[seo ?? ""] ?? ["-"] });
  const au = arr(a, "auto").map((x) => lab("auto", x));
  sec.push({ h: "অটোমেশন", l: au.length ? au : ["এখনই কিছু দরকার নেই"] });
  const w: string[] = [];
  if (type === "static") {
    const bad = f.filter((x) => !SAFE.includes(x) && FM[x]);
    if (bad.length) w.push("স্ট্যাটিক সাইটে এই ফিচারগুলো ব্যাকএন্ড ছাড়া হবে না: " + bad.map((x) => FM[x].l).join(", ") + "। ডায়নামিক ধরনে যাওয়ার কথা ভাবুন।");
  }
  if (f.length > 25 && (time === "1" || bud === "1")) {
    const lt = f.filter((x) => FM[x] && FM[x].p >= 3).map((x) => FM[x].l);
    w.push("ফিচার অনেক বেশি, কিন্তু সময় বা বাজেট কম। এই ফিচারগুলো পরের ধাপে পিছিয়ে দিন: " + lt.join(", ") + "।");
  }
  if (bud === "1" && type === "mkt") w.push("মার্কেটপ্লেসের জন্য এই বাজেট যথেষ্ট নয়।");
  if (seo === "adv" && type === "static") w.push("অ্যাডভান্সড SEO-র জন্য স্ট্যাটিকের চেয়ে সার্ভার রেন্ডারিং ভালো।");
  if (arr(a, "auto").length && type === "static") w.push("এই অটোমেশনগুলোর জন্য ব্যাকএন্ড লাগবে: " + arr(a, "auto").map((x) => lab("auto", x)).join(", ") + "।");
  sec.push({ h: "সতর্কতা ও পরামর্শ", l: w.length ? w : ["বড় কোনো অসঙ্গতি পাওয়া যায়নি।"], w: w.length > 0 });
  sec.push({ h: "পরের ধাপ", l: ["এই প্ল্যান ডেভেলপারকে পাঠিয়ে মূল্য ও সময়ের চূড়ান্ত প্রস্তাব নিন।", "ডোমেইন ও পণ্যের ছবি আগে থেকে প্রস্তুত রাখুন।", "প্রথম ধাপ চালু করে বাস্তব অর্ডার দেখে পরের ধাপে যান।"] });
  const text = CONFIG.brand + " ই-কমার্স প্ল্যান\n\n" + sec.map((s) => s.h + "\n" + s.l.map((x) => "- " + x).join("\n")).join("\n\n") + "\n\nনাম: " + (who.n || "-") + "\nফোন: " + (who.p || "-") + (who.x ? "\nমন্তব্য: " + who.x : "");
  return { st, sections: sec, text, who };
}
