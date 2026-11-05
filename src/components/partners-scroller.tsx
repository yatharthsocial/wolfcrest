"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import aradaLogo from "@/assets/partners/arada.png";
import aziziDevelopersLogo from "@/assets/partners/azizi-developers.png";
import beyondLogo from "@/assets/partners/beyond.png";
import binghattiLogo from "@/assets/partners/binghatti-1.png";
import cirreraLogo from "@/assets/partners/cirrera.png";
import damacLogo from "@/assets/partners/damac.png";
import danubePropertiesLogo from "@/assets/partners/danube-properties.png";
import deyaarLogo from "@/assets/partners/deyaar-logo.png";
import dugastaLogo from "@/assets/partners/dugasta.png";
import ellingtonLogo from "@/assets/partners/ellington.png";
import emaarLogo from "@/assets/partners/emaar-logo.png";
import imanLogo from "@/assets/partners/iman.png";
import imtiazLogo from "@/assets/partners/imtiaz.png";
import leosLogo from "@/assets/partners/leos.png";
import mashriqEliteLogo from "@/assets/partners/mashriq-elite.png";
import meraasLogo from "@/assets/partners/meraas.png";
import nakheelLogo from "@/assets/partners/nakheel.png";
import objectLogo from "@/assets/partners/object.png";
import omniyatLogo from "@/assets/partners/omniyat.png";
import reefLogo from "@/assets/partners/reef.png";
import samanaDevelopersLogo from "@/assets/partners/samana-developers.png";
import sobhaRealtyLogo from "@/assets/partners/sobha-realty.png";
import solLogo from "@/assets/partners/sol.png";
import tigerGroupLogo from "@/assets/partners/tiger-group.png";
import waslLogo from "@/assets/partners/wasl-logo.png";

type Partner = { name: string; role: string; logo: StaticImageData };

// Developer logos all sit on this beige, so each circle is filled with it
const LOGO_BG = "#d3d2b4";

const partners: Partner[] = [
  { name: "Arada", role: "Developer Partner", logo: aradaLogo },
  { name: "Azizi Developments", role: "Developer Partner", logo: aziziDevelopersLogo },
  { name: "Beyond", role: "Developer Partner", logo: beyondLogo },
  { name: "Binghatti", role: "Developer Partner", logo: binghattiLogo },
  { name: "Cirrera Developments", role: "Developer Partner", logo: cirreraLogo },
  { name: "DAMAC Properties", role: "Developer Partner", logo: damacLogo },
  { name: "Danube Properties", role: "Developer Partner", logo: danubePropertiesLogo },
  { name: "Deyaar", role: "Developer Partner", logo: deyaarLogo },
  { name: "Dugasta Properties", role: "Developer Partner", logo: dugastaLogo },
  { name: "Ellington Properties", role: "Developer Partner", logo: ellingtonLogo },
  { name: "Emaar Properties", role: "Developer Partner", logo: emaarLogo },
  { name: "Iman Developers", role: "Developer Partner", logo: imanLogo },
  { name: "Imtiaz Developments", role: "Developer Partner", logo: imtiazLogo },
  { name: "LEOS Developments", role: "Developer Partner", logo: leosLogo },
  { name: "Mashriq Elite Developments", role: "Developer Partner", logo: mashriqEliteLogo },
  { name: "Meraas", role: "Developer Partner", logo: meraasLogo },
  { name: "Nakheel", role: "Developer Partner", logo: nakheelLogo },
  { name: "Object 1", role: "Developer Partner", logo: objectLogo },
  { name: "Omniyat", role: "Developer Partner", logo: omniyatLogo },
  { name: "Reef Luxury Developments", role: "Developer Partner", logo: reefLogo },
  { name: "Samana Developers", role: "Developer Partner", logo: samanaDevelopersLogo },
  { name: "Sobha Realty", role: "Developer Partner", logo: sobhaRealtyLogo },
  { name: "SOL Properties", role: "Developer Partner", logo: solLogo },
  { name: "Tiger Group", role: "Developer Partner", logo: tigerGroupLogo },
  { name: "wasl", role: "Developer Partner", logo: waslLogo },
];

