"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logowolf.png";
import type { Interview } from "@/content/media";

/**
 * YouTube's own 1280x720 thumbnail, served straight from its CDN so it is
 * never re-compressed. Falls back to the smaller one if a video has no HD
 * thumbnail.
 */
function YouTubeThumb({ id, className }: { id: string; className: string }) {
  const [hd, setHd] = useState(true);
  return (
    <Image
      src={`https://i.ytimg.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg`}
      alt=""
      fill
      unoptimized
      onError={() => setHd(false)}
      className={className}
    />
  );
}

function PlayIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

function Placeholder({ small = false }: { small?: boolean }) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,#4a443e,#1f1c1a_70%)]">
      <Image
        src={logo}
        alt=""
        sizes={small ? "80px" : "220px"}
        className={`h-auto opacity-80 ${small ? "w-[34%]" : "w-[18%]"}`}
      />
      {!small && (
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/50">
          Coming soon
        </span>
      )}
    </div>
  );
}

/**
 * Featured YouTube player with a playlist beside it. The player only loads
 * YouTube when someone presses play, so the page stays fast.
 */
export function Interviews({ items }: { items: Interview[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = items[active];

  const select = (i: number) => {
    setActive(i);
    setPlaying(Boolean(items[i].youtubeId));
  };

  return (
    <div className="grid grid-cols-1 gap-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
      {/* Featured */}
      <div>
        <div className="group relative aspect-video overflow-hidden bg-black">
          {current.youtubeId && playing ? (
            <iframe
              key={current.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={current.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              disabled={!current.youtubeId}
              onClick={() => setPlaying(true)}
              aria-label={current.youtubeId ? `Play ${current.title}` : undefined}
              className="absolute inset-0 cursor-pointer disabled:cursor-default"
            >
              {current.youtubeId ? (
                <YouTubeThumb
                  key={current.youtubeId}
                  id={current.youtubeId}
                  className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              ) : (
                <Placeholder />
              )}
              {current.youtubeId && (
                <>
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                  <span className="absolute left-1/2 top-1/2 flex size-[clamp(4rem,7vw,6.5rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 backdrop-blur-[2px] transition-[background-color,color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                    <PlayIcon className="ml-1 size-[38%]" />
                  </span>
                </>
              )}
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-[clamp(1.25rem,2vw,2rem)] font-light leading-tight">
            {current.title}
          </h3>
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">
            {current.outlet}
            {current.date && <span className="text-white/35"> · {current.date}</span>}
          </p>
        </div>
      </div>

      {/* Playlist */}
      <ol className="flex flex-col border-t border-white/20">
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li key={i} className="border-b border-white/20">
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={on}
                className="group relative flex w-full cursor-pointer items-center gap-[clamp(0.9rem,1.5vw,1.5rem)] py-[clamp(0.85rem,1.6vw,1.25rem)] text-left"
              >
                <span
                  aria-hidden
                  className={`absolute -left-[clamp(0.75rem,1.2vw,1.25rem)] top-1/2 h-[60%] w-px -translate-y-1/2 bg-[#c9a96b] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <span className="relative aspect-video w-[clamp(6.5rem,10vw,9.5rem)] shrink-0 overflow-hidden bg-black">
                  {item.youtubeId ? (
                    <YouTubeThumb
                      id={item.youtubeId}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <Placeholder small />
                  )}
                  {on && playing && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[0.6rem] uppercase tracking-[0.25em]">
                      Playing
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-white/50">
                    {item.outlet}
                  </span>
                  <span
                    className={`mt-1.5 block truncate text-[clamp(0.95rem,1.15vw,1.15rem)] transition-colors duration-500 ${
                      on ? "text-white" : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {item.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
