"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Fades its content up the first time it scrolls into view */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