// The faded left column: the same faces in a shifted order. It moves down
// while the page scrolls, so it carries extra portraits above to slide in.
const BACKDROP_ABOVE = partners.length + 2;
const backdrop = Array.from(
  { length: BACKDROP_ABOVE + 3 },
  (_, j) => partners[(j + 3) % partners.length],
);

// Scroll distance per partner, in screen heights (%)
const SCROLL_PER = 32;
// Distance between portraits in a column, in portrait diameters
const SPACING = 1.37;
// The left column starts this many steps above the right one (staggered)
const STAGGER = 0.56;
// How much the portrait in the middle grows, and how faded the rest are
const FOCUS_SCALE = 0.166;
const FADE = 0.6;
// The left column moves down at this fraction of the right column's speed
const PARALLAX = 0.8;
// How quickly the motion catches up with the scroll position (per 60fps frame)
const FOLLOW = 0.085;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function Portrait({ partner, sizes }: { partner: Partner; sizes: string }) {
  return (
    <div
      style={{ backgroundColor: LOGO_BG }}
      className="relative flex size-full items-center justify-center"
    >
      <Image
        src={partner.logo}
        alt=""
        sizes={sizes}
        className="h-auto w-[80%]"
      />
    </div>
  );
}

/**
 * Scroll-driven partner showcase. The section pins to the screen while the
 * right column of portraits glides up and the faded left column glides down.
 * Only the right column highlights: each portrait brightens and grows as it
 * nears the middle of the screen and dims again as it leaves, and the name
 * of the one in the middle shows on the right.
 *
 * Everything is driven from one requestAnimationFrame loop that eases toward
 * the scroll position and only writes transform and opacity, so the motion
 * stays on the compositor and feels the same on wheels and trackpads.
 */
