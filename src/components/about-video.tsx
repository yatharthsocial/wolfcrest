"use client";

import { useEffect, useRef, useState } from "react";

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      )}
    </svg>
  );
}

/**
 * Plays with sound when the browser allows it (arriving here from a click on
 * the home page usually counts), otherwise falls back to muted autoplay and
 * leaves the sound toggle for the visitor.
 */
export function AboutVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = false;
    video
      .play()
      .then(() => setMuted(false))
      .catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        src="/videos/about.mp4"
        poster="/videos/about-poster.jpg"
        muted
        loop
        playsInline
        preload="auto"
        aria-label="The Wolf Crest introduction"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        aria-pressed={!muted}
        className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-white/60 bg-black/55 py-2 pl-3 pr-4 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-500 hover:bg-white hover:text-black"
      >
        <SpeakerIcon muted={muted} />
        {muted ? "Sound off" : "Sound on"}
      </button>
    </>
  );
}
