import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { TransitionLink } from "@/components/transition-link";
import hero from "@/assets/hero.webp";
import logo from "@/assets/logowolf.png";

const navItems = [
  { label: ["About", "Wolfcrest"], href: "/about" },
  { label: ["Find", "Your", "Wolfcrest"], href: "#find" },
  { label: ["Wolfcrest", "Collection"], href: "#collection" },
  { label: ["Why", "Wolfcrest"], href: "#why" },
  { label: ["Offices"], href: "#offices" },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-[1.45em] w-auto"
      aria-hidden
    >
      <path d="M3 2l18 18L3 38" />
    </svg>
  );
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <main>
      <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-background text-white">
        <Image
          src={hero}
          alt="City skyline at sunset"
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="hero-dim absolute inset-0 bg-black/70" />

        <div className="relative flex h-full">
          {/* Left rail */}
          <aside
            style={delay(500)}
            className="hero-brighten relative z-10 flex w-[10%] min-w-[110px] flex-col items-center justify-between py-8"
          >
            <a
              href="#enquire"
              className="mt-4 text-sm font-light uppercase tracking-wide md:text-base"
            >
              Enquire
            </a>
            <Link href="/" className="block w-full px-[4%]">
              <Image
                src={logo}
                alt="The Wolf Crest Real Estate"
                sizes="(min-width: 1100px) 10vw, 110px"
                className="h-auto w-full drop-shadow-[0_0_14px_rgba(255,255,255,0.18)]"
              />
            </Link>
          </aside>

          {/* Divider lines inset from top and bottom */}
          <div className="relative flex min-w-0 flex-1">
            <div
              style={delay(200)}
              className="hero-line absolute inset-y-8 left-0 w-px bg-white/80"
            />

            {/* Title block */}
            <div
              style={delay(150)}
              className="hero-slide w-[32%] min-w-0 shrink-0 pl-[3%] pt-8 max-md:w-full max-md:pl-4 max-md:pr-4"
            >
              <h1 className="text-[clamp(2.25rem,3.7vw,4rem)] font-light uppercase leading-none tracking-wide">
                Wolfcrest
              </h1>
              <p className="mt-8 max-w-[420px] text-[clamp(1rem,1.55vw,1.4rem)] font-light leading-[1.05]">
                Luxury Curated Residences For Long Term Living
              </p>
            </div>

            {/* Nav columns */}
            <nav className="flex flex-1 max-md:hidden">
              {navItems.map((item, i) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  className="group relative flex min-w-0 flex-1 basis-0 items-end pb-8 pl-[1.1vw]"
                >
                  <span
                    style={delay(600 + i * 140)}
                    className="hero-line absolute inset-y-8 left-0 w-px bg-white/80"
                  />
                  <span className="relative text-[clamp(0.9rem,1.65vw,1.75rem)] font-light uppercase leading-[1.3] tracking-wide">
                    <span className="nav-label block">
                      {item.label.map((word, line) => (
                        <span
                          key={word}
                          style={delay(1200 + i * 140 + line * 260)}
                          className="hero-reveal"
                        >
                          <span className="hero-reveal-inner">{word}</span>
                        </span>
                      ))}
                    </span>
                    <span className="nav-arrow absolute bottom-[0.1em] left-0">
                      <ArrowIcon />
                    </span>
                  </span>
                </TransitionLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="absolute inset-x-0 bottom-8 flex flex-col gap-2 pl-[calc(max(10%,110px)+4%)] md:hidden">
          {navItems.map((item, i) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              style={delay(1200 + i * 140)}
              className="hero-reveal text-lg font-light uppercase tracking-wide text-white/85"
            >
              <span className="hero-reveal-inner">{item.label.join(" ")}</span>
            </TransitionLink>
          ))}
        </nav>
      </section>
    </main>
  );
}
