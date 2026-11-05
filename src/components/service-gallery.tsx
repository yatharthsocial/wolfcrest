"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { TransitionLink } from "@/components/transition-link";
import salesLeasing from "@/assets/services/sales-leasing.webp";
import offPlan from "@/assets/services/off-plan.webp";
import investment from "@/assets/services/investment.webp";
import representation from "@/assets/services/representation.webp";

type Service = {
  title: string;
  image: StaticImageData;
  intro: string;
  body: string;
  points: string[];
};

const services: Service[] = [
  {
    title: "Luxury Residential Sales & Leasing",
    image: salesLeasing,
    intro:
      "Villas, penthouses and signature apartments across Dubai’s most sought-after communities, bought, sold and leased with discretion.",
    body: "We represent owners and buyers at the top of the market, where pricing is nuanced and the right buyer is rarely found by listing alone. Every mandate starts with a clear valuation, a considered marketing plan and a shortlist of qualified clients, so homes change hands quietly and on the right terms.",
    points: [
      "Valuation and pricing strategy",
      "Private and off-market listings",
      "Qualified buyer and tenant screening",
      "Negotiation through to transfer",
    ],
  },
  {
    title: "Off-Plan & New Developments",
    image: offPlan,
    intro:
      "Early access to Dubai’s most anticipated launches, with an honest view of the developer, the location and the payment plan.",
    body: "Buying off-plan rewards those who choose carefully. We study developer track records, delivery timelines and the fundamentals of each community before recommending a unit, then manage the reservation, payment milestones and handover on your behalf.",
    points: [
      "Priority allocation at launch",
      "Developer and project due diligence",
      "Payment plan structuring",
      "Snagging and handover support",
    ],
  },
  {
    title: "Investment Advisory",
    image: investment,
    intro:
      "Clear, data-led guidance for building and growing a property portfolio in the UAE.",
    body: "We weigh yield, capital growth, service charges and exit options together, never in isolation. Whether it is a first purchase or a full portfolio review, you get a straightforward recommendation backed by current transaction data and our read of where the market is heading.",
    points: [
      "Yield and capital growth analysis",
      "Portfolio planning and review",
      "Market and community research",
      "Resale and exit strategy",
    ],
  },
  {
    title: "End-to-End Client Representation",
    image: representation,
    intro:
      "One dedicated advisor from the first conversation to the day you receive the keys, and long after.",
    body: "A property transaction involves many parties: developers, banks, conveyancers and government offices. We coordinate all of them, keep you informed at every step and protect your interests throughout, so the process feels simple even when it isn’t.",
    points: [
      "A single point of contact",
      "Mortgage and conveyancing coordination",
      "Documentation and DLD transfer",
      "After-sale and property management support",
    ],
  },
];

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const OPEN_MS = 1000;
const CLOSE_MS = 850;

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

/** Transform that makes the element at `to` look like it sits at `from` */
function flip(from: DOMRect, to: DOMRect) {
  const scale = from.width / to.width;
  return `translate3d(${from.left - to.left}px, ${from.top - to.top}px, 0) scale(${scale})`;
}

/**
 * The service cards. Clicking one flies its photo to the left half of the
 * screen (a FLIP animation, transform only) while the detail copy rises in
 * on the right; closing flies it back into its card.
 */
