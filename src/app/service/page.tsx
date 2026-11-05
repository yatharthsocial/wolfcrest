import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ServiceGallery } from "@/components/service-gallery";
import { TransitionLink } from "@/components/transition-link";

export const metadata: Metadata = {
  title: "Service | The Wolf Crest",
  description:
    "Luxury residential sales and leasing, off-plan developments, investment advisory and end-to-end client representation in Dubai.",
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

export default function ServicePage() {
  return (
    <main className="relative flex h-svh min-h-[640px] w-full flex-col overflow-hidden bg-background text-white max-lg:h-auto">
      <header className="flex items-end justify-between gap-[clamp(1.5rem,4vw,5rem)] border-b border-white/25 px-[clamp(1.25rem,4vw,4.5rem)] pb-[clamp(1.25rem,3.5vh,2.5rem)] pt-[clamp(1.5rem,5vh,3.5rem)]">
        <h1
          style={delay(400)}
          className="hero-slide text-[clamp(2.5rem,min(5.5vw,9vh),6.5rem)] font-light uppercase leading-none tracking-wide"
        >
          Service
        </h1>
        <p
          style={delay(750)}
          className="fade-up mr-auto max-w-[34ch] pb-1 text-[clamp(0.9rem,1.1vw,1.15rem)] font-light leading-snug text-white/65 max-md:hidden"
        >
          Property advisory through strategy, instinct, and unwavering
          integrity.
        </p>
        <TransitionLink
          href="/"
          style={delay(900)}
          className="fade-up group flex items-center gap-2 pb-2 text-xs uppercase tracking-[0.22em] text-white/75 transition-colors duration-500 hover:text-white"
        >
          <ArrowIcon className="h-3 w-auto rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
          Home
        </TransitionLink>
      </header>

      {/*
        Each card keeps the photos' own 3:4 shape, so no image is ever cropped.
        On desktop this area is a size container: a card is as wide as a
        quarter of the row allows, unless the height runs out first, and the
        caption height (--cap) is reserved below the photo. Clicking a card
        opens its detail view (see ServiceGallery).
      */}
      <section className="min-h-0 flex-1 px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1.25rem,4.5vh,3.5rem)] [--cap:6.75rem] [--gap:clamp(1rem,2.2vw,2.75rem)] lg:[container-type:size]">
        <ServiceGallery />
      </section>

      <footer
        style={delay(1700)}
        className="fade-up flex items-stretch border-t border-white/25"
      >
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
