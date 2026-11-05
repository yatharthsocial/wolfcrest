"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/content/media";
import { Lightbox } from "./lightbox";

const spans: Record<NonNullable<Photo["span"]>, string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  large: "col-span-2 row-span-2",
};

/**
 * Editorial photo grid. Tiles fill the grid tightly (dense packing) and zoom
 * gently on hover; clicking opens the full, uncropped photo.
 */
export function Gallery({ items }: { items: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const current = open === null ? null : items[open];

  return (
    <>
      <ul className="grid grid-flow-dense auto-rows-[clamp(9rem,17vw,17rem)] grid-cols-2 gap-[clamp(0.5rem,1vw,1rem)] md:grid-cols-4">
        {items.map((photo, i) => (
          <li key={i} className={photo.span ? spans[photo.span] : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View ${photo.caption ?? photo.alt}`}
              className="group relative block size-full cursor-pointer overflow-hidden bg-white/5"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              {photo.caption && (
                <span className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between gap-3 text-left text-xs uppercase tracking-[0.2em] opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.caption}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-4 shrink-0" aria-hidden>
                    <path d="M3 13L13 3M6 3h7v7" />
                  </svg>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {current && open !== null && (
        <Lightbox
          count={items.length}
          index={open}
          label="Gallery"
          onClose={close}
          onIndex={setOpen}
        >
          <figure className="flex size-full flex-col items-center justify-center gap-4">
            <div className="relative min-h-0 w-full flex-1">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                placeholder="blur"
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {current.caption && (
              <figcaption className="text-sm uppercase tracking-[0.2em] text-white/70">
                {current.caption}
              </figcaption>
            )}
          </figure>
        </Lightbox>
      )}
    </>
  );
}
