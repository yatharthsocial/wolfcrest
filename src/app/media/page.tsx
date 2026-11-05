import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { Gallery } from "@/components/media/gallery";
import { Interviews } from "@/components/media/interviews";
import { Reels } from "@/components/media/reels";
import { Reveal } from "@/components/media/reveal";
import { TransitionLink } from "@/components/transition-link";
import { interviews, photos, reels } from "@/content/media";

export const metadata: Metadata = {
  title: "Media | The Wolf Crest",
  description:
    "Interviews, reels and moments from The Wolf Crest Real Estate, Dubai.",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

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

const chapters = [
  { id: "interviews", title: "Interviews", count: interviews.length },
  { id: "reels", title: "Reels", count: reels.length },
  { id: "gallery", title: "Gallery", count: photos.length },
];

function Chapter({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 border-t border-white/25 px-[5vw] py-[clamp(3rem,10vh,7rem)]"
    >
      <Reveal className="mb-[clamp(1.75rem,5vh,3.5rem)] flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h2 className="text-[clamp(2.5rem,6vw,6.5rem)] font-light uppercase leading-[0.95] tracking-wide">
          {title}
        </h2>
        <p className="max-w-[32ch] pb-2 text-[clamp(0.9rem,1.05vw,1.1rem)] font-light leading-snug text-white/60">
          {note}
        </p>
      </Reveal>
      <Reveal delay={150}>{children}</Reveal>
    </section>
  );
}

export default function MediaPage() {
  return (
    <main data-smooth-scroll className="relative w-full bg-background text-white">
      <header
        style={delay(500)}
        className="fade-up flex items-center justify-between gap-6 border-b border-white/25 px-[5vw] py-[clamp(1rem,2.6vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/75"
      >
        <span>The Wolf Crest</span>
        <TransitionLink
          href="/"
          className="group flex items-center gap-2 transition-colors duration-500 hover:text-white"
        >
          <ArrowIcon className="h-3 w-auto rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
          Home
        </TransitionLink>
      </header>

      {/* Intro: title, then the three chapters as columns like the home page */}
      <div className="flex min-h-[clamp(26rem,62svh,44rem)] flex-col">
        <div className="flex flex-1 flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pb-[clamp(2rem,6vh,4rem)] pt-[clamp(2.5rem,9vh,6rem)]">
          <h1
            style={delay(300)}
            className="hero-slide text-[clamp(4.5rem,15vw,15rem)] font-light uppercase leading-[0.8] tracking-[0.02em]"
          >
            Media
          </h1>
          <p
            style={delay(900)}
            className="fade-up max-w-[30ch] pb-[0.6em] text-[clamp(1.05rem,1.5vw,1.5rem)] font-light leading-snug text-white/70"
          >
            Conversations, moments and stories from The Wolf Crest.
          </p>
        </div>

        <nav aria-label="Media sections" className="grid grid-cols-3 border-t border-white/25">
          {chapters.map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="group relative flex h-[clamp(6.5rem,16vh,10rem)] items-end justify-between gap-3 px-[clamp(0.9rem,2vw,2rem)] pb-[clamp(1rem,2.5vh,1.75rem)] [&:not(:first-child)]:border-l [&:not(:first-child)]:border-white/25"
            >
              <span className="relative text-[clamp(0.95rem,1.9vw,1.9rem)] font-light uppercase leading-none tracking-wide">
                <span className="nav-label block">
                  <span style={delay(1100 + i * 140)} className="hero-reveal">
                    <span className="hero-reveal-inner">{c.title}</span>
                  </span>
                </span>
                <span className="nav-arrow absolute bottom-0 left-0">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-[1.1em] w-auto rotate-90" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </span>
              <span
                style={delay(1300 + i * 140)}
                className="fade-up text-xs tabular-nums tracking-[0.2em] text-white/45"
              >
                {pad(c.count)}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <Chapter
        id="interviews"
        title="Interviews"
        note="Conversations with The Wolf Crest on Dubai’s property market."
      >
        <Interviews items={interviews} />
      </Chapter>

      <Chapter
        id="reels"
        title="Reels"
        note="Short films from the city, our listings and life at The Wolf Crest."
      >
        <Reels items={reels} />
      </Chapter>

      <Chapter
        id="gallery"
        title="Gallery"
        note="Events, launches and the places we work."
      >
        <Gallery items={photos} />
      </Chapter>

      <footer className="flex items-stretch border-t border-white/25">
        <span className="flex flex-1 items-center px-[5vw] py-[clamp(1rem,3vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/60">
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
