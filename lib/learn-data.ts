export type LearnTopic = { title: string; english: string; description: string; example: string; category: string }
export const LEARN_TOPICS: LearnTopic[] = [
  { title: "MVP", english: "Minimum Viable Product", category: "পরিকল্পনা", description: "সবচেয়ে ছোট usable version, যেটি দিয়ে বাস্তব গ্রাহক ও অর্ডার যাচাই করা যায়।", example: "প্রথম লঞ্চে login, product, cart ও order—কিন্তু loyalty points নয়।" },
  { title: "Roadmap", english: "Development Roadmap", category: "পরিকল্পনা", description: "কোন কাজ আগে, কোন কাজ পরে এবং কেন—তার সময়ক্রমিক পরিকল্পনা।", example: "পেমেন্টের আগে product ও checkout flow পরিষ্কার করা।" },
  { title: "Acceptance criteria", english: "Acceptance Criteria", category: "Developer handoff", description: "একটি ফিচার সম্পূর্ণ হয়েছে বলার আগে যে শর্তগুলো পূরণ হতে হবে।", example: "COD order হলে admin status বদলাতে পারবে এবং customer confirmation পাবে।" },
  { title: "Foreign key", english: "FK", category: "Database", description: "একটি টেবিলকে অন্য টেবিলের রেকর্ডের সঙ্গে যুক্ত করা ID।", example: "order_items-এর order_id জানায় কোন অর্ডারের পণ্য এটি।" },
  { title: "Index", english: "Database index", category: "Database", description: "বারবার খোঁজা তথ্য দ্রুত পাওয়ার জন্য ডাটাবেসের অতিরিক্ত search structure।", example: "email বা order status-এ index থাকলে admin search দ্রুত হয়।" },
  { title: "Conversion", english: "Conversion rate", category: "Business", description: "সাইটে আসা মানুষের কতজন কাঙ্ক্ষিত কাজ করেছে—যেমন অর্ডার করেছে।", example: "১০০ জন visitor-এর ৩ জন order করলে conversion ৩%।" },
]
