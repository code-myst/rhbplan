import type { Metadata, Viewport } from "next";
import { Geist, Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-hind", display: "swap" });

export const metadata: Metadata = {
  title: "ই-কমার্স প্ল্যানার",
  description: "Website বানানোর আগে roadmap, developer checklist এবং database blueprint তৈরি করুন।",
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%238b5cf6'/%3E%3Ctext x='16' y='22' font-size='16' font-weight='800' text-anchor='middle' fill='white' font-family='sans-serif'%3EE%3C/text%3E%3C/svg%3E" },
};
export const viewport: Viewport = { themeColor: "#0a0a0f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`dark ${geist.variable} ${hind.variable}`}>
      <body className="font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
