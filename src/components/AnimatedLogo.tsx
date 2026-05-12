"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * GSAP-animated Onyx wordmark.
 *
 * Two variants:
 *   - "mark"    → square brand mark with bullet + "O" → used as compact
 *                  block (header chrome, avatar slots, story cards)
 *   - "wordmark" → horizontal lockup with bullet + "Onyx." + subtitle
 *                  (intro reveal, email headers, footer)
 *
 * Animation sequence (intent: ~1.2s total, then idle pulse on the bullet):
 *   1. Bullet dot scales in from 0 with elastic ease
 *   2. Wordmark letters slide up + fade in with stagger
 *   3. Italic dot pops in last with a tiny rotate
 *   4. Bullet starts an infinite pulse loop (subtle, brand-feel)
 *
 * The SVG is server-rendered with its final state visible, so SSR /
 * no-JS users see a complete logo. GSAP resets state on mount and
 * plays from the beginning.
 */
export default function AnimatedLogo({
  variant = "wordmark",
  className,
  delay = 0,
  ariaLabel = "Onyx Creative Asia",
}: {
  variant?: "wordmark" | "mark";
  className?: string;
  delay?: number;
  ariaLabel?: string;
}) {
  const rootRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const bullet = root.querySelector<SVGElement>('[data-anim="bullet"]');
      const echo = root.querySelector<SVGElement>('[data-anim="echo"]');
      const letters = root.querySelectorAll<SVGElement>('[data-anim="letter"]');
      const period = root.querySelector<SVGElement>('[data-anim="period"]');
      const divider = root.querySelector<SVGElement>('[data-anim="divider"]');
      const subtitle = root.querySelector<SVGElement>('[data-anim="subtitle"]');

      // Set starting state
      if (bullet) gsap.set(bullet, { transformOrigin: "center", scale: 0, opacity: 0 });
      if (letters.length) gsap.set(letters, { yPercent: 50, opacity: 0 });
      if (period) gsap.set(period, { opacity: 0, scale: 0.4, transformOrigin: "center" });
      if (divider) gsap.set(divider, { scaleY: 0, transformOrigin: "center" });
      if (subtitle) gsap.set(subtitle, { opacity: 0, x: -8 });
      if (echo) gsap.set(echo, { opacity: 0 });

      const tl = gsap.timeline({ delay });

      if (bullet) {
        tl.to(bullet, {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "elastic.out(1, 0.55)",
        });
      }

      if (letters.length) {
        tl.to(
          letters,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.045,
          },
          "-=0.45"
        );
      }

      if (period) {
        tl.to(
          period,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2.2)",
          },
          "-=0.2"
        );
      }

      if (divider) {
        tl.to(
          divider,
          {
            scaleY: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      if (subtitle) {
        tl.to(
          subtitle,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }

      // Idle pulse on the bullet — once intro is done, gently breathe.
      // Echo ring expands + fades on each beat.
      if (bullet) {
        tl.to(
          bullet,
          {
            scale: 1.18,
            duration: 1.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
          ">+=0.3"
        );
      }
      if (echo) {
        // Echo plays independent of the main TL — keeps a separate cadence
        gsap.to(echo, {
          scale: 2.4,
          opacity: 0,
          duration: 2.4,
          ease: "power2.out",
          delay: delay + 1.6,
          repeat: -1,
          repeatDelay: 0.2,
          transformOrigin: "center",
          onStart: () => {
            gsap.set(echo, { opacity: 0.35, scale: 1 });
          },
          onRepeat: () => {
            gsap.set(echo, { opacity: 0.35, scale: 1 });
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [delay, variant]);

  if (variant === "mark") {
    return (
      <svg
        ref={rootRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 56 56"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        <rect width="56" height="56" rx="4" fill="#F4F1EC" />
        <circle data-anim="bullet" cx="28" cy="28" r="6" fill="#0E0E0E" />
        <circle
          data-anim="echo"
          cx="28"
          cy="28"
          r="6"
          fill="none"
          stroke="#0E0E0E"
          strokeOpacity="0.3"
        />
      </svg>
    );
  }

  // Wordmark variant
  const LETTERS = ["O", "n", "y", "x"];
  return (
    <svg
      ref={rootRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 56"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Echo ring behind the bullet */}
      <circle
        data-anim="echo"
        cx="14"
        cy="28"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0"
      />
      <circle data-anim="bullet" cx="14" cy="28" r="5" fill="currentColor" />

      {/* Letters — each as its own <text> so we can stagger them */}
      {LETTERS.map((char, i) => (
        <text
          key={`${char}-${i}`}
          data-anim="letter"
          x={32 + i * 18.5}
          y="36"
          fontFamily="inherit"
          fontSize="26"
          fontWeight="600"
          letterSpacing="-0.4"
          fill="currentColor"
        >
          {char}
        </text>
      ))}

      {/* Italic period */}
      <text
        data-anim="period"
        x="106"
        y="36"
        fontFamily="inherit"
        fontSize="26"
        fontWeight="300"
        fontStyle="italic"
        fill="currentColor"
      >
        .
      </text>

      {/* Divider */}
      <rect
        data-anim="divider"
        x="124"
        y="14"
        width="1"
        height="28"
        fill="currentColor"
        fillOpacity="0.25"
      />

      {/* Subtitle */}
      <text
        data-anim="subtitle"
        x="138"
        y="33"
        fontFamily="inherit"
        fontSize="11"
        fontWeight="500"
        letterSpacing="3"
        fill="currentColor"
        fillOpacity="0.65"
      >
        CREATIVE ASIA
      </text>
    </svg>
  );
}
