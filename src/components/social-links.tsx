import type { CSSProperties, ReactNode } from "react";
import { socials, type SocialName } from "@/content/contact";

const icons: Record<SocialName, ReactNode> = {
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <path d="M13.5 20.5v-7.5h2.6l.4-3h-3V8.2c0-.9.3-1.5 1.6-1.5h1.5V4a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9V10H8v3h2.5v7.5" />
  ),
  LinkedIn: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5v6M8 7.6v.01M11.5 16.5v-6M11.5 13.2c0-1.6 1-2.7 2.4-2.7s2.1.9 2.1 2.6v3.4" />
    </>
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.2 9.3v5.4l4.6-2.7z" />
    </>
  ),
  TikTok: (
    <path d="M13 3.5v11.25a3.25 3.25 0 1 1-3.25-3.25M13 3.5c.3 2.6 2.1 4.4 4.75 4.6" />
  ),
};

/**
 * Social icons. A vertical stack for the hero's left rail by default, or a
 * row (with names on larger screens) on the Offices page.
 */
export function SocialLinks({
  baseDelay = 0,
  row = false,
}: {
  baseDelay?: number;
  row?: boolean;
}) {
  return (
    <ul
      className={
        row
          ? "flex flex-wrap items-center gap-x-[clamp(1.25rem,2.4vw,2.5rem)] gap-y-3"
          : "flex flex-col items-center gap-[clamp(0.8rem,1.9vh,1.2rem)]"
      }
    >
      {socials.map((social, i) => (
        <li
          key={social.name}
          className="fade-up"
          style={{ "--delay": `${baseDelay + i * 90}ms` } as CSSProperties}
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`The Wolf Crest on ${social.name}`}
            className="flex items-center gap-2.5 p-1 text-white/70 transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:text-white focus-visible:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[clamp(1.05rem,1.25vw,1.3rem)] shrink-0"
              aria-hidden
            >
              {icons[social.name]}
            </svg>
            {row && (
              <span className="text-xs uppercase tracking-[0.2em] max-sm:sr-only">
                {social.name}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
