"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  count: number;
  index: number;
  label: string;
  onClose: () => void;
  onIndex: (i: number) => void;
  children: ReactNode;
};

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`h-6 w-auto ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M3 2l18 18L3 38" />
    </svg>
  );
}

/**
 * Full-screen viewer shared by the reels and the photo gallery. It renders
 * into <body> so no transformed ancestor (like a scroll reveal) can trap it.
 */
export function Lightbox({ count, index, label, onClose, onIndex, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = () => onIndex((index - 1 + count) % count);
  const next = () => onIndex((index + 1) % count);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
      if (e.key === "ArrowRight") onIndex((index + 1) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, index, onClose, onIndex]);

  const button =
    "flex cursor-pointer items-center justify-center text-white/70 transition-colors duration-500 hover:text-white";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="lightbox-in fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-[5vw] py-5 text-xs uppercase tracking-[0.22em] text-white/70">
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")}
          <span className="text-white/40"> / {String(count).padStart(2, "0")}</span>
        </span>
        <button ref={closeRef} type="button" onClick={onClose} className={`group gap-3 ${button}`}>
          Close
          <span aria-hidden className="relative block size-4">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-[clamp(3.5rem,8vw,8rem)] pb-[clamp(1.5rem,5vh,3rem)]">
        {count > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className={`absolute left-[clamp(0.5rem,2.5vw,2.5rem)] top-1/2 size-12 -translate-y-1/2 ${button}`}
          >
            <Chevron flip />
          </button>
        )}
        <div key={index} className="lightbox-item flex size-full items-center justify-center">
          {children}
        </div>
        {count > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className={`absolute right-[clamp(0.5rem,2.5vw,2.5rem)] top-1/2 size-12 -translate-y-1/2 ${button}`}
          >
            <Chevron />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
