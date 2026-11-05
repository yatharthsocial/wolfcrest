import type { CSSProperties, ReactNode } from "react";

// TODO: replace with the real profile URLs
const socials: { name: string; href: string; icon: ReactNode }[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <path d="M13.5 20.5v-7.5h2.6l.4-3h-3V8.2c0-.9.3-1.5 1.6-1.5h1.5V4a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9V10H8v3h2.5v7.5" />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
        <path d="M8 10.5v6M8 7.6v.01M11.5 16.5v-6M11.5 13.2c0-1.6 1-2.7 2.4-2.7s2.1.9 2.1 2.6v3.4" />
      </>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
        <path d="M10.2 9.3v5.4l4.6-2.7z" />
      </>
    ),
  },
];

/** Vertical stack of social icons for the hero's left rail */
export function SocialLinks({ baseDelay = 0 }: { baseDelay?: number }) {
  return (
    <ul className="flex flex-col items-center gap-[clamp(0.9rem,2.2vh,1.35rem)]">
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
            aria-label={`Wolfcrest on ${social.name}`}
            className="block p-1 text-white/70 transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:text-white focus-visible:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[clamp(1.05rem,1.25vw,1.3rem)]"
              aria-hidden
            >
              {social.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
