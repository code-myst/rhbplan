import Wizard from "@/components/wizard";

export default function PlannerPage() {
  return (
    <main className="dot-grid">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">আপনার ই-কমার্স সাইটের প্ল্যান বানান</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">কয়েকটি প্রশ্নের উত্তর দিন। শেষে পাবেন developer-ready roadmap, feature checklist, database blueprint এবং launch-এর আগে কী কী প্রস্তুত করতে হবে তার পরিষ্কার পরিকল্পনা।</p>
        </header>
        <Wizard />
      </div>
    </main>
  );
}
