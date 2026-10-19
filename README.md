# ই-কমার্স প্ল্যানার (Next.js · TypeScript · Tailwind · App Router)

```bash
npm install
npm run dev     # http://localhost:3000
```

- `/` — প্ল্যানার (প্রশ্নোত্তর → প্ল্যান)
- `/db` — ডাটাবেস স্ট্রাকচার জেনারেটর (প্ল্যানারের "ডাটাবেস স্ট্রাকচার বানান" বাটন রিপোর্টসহ এখানে আসে)
- `lib/config.ts` — WhatsApp নম্বর ও ব্র্যান্ডের নাম বসান
- `lib/planner-data.ts`, `lib/db-data.ts` — প্রশ্ন, ফিচার ও টেক্সট (মূল ফাইল থেকে হুবহু)
- `lib/planner.ts`, `lib/db-generate.ts` — প্ল্যান ও টেবিল/SQL বানানোর লজিক
- `content/starters/` — স্টার্টার কোডের ফাইল
