"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background loop for the home hero. It sits over a still of its own first
 * frame and only fades in once frames are actually playing, so a slow
 * connection never shows a blank or stalled video.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
    // Next keeps this page alive in the background after navigating away,
    // so stop decoding while it is hidden
    return () => video.pause();
  }, []);

  return (
    <video
      ref={ref}
      src="/videos/hero.mp4"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
