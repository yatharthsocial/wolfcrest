"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import poster from "@/assets/poster-dubai-property-connect.png";
import mobilePoster from "@/assets/poster-dubai-property-connect-mobile.png";
import { BookingForm } from "./booking-form";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

const POSTER_ALT =
  "Dubai Property Connect: Property & Investment Summit, 18 Dec 2026, 5 PM onwards, The Avatar, Mangaluru";
/** Desktop gets the landscape poster, phones and tablets the portrait one */
const DESKTOP = "(min-width: 1024px)";

/** How long after landing before the poster appears */
const DELAY_MS = 3_500;
const MOBILE_DELAY_MS = 3_000;
/** Matches the close transition below, so the popup unmounts after fading out */
const CLOSE_MS = 700;
/** Shown once per browser session so it doesn't reappear on every page */
const SEEN_KEY = "wolfcrest-poster-seen";
/** Shared cross-fade between the poster and the form */
const SWAP =
  "transition-[opacity,scale,translate,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white outline-none backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#F2C46D]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

export function PosterPopup() {
  // mounted: in the DOM (hidden) so the poster can load during the delay
  // open: visible; flipping it drives the fade/scale transition both ways
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [due, setDue] = useState(false);
  const [mobile, setMobile] = useState(false);
  // "Book your slot" slides a booking form over the right of the poster
  const [booking, setBooking] = useState(false);
  // Keeps the form rendered while it slides back out
  const [formMounted, setFormMounted] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const isMobile = !window.matchMedia(DESKTOP).matches;
    // Mount right after first paint so the poster starts loading straight away
    const m = requestAnimationFrame(() => {
      setMobile(isMobile);
      setMounted(true);
    });
    const t = window.setTimeout(() => setDue(true), isMobile ? MOBILE_DELAY_MS : DELAY_MS);
    return () => {
      cancelAnimationFrame(m);
      window.clearTimeout(t);
    };
  }, []);

  // Show once the delay has passed and the poster is ready, never half-loaded
  useEffect(() => {
    if (!due || !loaded) return;
    // Next frame, so the hidden state is painted first and the transition runs
    const f = requestAnimationFrame(() => setOpen(true));
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    return () => cancelAnimationFrame(f);
  }, [due, loaded]);

  const close = () => {
    setOpen(false);
    setDue(false);
    window.setTimeout(() => {
      setMounted(false);
      setBooking(false);
      setFormMounted(false);
    }, CLOSE_MS);
  };

  const openForm = () => {
    setFormMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setBooking(true)));
  };

  useEffect(() => {
    if (!open) return;
    // Focus the dialog itself so keyboard users start inside it without a ring on the close button
    dialog.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      ref={dialog}
      tabIndex={-1}
      role="dialog"
      aria-modal={open ? "true" : undefined}
      aria-hidden={!open}
      // Keep the hidden popup out of tab order while it waits
      inert={!open}
      aria-label={POSTER_ALT}
      data-open={open}
      onClick={close}
      className="poster-backdrop group fixed inset-0 z-[60] flex items-center justify-center p-4 outline-none"
    >
      {/* Poster and form share one spot; switching cross-fades between them */}
      <div className="poster-card grid place-items-center">
        <div
          inert={booking}
          aria-hidden={booking}
          onClick={(e) => e.stopPropagation()}
          className={`relative ${
            mobile ? "w-[min(92vw,calc(86svh*0.54))]" : "w-[min(92vw,1100px,calc(88svh*1.6))]"
          } overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.6)] [grid-area:1/1] ${SWAP} ${
            booking ? "pointer-events-none scale-[0.94] opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0 delay-150"
          }`}
        >
          <CloseButton onClick={close} />

          <Image
            src={mobile ? mobilePoster : poster}
            alt={POSTER_ALT}
            preload
            onLoad={() => setLoaded(true)}
            sizes={mobile ? "92vw" : "min(92vw, 1100px)"}
            className="block h-auto w-full"
          />

          {/* Sits in the empty space under the date, on the poster's left margin */}
          <button
            type="button"
            onClick={openForm}
            className={`${inter.className} absolute inline-flex cursor-pointer items-center bg-[#F2C46D] ${
              mobile
                ? "left-[5%] top-[77%] h-10 gap-4 px-4 text-[11px]"
                : "left-[4%] top-[75%] h-[52px] gap-8 px-6 text-[13px]"
            } font-bold uppercase tracking-[0.18em] text-[#0A0908] transition-colors hover:bg-[#F7D48E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C46D]`}
          >
            Book your slot
            <span aria-hidden className="text-lg leading-none tracking-normal">→</span>
          </button>
        </div>

        {formMounted && (
          <div
            inert={!booking}
            aria-hidden={!booking}
            onClick={(e) => e.stopPropagation()}
            className={`${inter.className} relative max-h-[88svh] w-[min(92vw,30rem)] overflow-y-auto rounded-xl border border-white/15 bg-[#0A0908] px-6 pb-8 pt-8 sm:px-10 sm:pb-9 shadow-[0_24px_80px_rgba(0,0,0,0.6)] [grid-area:1/1] ${SWAP} ${
              booking ? "translate-y-0 scale-100 opacity-100 delay-150" : "pointer-events-none translate-y-5 scale-[0.97] opacity-0"
            }`}
          >
            {/* Gold hairline across the top, echoing the poster */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[#F2C46D]" />
            <CloseButton onClick={close} />
            <BookingForm onBack={() => setBooking(false)} onDone={close} />
          </div>
        )}
      </div>
    </div>
  );
}
