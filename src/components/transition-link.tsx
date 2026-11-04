"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

// Matches the .page-curtain animation duration in globals.css
const CURTAIN_MS = 900;
// How long the curtain stays after navigating, while the new page paints
const HOLD_MS = 350;

type Props = ComponentProps<typeof Link> & { href: string };

let navigating = false;

/**
 * A Link that sweeps a black curtain across the screen before navigating.
 * Every destination page starts black and fades in, so the hand-off is seamless.
 *
 * The curtain lives on document.body rather than in React state: Next keeps the
 * page we leave alive in the background, so state here would survive and leave
 * the curtain covering that page when the visitor comes back to it.
 */
export function TransitionLink({ href, children, ...props }: Props) {
  const router = useRouter();

  return (
    <Link
      href={href}
      {...props}
      onNavigate={(e) => {
        if (
          href.startsWith("#") ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }
        e.preventDefault();
        if (navigating) return;
        navigating = true;

        const curtain = document.createElement("div");
        curtain.setAttribute("aria-hidden", "true");
        curtain.className = "page-curtain fixed inset-0 z-50 bg-black";
        document.body.append(curtain);

        setTimeout(() => {
          router.push(href);
          setTimeout(() => {
            curtain.remove();
            navigating = false;
          }, HOLD_MS);
        }, CURTAIN_MS);
      }}
    >
      {children}
    </Link>
  );
}
