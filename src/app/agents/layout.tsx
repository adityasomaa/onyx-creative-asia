import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: "Onyx Agents — internal",
  description: "Private dashboard for the Onyx automation roster.",
  robots: { index: false, follow: false },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-bone font-sans antialiased">
      {/* CHROME — top bar */}
      <header className="border-b border-bone/15 px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">ONYX</span>
            <span className="text-[10px] italic font-light opacity-70">
              Agents
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] opacity-50 ml-2 hidden md:inline">
            // INTERNAL CONSOLE · v0.1
          </span>
        </Link>
        <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase opacity-65">
          <span className="hidden md:inline">SESSION · LIVE</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </header>

      {/* CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-bone/15 mt-20 px-6 md:px-10 py-8 flex flex-col md:flex-row gap-3 md:gap-8 justify-between text-[11px] tracking-[0.2em] uppercase opacity-55">
        <span>© MMXXVI · ONYX CREATIVE ASIA · BALI</span>
        <span>
          NOT FOR PUBLIC INDEXING · BASIC AUTH GATED
        </span>
      </footer>
    </div>
  );
}