export function PartnersScroller() {
  const outerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const count = partners.length;

  useEffect(() => {
    const outer = outerRef.current;
    const main = mainRef.current;
    const back = backRef.current;
    if (!outer || !main || !back) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let diameter = 0;
    let current = 0;
    let frame = 0;
    let last = 0;
    let shown = -1;

    const measure = () => {
      diameter = itemRefs.current[0]?.offsetWidth ?? 0;
    };

    const target = () => {
      const rect = outer.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      return p * (count - 1);
    };

    const paint = () => {
      const step = diameter * SPACING;
      main.style.transform = `translate3d(0, ${-current * step}px, 0)`;
      back.style.transform = `translate3d(0, ${current * step * PARALLAX}px, 0)`;
      for (let i = 0; i < count; i++) {
        // 1 in the middle of the screen, easing to 0 half a step away
        const focus = smooth(clamp(1 - Math.abs(i - current) / 0.7));
        const item = itemRefs.current[i];
        const shade = shadeRefs.current[i];
        if (item) item.style.transform = `scale(${1 + FOCUS_SCALE * focus})`;
        if (shade) shade.style.opacity = String(FADE * (1 - focus));
      }
      const next = Math.round(current);
      if (next !== shown) {
        shown = next;
        setActive(next);
      }
    };

    const tick = (now: number) => {
      const goal = target();
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      // Frame-rate independent easing toward the scroll position
      const k = reduced ? 1 : 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      current += (goal - current) * k;
      if (Math.abs(goal - current) < 0.0005) current = goal;
      paint();
      if (current === goal) {
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      kick();
    };

    measure();
    current = target();
    paint();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  const skip = () => {
    const outer = outerRef.current;
    if (!outer) return;
    window.scrollTo({
      top: outer.offsetTop + outer.offsetHeight - window.innerHeight + 1,
      behavior: "smooth",
    });
  };

  const partner = partners[active];

  return (
    <section
      ref={outerRef}
      aria-label="Our partners"
      // One screen to start, plus a stretch of scroll for every partner
      style={{ height: `calc(100svh + ${(count - 1) * SCROLL_PER}svh)` }}
      className="relative"
    >
      {/*
        Layout measured from the reference: portraits 18vw across, the faded
        column centred at 15vw, the partner column at 39vw, the name at 55vw.
      */}
      <div className="sticky top-0 h-svh overflow-hidden [--d:min(18vw,33svh)] [--step:calc(var(--d)*1.37)] max-lg:[--d:min(40vw,30svh)]">
        <div aria-hidden>
          {/* Faded column: moves down while the page scrolls */}
          <div className="absolute top-1/2 left-[calc(15vw-var(--d)/2)] w-[var(--d)] max-lg:left-[calc(26vw-var(--d)/2)] max-lg:top-[38%]">
            <div ref={backRef} className="relative will-change-transform">
              {backdrop.map((p, j) => (
                <div
                  key={j}
                  style={{
                    top: `calc(${j - BACKDROP_ABOVE - STAGGER} * var(--step) - var(--d) / 2)`,
                  }}
                  className="absolute left-0 size-[var(--d)] overflow-hidden rounded-full"
                >
                  <Portrait partner={p} sizes="(min-width: 1024px) 15vw, 32vw" />
                  <div
                    className="absolute inset-0 bg-background"
                    style={{ opacity: FADE }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Partner column: moves up, the one in the middle is highlighted */}
          <div className="absolute top-1/2 left-[calc(39vw-var(--d)/2)] w-[var(--d)] max-lg:left-[calc(72vw-var(--d)/2)] max-lg:top-[38%]">
            <div ref={mainRef} className="relative will-change-transform">
              {partners.map((p, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  style={{ top: `calc(${i} * var(--step) - var(--d) / 2)` }}
                  className="absolute left-0 size-[var(--d)] overflow-hidden rounded-full will-change-transform"
                >
                  <Portrait partner={p} sizes="(min-width: 1024px) 17vw, 38vw" />
                  <div
                    ref={(el) => {
                      shadeRefs.current[i] = el;
                    }}
                    className="absolute inset-0 bg-background will-change-[opacity]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Name and role, level with the highlighted portrait */}
        <div className="absolute left-[55vw] right-[5vw] top-1/2 -translate-y-1/2 max-lg:inset-x-0 max-lg:bottom-0 max-lg:top-auto max-lg:translate-y-0 max-lg:bg-gradient-to-t max-lg:from-background max-lg:via-background/90 max-lg:to-transparent max-lg:px-5 max-lg:pb-28 max-lg:pt-16">
          <div key={active} aria-live="polite">
            <h2 className="text-[clamp(2.5rem,5.6vw,7.5rem)] font-medium leading-[1.05] tracking-[-0.01em]">
              <span className="hero-reveal">
                <span className="hero-reveal-inner">{partner.name}</span>
              </span>
            </h2>
            <p
              style={{ "--delay": "150ms" } as CSSProperties}
              className="fade-up mt-[clamp(0.75rem,2.6vh,2rem)] text-[clamp(1.1rem,2.1vw,2.6rem)] font-light leading-tight text-white/75"
            >
              {partner.role}
            </p>
          </div>
        </div>

        {/* Skip */}
        <div className="absolute bottom-[clamp(4.25rem,9svh,6rem)] right-[5vw] max-lg:bottom-6 max-lg:right-5">
          <button
            type="button"
            onClick={skip}
            className="group flex cursor-pointer items-center gap-2 text-[clamp(0.75rem,0.95vw,1rem)] font-medium uppercase tracking-[0.12em] text-[#c9a96b] transition-colors duration-500 hover:text-white"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="size-[1.1em] transition-transform duration-500 group-hover:translate-y-0.5"
              aria-hidden
            >
              <path d="M8 2v12M3 9l5 5 5-5" />
            </svg>
            Skip this section
          </button>
        </div>
      </div>

      {/* Accessible list of everyone, since the visual columns are decorative */}
      <ul className="sr-only">
        {partners.map((p, i) => (
          <li key={i}>
            {p.name}, {p.role}
          </li>
        ))}
      </ul>
    </section>
  );
}
