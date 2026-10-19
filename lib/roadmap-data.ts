export type RoadmapPhase = { id: string; title: string; subtitle: string; description: string; color: string }

export const ROADMAP_PHASES: RoadmapPhase[] = [
  { id: "mvp", title: "MVP · প্রথম লঞ্চ", subtitle: "যা ছাড়া ব্যবসা শুরু হবে না", description: "প্রথমে এমন ছোট সংস্করণ বানান যেটি দিয়ে বাস্তব গ্রাহক অর্ডার করতে পারে এবং আপনি অর্ডার সামলাতে পারেন।", color: "bg-emerald-500" },
  { id: "scale", title: "Phase 2 · অপারেশন", subtitle: "কাজের চাপ কমানো", description: "অর্ডার, পেমেন্ট ও ডেলিভারির নিয়মিত কাজগুলোকে দ্রুত এবং নির্ভরযোগ্য করুন।", color: "bg-sky-500" },
  { id: "growth", title: "Phase 3 · গ্রোথ", subtitle: "বিক্রি ও পুনরায় ক্রয়", description: "ডেটা, কনটেন্ট ও মার্কেটিং ব্যবহার করে গ্রাহক বাড়ান এবং বারবার ফিরিয়ে আনুন।", color: "bg-violet-500" },
  { id: "later", title: "Later · উন্নত ফিচার", subtitle: "প্রমাণিত চাহিদার পরে", description: "ব্যবসায় প্রমাণিত প্রয়োজন তৈরি হলে জটিল ফিচার যোগ করুন, শুরুতেই নয়।", color: "bg-amber-500" },
]

export type ChecklistItem = { id: string; label: string; group: string; priority: "অবশ্যই" | "ভালো হলে"; note: string }

export const CHECKLIST: ChecklistItem[] = [
  { id: "catalog", label: "পণ্যের নাম, দাম, ছবি ও বর্ণনা প্রস্তুত", group: "কনটেন্ট", priority: "অবশ্যই", note: "একটি spreadsheet-এ আগে সব তথ্য গুছিয়ে নিন।" },
  { id: "policy", label: "ডেলিভারি, রিটার্ন ও পেমেন্ট পলিসি লিখিত", group: "ব্যবসা", priority: "অবশ্যই", note: "চেকআউটের আগে গ্রাহককে স্পষ্টভাবে দেখাতে হবে।" },
  { id: "domain", label: "ডোমেইন, হোস্টিং ও ব্যবসার ইমেইল", group: "লঞ্চ", priority: "অবশ্যই", note: "Developer-এর সঙ্গে ownership ও access আগে ঠিক করুন।" },
  { id: "test-order", label: "বাস্তব test order দিয়ে পুরো flow পরীক্ষা", group: "QA", priority: "অবশ্যই", note: "মোবাইল, পেমেন্ট, stock এবং confirmation যাচাই করুন।" },
  { id: "analytics", label: "Analytics ও conversion event সেটআপ", group: "গ্রোথ", priority: "ভালো হলে", note: "কোন পেজ থেকে অর্ডার আসে তা বুঝতে সাহায্য করবে।" },
  { id: "backup", label: "Backup, error monitoring ও access handover", group: "নিরাপত্তা", priority: "অবশ্যই", note: "Launch-এর পরেও developer ছাড়া ব্যবসা চালাতে পারবেন।" },
]
