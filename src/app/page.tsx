import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CitySwitch, HeroBackdrop, HeroCityProvider } from "@/components/hero-city";
import { SocialLinks } from "@/components/social-links";
import { TransitionLink } from "@/components/transition-link";
import logo from "@/assets/realestate-logo-crop.jpg";

const navItems = [
  { label: ["About", "Wolfcrest"], href: "/about" },
  { label: ["Service"], href: "/service" },
  { label: ["Our", "Partners"], href: "/partners" },
  { label: ["Media"], href: "/media" },
  { label: ["Dubai", "Property", "Connect"], href: "/dubai-property-connect" },
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
      <HeroCityProvider>
        <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-background text-white">
          {/* Background: the chosen city's video, cross-fading on switch */}
          <div className="hero-settle absolute inset-0">
            <HeroBackdrop />
          </div>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 to-transparent" />
          <div className="hero-dim absolute inset-0 bg-black" />

          {/* Desktop / tablet layout */}
          <div className="relative flex h-full max-md:hidden">
            {/* Left rail */}
            <aside
              style={delay(500)}
              className="hero-brighten relative z-10 flex w-[10%] min-w-[110px] flex-col items-center justify-between py-8"
            >
              <TransitionLink
                href="/dubai-property-connect"
                className="mt-4 text-sm font-light uppercase tracking-wide md:text-base"
              >
                Enquire
              </TransitionLink>
              <div className="flex w-full flex-col items-center gap-[clamp(1.25rem,3.5vh,2.25rem)]">
                <SocialLinks baseDelay={1400} />
                <span aria-hidden className="h-px w-[38%] bg-white/35" />
                <Link href="/" className="block w-full px-[4%]">
                  <Image
                    src={logo}
                    alt="The Wolf Crest Real Estate"
                    sizes="(min-width: 1100px) 10vw, 110px"
                    className="h-auto w-full mix-blend-screen"
                  />
                </Link>
              </div>
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
                className="hero-slide w-[32%] min-w-0 shrink-0 pl-[3%] pt-8"
              >
                <h1 className="text-[clamp(2.25rem,3.7vw,4rem)] font-light uppercase leading-none tracking-wide">
                  Wolfcrest
                </h1>
                <p className="mt-8 max-w-[420px] text-[clamp(1rem,1.55vw,1.4rem)] font-light leading-[1.05]">
                  Luxury Curated Residences For Long Term Living
                </p>
                <CitySwitch style={delay(1500)} />
              </div>

              {/* Nav columns */}
              <nav className="flex flex-1">
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

          {/* Mobile layout: top bar, title, ruled menu, socials */}
          <div className="relative z-10 flex h-full flex-col px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] md:hidden">
            <header className="flex items-center justify-between">
              <Link href="/" style={delay(400)} className="fade-up block w-[68px] shrink-0">
                <Image
                  src={logo}
                  alt="The Wolf Crest Real Estate"
                  sizes="68px"
                  className="h-auto w-full mix-blend-screen"
                />
              </Link>
              <TransitionLink
                href="/dubai-property-connect"
                style={delay(600)}
                className="fade-up rounded-full border border-white/40 bg-black/20 px-5 py-2.5 text-[0.7rem] font-normal uppercase leading-none tracking-[0.22em] backdrop-blur-md transition-colors duration-500 active:bg-white active:text-black"
              >
                <span className="-mr-[0.22em]">Enquire</span>
              </TransitionLink>
            </header>

            <div style={delay(150)} className="hero-slide mt-[clamp(1.5rem,6svh,3rem)]">
              <h1 className="text-[clamp(2.6rem,13vw,3.75rem)] font-light uppercase leading-none tracking-[0.04em]">
                Wolfcrest
              </h1>
              <span
                aria-hidden
                style={delay(900)}
                className="hero-line-x mt-5 block h-px w-14 bg-white/70"
              />
              <p className="mt-5 max-w-[20rem] text-[1.05rem] font-light leading-snug text-white/90">
                Luxury Curated Residences For Long Term Living
              </p>
              <CitySwitch style={delay(1500)} />
            </div>

            <nav data-fab-avoid aria-label="Main" className="mt-auto pt-6">
              <ul>
                {navItems.map((item, i) => (
                  <li key={item.href} className="relative">
                    <span
                      aria-hidden
                      style={delay(700 + i * 120)}
                      className="hero-line-x absolute inset-x-0 top-0 h-px bg-white/25"
                    />
                    <TransitionLink
                      href={item.href}
                      style={delay(1100 + i * 120)}
                      className="hero-reveal"
                    >
                      <span className="hero-reveal-inner flex items-center gap-4 py-[clamp(0.6rem,1.9svh,0.95rem)] text-white/90 transition-colors active:text-white">
                        <span className="w-5 text-[0.65rem] tracking-[0.15em] text-white/50 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-[1.05rem] font-light uppercase leading-tight tracking-[0.08em]">
                          {item.label.join(" ")}
                        </span>
                        <span className="text-white/60">
                          <ArrowIcon />
                        </span>
                      </span>
                    </TransitionLink>
                  </li>
                ))}
                <li aria-hidden className="relative h-px">
                  <span
                    style={delay(700 + navItems.length * 120)}
                    className="hero-line-x absolute inset-x-0 top-0 h-px bg-white/25"
                  />
                </li>
              </ul>
            </nav>

            <div data-fab-avoid className="mt-4 flex justify-center">
              <SocialLinks row baseDelay={1900} />
            </div>
          </div>
        </section>
      </HeroCityProvider>
    </main>
  );
}
