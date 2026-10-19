import Wizard from "@/components/wizard";

export default function PlannerPage() {
  return (
    <main className="dot-grid">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">আপনার ই-কমার্স সাইটের প্ল্যান বানান</h1>
          <p className="mt-2 text-muted-foreground">কয়েকটি প্রশ্নের উত্তর দিন। শেষে পাবেন টেক স্ট্যাক, ডাটাবেস, ফিচারের ধাপ, সময় ও ঝুঁকির একটি গুছানো প্ল্যান।</p>
        </header>
        <Wizard />
      </div>
    </main>
  );
}
