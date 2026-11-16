import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/components/media/reveal";
import { SocialLinks } from "@/components/social-links";
import { TransitionLink } from "@/components/transition-link";
import { contact, mapsLink } from "@/content/contact";

export const metadata: Metadata = {
  title: "Dubai Property Connect | The Wolf Crest",
  description:
    "Visit The Wolf Crest Real Estate in Al Garhoud, Dubai, or reach us by phone, WhatsApp or email.",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M3 2l18 18L3 38" />
    </svg>
  );
}

/** One hairline contact row: small label, large value, arrow that slides on hover */
function Row({
  label,
  href,
  external = false,
  children,
}: {
  label: string;
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group relative flex items-center justify-between gap-6 border-b border-white/20 py-[clamp(1.1rem,2.6vh,1.75rem)]"
    >
      {/* Gold underline that draws across on hover */}
      <span
        aria-hidden
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-[#c9a96b] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <span className="min-w-0">
        <span className="block text-[0.7rem] uppercase tracking-[0.28em] text-white/50">
          {label}
        </span>
        <span className="mt-2 block text-[clamp(1.15rem,1.9vw,1.9rem)] font-light leading-snug text-white/90 transition-colors duration-500 group-hover:text-white">
          {children}
        </span>
      </span>
      <ArrowIcon className="h-5 w-auto shrink-0 text-white/50 transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-white" />
    </a>
  );
}

export default function DubaiPropertyConnectPage() {
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(contact.address.mapQuery)}&z=16&output=embed`;

  return (
    <main className="relative w-full bg-background text-white">
      <header
        style={delay(500)}
        className="fade-up flex items-center justify-between gap-6 border-b border-white/25 px-[5vw] py-[clamp(1rem,2.6vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/75"
      >
        <span>The Wolf Crest</span>
        <TransitionLink
          href="/"
          className="group flex items-center gap-2 transition-colors duration-500 hover:text-white"
        >
          <ArrowIcon className="h-3 w-auto rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
          Home
        </TransitionLink>
      </header>

      {/* Intro */}
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pb-[clamp(2rem,6vh,4rem)] pt-[clamp(2.5rem,9vh,6rem)]">
        <h1
          style={delay(300)}
          className="hero-slide text-[clamp(2.75rem,8vw,9rem)] font-light uppercase leading-[0.88] tracking-[0.02em]"
        >
          Dubai Property
          <br />
          Connect
        </h1>
        <p
          style={delay(900)}
          className="fade-up max-w-[32ch] pb-[0.6em] text-[clamp(1.05rem,1.5vw,1.5rem)] font-light leading-snug text-white/70"
        >
          Visit us in Al Garhoud, or reach us by phone, WhatsApp or email.
        </p>
      </div>

      <section
        id="contact"
        className="grid grid-cols-1 gap-[clamp(2rem,4vw,4.5rem)] border-t border-white/25 px-[5vw] py-[clamp(2.5rem,8vh,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      >
        <Reveal className="flex flex-col">
          <Row label="Visit" href={mapsLink} external>
            {contact.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="mt-2 block text-sm uppercase tracking-[0.18em] text-[#c9a96b]">
              Landmark: {contact.address.landmark}
            </span>
          </Row>
          <Row label="Call" href={contact.phone.href}>
            {contact.phone.label}
          </Row>
          <Row label="WhatsApp" href={contact.whatsapp.href} external>
            {contact.whatsapp.label}
          </Row>
          <Row label="Email" href={contact.email.href}>
            {contact.email.label}
          </Row>
          <div className="pt-[clamp(1.25rem,3vh,2rem)]">
            <span className="mb-4 block text-[0.7rem] uppercase tracking-[0.28em] text-white/50">
              Follow
            </span>
            <SocialLinks row baseDelay={900} />
          </div>
        </Reveal>

        {/* Map, toned dark to match the site */}
        <Reveal delay={150} className="relative min-h-[clamp(20rem,55vh,38rem)] overflow-hidden border border-white/15 bg-black/40">
          <iframe
            src={embed}
            title="Map to The Wolf Crest office, Al Garhoud, Dubai"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full [filter:grayscale(1)_invert(0.9)_contrast(0.9)_brightness(0.95)]"
          />
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group absolute right-3 top-3 flex items-center gap-3 bg-background/90 px-5 py-3 text-xs uppercase tracking-[0.22em] backdrop-blur-sm transition-colors duration-500 hover:bg-white hover:text-background"
          >
            Get directions
            <ArrowIcon className="h-3 w-auto transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </Reveal>
      </section>

      <footer className="flex items-stretch border-t border-white/25">
        <span className="flex flex-1 items-center px-[5vw] py-[clamp(1rem,3vh,1.75rem)] text-xs uppercase tracking-[0.22em] text-white/60">
          The Wolf Crest Real Estate, Dubai
        </span>
        <a
          href={contact.email.href}
          className="group flex items-center gap-5 border-l border-white/25 px-[clamp(1.25rem,3vw,3rem)] text-sm uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-white hover:text-background"
        >
          Email us
          <ArrowIcon className="h-5 w-auto transition-transform duration-500 group-hover:translate-x-1" />
        </a>
      </footer>

      {/* Arrives from the page curtain: starts black, then lifts */}
      <div aria-hidden className="hero-dim pointer-events-none fixed inset-0 z-40 bg-black" />
    </main>
  );
}
