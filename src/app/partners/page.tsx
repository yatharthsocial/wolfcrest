import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PartnersScroller } from "@/components/partners-scroller";
import { TransitionLink } from "@/components/transition-link";

export const metadata: Metadata = {
  title: "Our Partners | The Wolf Crest",
  description: "The people behind The Wolf Crest Real Estate, Dubai.",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M3 2l18 18L3 38" />
    </svg>
  );
}

export default function PartnersPage() {
  return (
    <main className="relative w-full bg-background text-white">
      <header
        style={delay(500)}
        className="fade-up flex items-center justify-between gap-6 border-b border-white/25 px-[5vw] py-[clamp(1rem,2.6vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/75"
      >
        <h1>Our Partners</h1>
        <TransitionLink
          href="/"
          className="group flex items-center gap-2 transition-colors duration-500 hover:text-white"
        >
          <ArrowIcon className="h-3 w-auto rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
          Home
        </TransitionLink>
      </header>

      <PartnersScroller />

      <footer className="flex items-stretch border-t border-white/25">
        <span className="flex flex-1 items-center px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1rem,3vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/60">
          The Wolf Crest Real Estate, Dubai
        </span>
        <TransitionLink
          href="/#enquire"
          className="group flex items-center gap-5 border-l border-white/25 px-[clamp(1.25rem,3vw,3rem)] text-sm uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-white hover:text-background"
        >
          Enquire
          <ArrowIcon className="h-5 w-auto transition-transform duration-500 group-hover:translate-x-1" />
        </TransitionLink>
      </footer>

      {/* Arrives from the page curtain: starts black, then lifts */}
      <div aria-hidden className="hero-dim pointer-events-none fixed inset-0 z-40 bg-black" />
    </main>
  );
}
