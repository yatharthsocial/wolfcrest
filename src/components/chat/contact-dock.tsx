"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { contact } from "@/content/contact";
import { ChatPanel } from "./chat-panel";
import { whatsappLink } from "./bot";

/** Space kept between the buttons and anything they move out of the way of */
const GAP = 12;

/**
 * Floating chat and WhatsApp buttons. On large screens they sit halfway down in
 * a reserved right-hand lane that page content keeps clear of. On smaller screens they sit bottom-right
 * and lift above anything they would cover there: footers, the home menu,
 * and any element marked data-fab-avoid. They hide while a full-screen
 * dialog (photo viewer, service detail) is open.
 */
export function ContactDock() {
  const pathname = usePathname();
  const dock = useRef<HTMLDivElement>(null);
  const chatButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [lift, setLift] = useState(0);
  const [covered, setCovered] = useState(false);

  // Measure what sits under the dock and lift it clear
  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    let frame = 0;
    let current = 0;

    const measure = () => {
      frame = 0;
      setCovered(
        !!document.querySelector('[aria-modal="true"]:not([data-chat-panel])'),
      );
      const r = el.getBoundingClientRect();
      // Where the dock would be with no lift
      const left = r.left - GAP;
      const right = r.right + GAP;
      const baseTop = r.top + current;
      const baseBottom = r.bottom + current;
      const vh = window.innerHeight;
      const blockers = [...document.querySelectorAll<HTMLElement>("footer, [data-fab-avoid]")]
        .map((b) => {
          const rect = b.getBoundingClientRect();
          if (b.tagName !== "FOOTER") return rect;
          // Footers scroll in from the bottom. Chasing them frame by frame
          // makes the buttons judder on phones, so once a footer is on screen
          // clear the spot it will come to rest in, in one smooth move.
          if (rect.top >= vh || rect.bottom <= 0) return null;
          return {
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            top: Math.min(rect.top, vh - rect.height),
            bottom: Math.max(rect.bottom, vh),
          };
        })
        .filter(
          (b): b is Pick<DOMRect, "left" | "right" | "top" | "bottom" | "width" | "height"> =>
            !!b && b.width > 0 && b.height > 0 && b.left < right && b.right > left,
        );

      let next = 0;
      // A few passes, in case lifting above one thing lands on another
      for (let pass = 0; pass < 4; pass++) {
        const top = baseTop - next - GAP;
        const bottom = baseBottom - next + GAP;
        const hit = blockers.find((b) => b.top < bottom && b.bottom > top);
        if (!hit) break;
        next = Math.max(next, baseBottom - hit.top + GAP);
      }
      // Never lift off the top of the screen
      next = Math.min(next, Math.max(0, baseTop - GAP));
      if (Math.abs(next - current) > 0.5) {
        current = next;
        setLift(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-modal", "class"] });
    // Pages animate in; re-check once things settle
    const settle = window.setTimeout(schedule, 1500);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      mo.disconnect();
    };
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    chatButton.current?.focus({ preventScroll: true });
  }, []);

  const button =
    "flex size-11 lg:size-10 cursor-pointer items-center justify-center rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-[transform,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <>
      <div
        ref={dock}
        style={{ "--lift": `${lift}px`, "--delay": "1800ms" } as React.CSSProperties}
        className={`dock-in fixed z-[35] flex flex-col gap-2.5 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [translate:0_calc(var(--lift)*-1)] max-lg:bottom-[max(1rem,env(safe-area-inset-bottom))] max-lg:right-4 lg:right-[calc((max(4vw,3.5rem)-2.5rem)/2)] lg:top-1/2 lg:[translate:0_calc(-50%-var(--lift))] ${
          covered
            ? "pointer-events-none opacity-0"
            : open
              ? "max-lg:pointer-events-none max-lg:opacity-0"
              : ""
        }`}
      >
        <button
          ref={chatButton}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Chat with us"}
          className={`${button} relative border ${
            open
              ? "border-white bg-white text-background"
              : "border-white/35 bg-background/80 text-white backdrop-blur-md hover:border-white"
          }`}
        >
          {/* Chat bubble morphs into a cross */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`absolute size-5 transition-[opacity,transform] duration-500 ${open ? "rotate-45 scale-50 opacity-0" : "opacity-100"}`}
            aria-hidden
          >
            <path d="M20 12a7.5 7.5 0 0 1-11.1 6.6L4 20l1.4-4.6A7.5 7.5 0 1 1 20 12z" />
            <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeWidth="2" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={`absolute size-4 transition-[opacity,transform] duration-500 ${open ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          {/* Gold dot until the chat has been opened once */}
          <ChatDot hidden={open} />
        </button>

        <a
          href={whatsappLink("Hi, I'm contacting The Wolf Crest from your website.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp us on ${contact.whatsapp.label}`}
          className={`${button} bg-[#25D366] text-white hover:bg-[#1fb956]`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1.35rem]" aria-hidden>
            <path d="M12.04 2.5A9.43 9.43 0 0 0 3.9 16.7L2.5 21.5l4.93-1.3a9.43 9.43 0 1 0 4.61-17.7zm0 17.26a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.93.77.78-2.85-.19-.3a7.83 7.83 0 1 1 6.61 3.64zm4.3-5.86c-.24-.12-1.4-.69-1.61-.77-.22-.08-.38-.12-.53.12-.16.24-.61.77-.75.92-.14.16-.28.18-.51.06a6.44 6.44 0 0 1-3.2-2.8c-.24-.41.24-.38.69-1.27.08-.16.04-.29-.02-.41-.06-.12-.53-1.29-.73-1.76-.19-.46-.39-.4-.53-.41h-.45a.87.87 0 0 0-.63.29 2.64 2.64 0 0 0-.82 1.96 4.58 4.58 0 0 0 .96 2.43 10.5 10.5 0 0 0 4.03 3.56c1.5.65 2.09.7 2.84.59.46-.07 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z" />
          </svg>
        </a>
      </div>

      {open && <ChatPanel onClose={close} />}
    </>
  );
}

/** Small gold dot on the chat button that disappears once opened */
function ChatDot({ hidden }: { hidden: boolean }) {
  const [seen, setSeen] = useState(false);
  if (hidden && !seen) setSeen(true);
  if (seen) return null;
  return (
    <span aria-hidden className="absolute right-0.5 top-0.5 flex size-2.5">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#c9a96b] opacity-60 motion-reduce:hidden" />
      <span className="relative size-2.5 rounded-full border border-background bg-[#c9a96b]" />
    </span>
  );
}
