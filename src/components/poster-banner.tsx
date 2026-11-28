"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import poster from "@/assets/poster-dubai-property-connect-popup.png";
import { contact } from "@/content/contact";
import { BookingForm } from "./booking-form";
import { CloseButton } from "./poster-popup";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

const POSTER_ALT =
  "Dubai Property Connect: Property & Investment Summit, 18 Dec 2026, 5 PM onwards, The Avatar, Mangaluru";
/** Matches the close transition in globals.css (.poster-card) */
const CLOSE_MS = 700;

const buttonBase = `${inter.className} inline-flex cursor-pointer items-center bg-[#F2C46D] font-bold uppercase tracking-[0.18em] text-[#0A0908] transition-colors hover:bg-[#F7D48E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C46D]`;

/**
 * The summit poster shown inline on the page, with a "Book your slot" button
 * that opens the booking form in a dialog.
 */
export function PosterBanner() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const show = (e: MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    setMounted(true);
    // Paint the hidden state first so the entry transition runs
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  const close = () => {
    setOpen(false);
    window.setTimeout(() => {
      setMounted(false);
      opener.current?.focus({ preventScroll: true });
    }, CLOSE_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      {/* Same poster as the popup; sizes on it scale with its width (cqw) so it fits every screen */}
      <figure className="@container relative overflow-hidden border border-white/15 bg-black">
        <Image src={poster} alt={POSTER_ALT} placeholder="blur" sizes="(min-width: 1024px) 88vw, 100vw" className="block h-auto w-full" />

        {/* Sits in the empty space under the date, on the poster's left margin */}
        <button
          type="button"
          onClick={show}
          className={`${buttonBase} absolute left-[4%] top-[73%] h-[6.4cqw] max-h-14 gap-[1.6cqw] px-[2cqw] text-[min(2.2cqw,14px)] tracking-[0.1em] md:top-[75%] md:h-[4.7cqw] md:px-[1.6cqw] md:text-[min(1.18cqw,14px)] md:tracking-[0.18em]`}
        >
          Book your slot
          <span aria-hidden className="text-[1.4em] leading-none tracking-normal">→</span>
        </button>

        {/* Makes the poster's printed "Call now" bar (its bottom 6%) dial the number */}
        <a
          href={contact.indiaPhone.href}
          aria-label={`Call now: ${contact.indiaPhone.label}`}
          className="absolute inset-x-0 bottom-0 h-[6%] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0A0908]"
        />
      </figure>

      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book your slot"
          data-open={open}
          onClick={close}
          className="poster-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`poster-card ${inter.className} relative max-h-[88svh] w-[min(92vw,30rem)] overflow-y-auto rounded-xl border border-white/15 bg-[#0A0908] px-[clamp(1.5rem,5vw,2.5rem)] pb-9 pt-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[#F2C46D]" />
            <CloseButton onClick={close} />
            <BookingForm onDone={close} />
          </div>
        </div>
      )}
    </>
  );
}
