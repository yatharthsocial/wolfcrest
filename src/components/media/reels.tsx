"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "@/assets/logowolf.png";
import type { Reel } from "@/content/media";
import { Lightbox } from "./lightbox";

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`h-4 w-auto ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M3 2l18 18L3 38" />
    </svg>
  );
}

/** Plays with sound when allowed, otherwise falls back to muted */
function LightboxVideo({ reel }: { reel: Reel }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    return () => v.pause();
  }, []);
  return (
    <video
      ref={ref}
      src={reel.src}
      poster={reel.poster}
      controls
      playsInline
      className="aspect-[9/16] max-h-[calc(100%-3rem)] w-auto bg-black object-contain"
    />
  );
}

/** One reel card: plays a silent preview on hover (or when in view on touch) */
function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(hover: hover)").matches) return;
    // Touch screens have no hover, so preview whichever reels are on screen
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.6 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, []);

  if (!reel.src) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-3 border border-white/15 bg-[radial-gradient(circle_at_50%_40%,#3d3833,#1c1a18_70%)]">
        <Image src={logo} alt="" sizes="100px" className="h-auto w-[38%] opacity-60" />
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">
          Coming soon
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && video.current?.play().catch(() => {})}
      onPointerLeave={(e) => e.pointerType === "mouse" && video.current?.pause()}
      aria-label={`Watch ${reel.title}`}
      className="group relative block size-full cursor-pointer overflow-hidden bg-black"
    >
      <video
        ref={video}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 transition-opacity duration-700 group-hover:opacity-70" />
      <span className="absolute left-4 top-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/80">
        <span className="size-1.5 rounded-full bg-[#c9a96b]" />
        Reel
      </span>
      <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left">
        <span className="text-[clamp(0.95rem,1.15vw,1.15rem)] font-light uppercase leading-snug tracking-wide">
          {reel.title}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/60 transition-colors duration-500 group-hover:bg-white group-hover:text-black">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-3.5" aria-hidden>
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

/**
 * Horizontal strip of portrait reels. Scrolls with the trackpad, a swipe or
 * the arrow buttons, with a thin progress line underneath; clicking a reel
 * opens it full screen with sound.
 */
export function Reels({ items }: { items: Reel[] }) {
  const strip = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const playable = items.filter((r) => r.src);

  useEffect(() => {
    const el = strip.current;
    const line = bar.current;
    if (!el || !line) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      const visible = el.clientWidth / el.scrollWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      // The bar is as wide as the visible share and slides along the track
      line.style.transform = `translate3d(${p * (1 / visible - 1) * 100}%, 0, 0)`;
      line.style.width = `${visible * 100}%`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollBy = (dir: number) => {
    const el = strip.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24) * 2, behavior: "smooth" });
  };

  const close = useCallback(() => setOpen(null), []);
  const current = open === null ? null : playable[open];

  return (
    <>
      <div className="mb-[clamp(1rem,2.5vh,1.75rem)] flex justify-end gap-2">
        {[-1, 1].map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scrollBy(dir)}
            aria-label={dir < 0 ? "Previous reels" : "Next reels"}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors duration-500 hover:border-white hover:bg-white hover:text-black"
          >
            <Arrow flip={dir < 0} />
          </button>
        ))}
      </div>

      <ul
        ref={strip}
        className="-mx-[5vw] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-[5vw] px-[5vw] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((reel, i) => (
          <li
            key={i}
            className="aspect-[9/16] w-[clamp(13rem,19vw,19rem)] shrink-0 snap-start"
          >
            <ReelCard
              reel={reel}
              onOpen={() => setOpen(playable.indexOf(reel))}
            />
          </li>
        ))}
      </ul>

      <div className="relative mt-[clamp(1.25rem,3vh,2rem)] h-px overflow-hidden bg-white/15">
        <span ref={bar} className="absolute inset-y-0 left-0 bg-white/80 will-change-transform" />
      </div>

      {current && open !== null && (
        <Lightbox
          count={playable.length}
          index={open}
          label="Reels"
          onClose={close}
          onIndex={setOpen}
        >
          <figure className="flex h-full flex-col items-center justify-center gap-4">
            <LightboxVideo reel={current} />
            <figcaption className="text-sm uppercase tracking-[0.2em] text-white/70">
              {current.title}
            </figcaption>
          </figure>
        </Lightbox>
      )}
    </>
  );
}
