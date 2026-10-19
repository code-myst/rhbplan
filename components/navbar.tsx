"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "প্ল্যানার" },
  { href: "/db", label: "ডাটাবেস" },
  { href: "/learn", label: "সহজ ভাষায় শিখুন" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-violet-300 ring-1 ring-primary/40">
            <svg className="ico h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20h.01M18 20h.01" /></svg>
          </div>
          <span className="text-sm font-bold tracking-tight">ই-কমার্স প্ল্যানার</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1" aria-label="প্রধান মেনু">
          {LINKS.map((l) => {
            const on = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={on ? "page" : undefined}
                className={`btn btn-sm ${on ? "bg-white/10 text-foreground" : "btn-ghost text-muted-foreground hover:text-foreground"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