export function ServiceGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [swaps, setSwaps] = useState(0);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openedFrom = useRef<number | null>(null);

  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Opening: fly the photo from its card to the detail view
  useLayoutEffect(() => {
    if (openedFrom.current === null) return;
    const card = cardRefs.current[openedFrom.current];
    const hero = heroRef.current;
    openedFrom.current = null;
    if (!card || !hero) return;
    closeRef.current?.focus({ preventScroll: true });
    if (reduced()) return;
    const from = card.getBoundingClientRect();
    const to = hero.getBoundingClientRect();
    hero.animate(
      [{ transform: flip(from, to) }, { transform: "translate3d(0,0,0) scale(1)" }],
      { duration: OPEN_MS, easing: EASE },
    );
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: OPEN_MS * 0.7,
      easing: "ease-out",
    });
    // Hairlines and controls appear once the photo is mostly in place
    copyRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 600,
      delay: OPEN_MS * 0.4,
      easing: "ease-out",
      fill: "backwards",
    });
  }, [active]);

  // After switching to the next service, keep keyboard focus in the dialog
  useEffect(() => {
    if (swaps > 0) closeRef.current?.focus({ preventScroll: true });
  }, [swaps]);

  const open = (i: number) => {
    openedFrom.current = i;
    setSwaps(0);
    setActive(i);
  };

  const close = useCallback(() => {
    if (active === null || closing) return;
    const card = cardRefs.current[active];
    const hero = heroRef.current;
    const finish = () => {
      setActive(null);
      setClosing(false);
      // Return focus to the card that was open
      card?.parentElement?.focus({ preventScroll: true });
    };
    if (!card || !hero || reduced()) return finish();
    setClosing(true);
    const from = hero.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    copyRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 300,
      easing: "ease-out",
      fill: "forwards",
    });
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_MS,
      easing: EASE,
      fill: "forwards",
    });
    // Reverse FLIP: the transform is relative to the photo's current box
    const scale = to.width / from.width;
    hero
      .animate(
        [
          { transform: "translate3d(0,0,0) scale(1)" },
          {
            transform: `translate3d(${to.left - from.left}px, ${to.top - from.top}px, 0) scale(${scale})`,
          },
        ],
        { duration: CLOSE_MS, easing: EASE, fill: "forwards" },
      )
      .finished.then(finish);
  }, [active, closing]);

  // Esc to close, and no page scroll behind the open view
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [active, close]);

  const service = active === null ? null : services[active];
  const next = active === null ? 0 : (active + 1) % services.length;

  return (
    <>
      <ul className="grid gap-[var(--gap)] max-lg:grid-cols-2 max-sm:grid-cols-1 lg:flex lg:h-full lg:items-center lg:justify-center">
        {services.map((s, i) => (
          <li
            key={s.title}
            className="lg:w-[min(calc((100cqw-3*var(--gap))/4),calc((100cqh-var(--cap))*0.75))]"
          >
            <button
              type="button"
              onClick={() => open(i)}
              aria-haspopup="dialog"
              className="group flex w-full cursor-pointer flex-col text-left"
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`relative aspect-[3/4] w-full overflow-hidden bg-white/5 ${
                  active === i ? "invisible" : ""
                }`}
              >
                <div
                  style={delay(500 + i * 150)}
                  className="svc-rise absolute inset-0"
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    placeholder="blur"
                    preload={i < 2}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
              </div>

              <h2 className="pt-[1.1rem] text-[clamp(1rem,min(1.35vw,2.6vh),1.45rem)] font-light uppercase leading-[1.3] tracking-wide lg:h-[var(--cap)]">
                <span style={delay(1300 + i * 150)} className="hero-reveal">
                  <span className="hero-reveal-inner">{s.title}</span>
                </span>
                <span
                  style={delay(1500 + i * 150)}
                  className="fade-up mt-3 flex items-center gap-3 text-[0.7rem] tracking-[0.22em] text-white/60"
                >
                  <span className="block h-px w-10 bg-white/60 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-16" />
                  <span className="opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Explore
                  </span>
                </span>
              </h2>
            </button>
          </li>
        ))}
      </ul>

      {service && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-detail-title"
          className="fixed inset-0 z-30 overflow-y-auto text-white lg:flex lg:overflow-hidden"
        >
          <div ref={backdropRef} className="fixed inset-0 bg-background" />

          {/* Photo, kept at its own 3:4 so nothing is cropped */}
          <div className="relative shrink-0 lg:flex lg:h-full lg:w-[min(75svh,50vw)] lg:items-center">
            <div
              ref={heroRef}
              className="relative aspect-[3/4] w-full origin-top-left overflow-hidden will-change-transform"
            >
              <Image
                key={active}
                src={service.image}
                alt={service.title}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover ${swaps > 0 ? "media-in" : ""}`}
              />
            </div>
          </div>

          {/* Copy */}
          <div
            ref={copyRef}
            key={`copy-${active}`}
            className="relative flex min-w-0 flex-1 flex-col lg:overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/20 px-[clamp(1.25rem,4.5vw,5rem)] py-[clamp(1rem,3vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/70">
              <span style={delay(swaps ? 0 : 450)} className="fade-up">
                Service
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                style={delay(swaps ? 0 : 450)}
                className="fade-up group flex cursor-pointer items-center gap-3 uppercase transition-colors duration-500 hover:text-white"
              >
                Close
                <span aria-hidden className="relative block size-4">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,3.2vh,2.75rem)] px-[clamp(1.25rem,4.5vw,5rem)] py-[clamp(1.25rem,4vh,4rem)]">
              <h2
                id="service-detail-title"
                style={delay(swaps ? 50 : 550)}
                className="fade-up max-w-[16ch] text-[clamp(2rem,min(3.7vw,5.8vh),4.5rem)] font-light uppercase leading-[1.05] tracking-wide"
              >
                {service.title}
              </h2>
              <p
                style={delay(swaps ? 120 : 680)}
                className="fade-up max-w-[46ch] text-[clamp(1.05rem,min(1.4vw,2.4vh),1.45rem)] font-light leading-[1.45] text-white/90"
              >
                {service.intro}
              </p>
              <p
                style={delay(swaps ? 180 : 780)}
                className="fade-up max-w-[60ch] text-[clamp(0.92rem,min(1.05vw,1.9vh),1.1rem)] leading-[1.7] text-white/65"
              >
                {service.body}
              </p>
              <ul
                style={delay(swaps ? 240 : 880)}
                className="fade-up grid max-w-[44rem] border-t border-white/20 sm:grid-cols-2 sm:gap-x-10"
              >
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-4 border-b border-white/20 py-[clamp(0.55rem,1.5vh,1rem)] text-[clamp(0.85rem,min(0.95vw,1.7vh),1rem)] uppercase tracking-[0.08em] text-white/85"
                  >
                    <span aria-hidden className="block h-px w-4 shrink-0 bg-white/50" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={delay(swaps ? 300 : 1000)}
              className="fade-up flex items-stretch border-t border-white/20"
            >
              <button
                type="button"
                onClick={() => {
                  setSwaps((n) => n + 1);
                  setActive(next);
                }}
                className="group flex min-w-0 flex-1 cursor-pointer items-center gap-4 px-[clamp(1.25rem,4.5vw,5rem)] py-[clamp(1rem,3vh,1.75rem)] text-left text-xs uppercase tracking-[0.22em] text-white/60 transition-colors duration-500 hover:text-white"
              >
                <span className="shrink-0">Next</span>
                <span className="truncate text-white/90">{services[next].title}</span>
                <ArrowIcon className="h-3 w-auto shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
              <TransitionLink
                href="/#enquire"
                className="group flex items-center gap-5 border-l border-white/20 px-[clamp(1.25rem,3vw,3rem)] text-sm uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-white hover:text-background"
              >
                Enquire
                <ArrowIcon className="h-5 w-auto transition-transform duration-500 group-hover:translate-x-1" />
              </TransitionLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
