"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image, { type StaticImageData } from "next/image";
import dubaiPoster from "@/assets/hero-poster.jpg";
import mangalorePoster from "@/assets/hero-mangalore-poster.jpg";

const cities = [
  { id: "dubai", label: "Dubai", video: "/videos/hero.mp4", poster: dubaiPoster, alt: "Sheikh Zayed Road, Dubai, from sunset into night", focus: "50% 50%" },
  { id: "mangalore", label: "Mangalore", video: "/videos/hero-mangalore.mp4", poster: mangalorePoster, alt: "Mangaluru coastline and breakwater from the air at sunset",
    // Keep the sunset and the breakwater in frame on tall screens
    focus: "45% 45%" },
] as const;

type CityId = (typeof cities)[number]["id"];

const CityContext = createContext<{ city: CityId; setCity: (c: CityId) => void }>({
  city: "dubai",
  setCity: () => {},
});

/** Shares the chosen city between the hero background and the switch */
export function HeroCityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<CityId>("dubai");
  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}

/**
 * One city's background: a still of its first frame with the loop fading in
 * over it once frames are actually playing. Videos only download once their
 * city has been shown, and pause while hidden.
 */
function CityLayer({
  active,
  video,
  poster,
  alt,
  focus,
  priority,
}: {
  active: boolean;
  video: string;
  poster: StaticImageData;
  alt: string;
  focus: string;
  priority: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(active);
  const [playing, setPlaying] = useState(false);

  // Remember that this city has been chosen so its video can load
  if (active && !shown) setShown(true);

  useEffect(() => {
    const v = ref.current;
    if (!v || !shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (active) v.play().catch(() => {});
    else v.pause();
    // Next keeps this page alive in the background after navigating away,
    // so stop decoding while it is hidden
    return () => v.pause();
  }, [active, shown]);

  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active ? "scale-100 opacity-100" : "pointer-events-none scale-[1.06] opacity-0"
      }`}
    >
      <Image
        src={poster}
        alt={alt}
        fill
        preload={priority}
        placeholder="blur"
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: focus }}
      />
      {shown && (
        <video
          ref={ref}
          src={video}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          style={{ objectPosition: focus }}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-out ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/** Background of the home hero; cross-fades between the cities */
export function HeroBackdrop() {
  const { city } = useContext(CityContext);
  return (
    <>
      {cities.map((c, i) => (
        <CityLayer
          key={c.id}
          active={city === c.id}
          video={c.video}
          poster={c.poster}
          alt={c.alt}
          focus={c.focus}
          priority={i === 0}
        />
      ))}
    </>
  );
}

/** Small pill switch under the hero title; the white marker slides across */
export function CitySwitch({ style }: { style?: CSSProperties }) {
  const { city, setCity } = useContext(CityContext);
  const index = cities.findIndex((c) => c.id === city);

  return (
    <div
      role="group"
      aria-label="Show city"
      style={style}
      className="fade-up relative mt-6 grid w-fit grid-cols-[1fr_1fr] items-center rounded-full border border-white/30 bg-black/25 p-[3px] backdrop-blur-md"
    >
      <span
        aria-hidden
        className="absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {cities.map((c) => {
        const on = c.id === city;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={on}
            onClick={() => setCity(c.id)}
            className={`relative z-10 flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 text-[0.62rem] leading-none uppercase tracking-[0.18em] transition-colors duration-500 md:px-3.5 md:py-1 md:text-[0.6rem] ${
              on ? "text-black" : "text-white/75 hover:text-white"
            }`}
          >
            {/* Negative margin cancels the trailing letter-spacing so the label sits centred */}
            <span className="-mr-[0.18em]">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
