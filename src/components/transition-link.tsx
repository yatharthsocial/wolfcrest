"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";

// Matches the .page-curtain animation duration in globals.css
const CURTAIN_MS = 900;

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * A Link that sweeps a black curtain across the screen before navigating.
 * The destination page starts black and fades in, so the hand-off is seamless.
 */
export function TransitionLink({ href, children, ...props }: Props) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  return (
    <>
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
          if (leaving) return;
          setLeaving(true);
          setTimeout(() => router.push(href), CURTAIN_MS);
        }}
      >
        {children}
      </Link>
      {leaving &&
        createPortal(
          <div aria-hidden className="page-curtain fixed inset-0 z-50 bg-black" />,
          document.body,
        )}
    </>
  );
}
