import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { AboutVideo } from "@/components/about-video";
import { TransitionLink } from "@/components/transition-link";

export const metadata: Metadata = {
  title: "About | The Wolf Crest",
  description:
    "The Wolf Crest Real Estate: property advisory in the UAE built on strategy, instinct and integrity.",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const pillars = [
  { title: "Strategy", line: "We observe carefully." },
  { title: "Instinct", line: "We move decisively." },
  { title: "Integrity", line: "We protect the interests of our pack." },
];

function ArrowIcon({ className = "h-5 w-auto" }: { className?: string }) {
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

export default function AboutPage() {
  return (
    <main className="relative flex h-svh min-h-[640px] w-full overflow-hidden bg-background text-white max-md:h-auto max-md:flex-col">
      {/* Left: portrait video at its natural 9:16 */}
      <section
        style={delay(300)}
        className="media-in relative aspect-[9/16] h-full max-w-[45%] shrink-0 overflow-hidden bg-black max-md:aspect-auto max-md:h-[75svh] max-md:w-full max-md:max-w-none"
      >
        <AboutVideo />
      </section>

      {/* Right: copy, laid out as a full-height grid of hairline rows */}
      <section
        style={delay(200)}
        className="panel-in grid min-w-0 flex-1 grid-rows-[auto_auto_1fr_auto] overflow-y-auto bg-[#5f5a55]"
      >
        <header
          style={delay(700)}
          className="fade-up flex items-center justify-between gap-6 border-b border-white/25 px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1rem,2.6vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/75"
        >
          <span>About The Wolf Crest</span>
          <TransitionLink
            href="/"
            className="group flex items-center gap-2 transition-colors duration-500 hover:text-white"
          >
            <ArrowIcon className="h-3 w-auto rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
            Home
          </TransitionLink>
        </header>

        <div className="flex flex-col gap-[clamp(1.25rem,4.5vh,3.5rem)] px-[clamp(1.25rem,4vw,4.5rem)] pb-[clamp(1.5rem,5.5vh,4.5rem)] pt-[clamp(1.5rem,6vh,5rem)]">
          <h1
            style={delay(850)}
            className="fade-up max-w-[20ch] text-[clamp(2rem,min(4.6vw,7vh),5.75rem)] font-light leading-[1.06] tracking-[-0.01em]"
          >
            We believe real estate is not just about property. It’s about
            positioning.
          </h1>

          <div
            style={delay(1000)}
            className="fade-up grid gap-5 text-[clamp(0.95rem,min(1.2vw,2.05vh),1.3rem)] leading-[1.62] text-white/80 lg:grid-cols-2 lg:gap-[clamp(2rem,4vw,4.5rem)]"
          >
            <p>
              Like the wolf, we observe carefully, move decisively, and protect
              the interests of our pack. Our clients are never just buyers or
              sellers; they are long-term partners.
            </p>
            <p>
              At The Wolf Crest Real Estate, we redefine property advisory
              through strategy, instinct, and unwavering integrity. Inspired
              by the wolf, a symbol of intelligence, loyalty, and leadership,
              we guide our clients through UAE’s dynamic real estate market
              with confidence and clarity.
            </p>
          </div>
        </div>

        <ul className="grid border-t border-white/25 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <li
              key={pillar.title}
              style={delay(1150 + i * 120)}
              className="fade-up flex flex-col justify-end border-white/25 px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1rem,3.3vh,2.75rem)] max-sm:[&:not(:first-child)]:border-t sm:px-[clamp(1.25rem,2.4vw,2.5rem)] sm:first:pl-[clamp(1.25rem,4vw,4.5rem)] sm:[&:not(:first-child)]:border-l"
            >
              <p className="text-[clamp(1.2rem,min(2.1vw,3.4vh),2.25rem)] font-light uppercase tracking-[0.06em]">
                {pillar.title}
              </p>
              <p className="mt-2 min-h-[2lh] text-[clamp(0.85rem,min(1.05vw,1.8vh),1.05rem)] leading-snug text-white/70">
                {pillar.line}
              </p>
            </li>
          ))}
        </ul>

        <footer
          style={delay(1500)}
          className="fade-up flex items-stretch border-t border-white/25"
        >
          <span className="flex flex-1 items-center px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1rem,3vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/60">
            The Wolf Crest Real Estate, Dubai
          </span>
          <TransitionLink
            href="/#enquire"
            className="group flex items-center gap-5 border-l border-white/25 px-[clamp(1.25rem,3vw,3rem)] text-sm uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-white hover:text-[#5f5a55]"
          >
            Enquire
            <ArrowIcon className="h-5 w-auto transition-transform duration-500 group-hover:translate-x-1" />
          </TransitionLink>
        </footer>
      </section>

      {/* Arrives from the page curtain: starts black, then lifts */}
      <div aria-hidden className="hero-dim pointer-events-none fixed inset-0 z-40 bg-black" />
    </main>
  );
}
