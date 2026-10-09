"use client";

/**
 * One image that splits into three panels on scroll, then flips each
 * panel over to show a card on its back.
 *
 * Adapted from componentry.dev "scroll-split-card"
 * (MIT License, Copyright (c) 2026 Harsh Jadhav).
 *
 * Changes for Onyx:
 *   - the opening and closing captions are props, not hardcoded demo copy
 *   - the grain overlay is an inline SVG instead of a hotlinked PNG on a
 *     third-party CDN
 *   - the image is sized with `cover` across the three panels, so it is
 *     cropped rather than stretched to the row's aspect ratio
 *   - prefers-reduced-motion skips the 3D sequence and shows the three
 *     cards as a plain row
 *   - type scales down below md, where each panel is a third of a phone
 */

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";

export type ScrollSplitCardItem = {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon?: ReactNode;
};

// Fine monochrome grain, generated rather than fetched.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function CardFace({ card }: { card: ScrollSplitCardItem }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {card.icon && <div className="relative z-10 mb-auto">{card.icon}</div>}
      <h3 className="relative z-10 mb-2 text-base font-medium leading-tight tracking-tight md:mb-4 md:text-2xl">
        {card.title}
      </h3>
      <p className="relative z-10 text-[11px] leading-snug opacity-80 md:text-sm md:leading-normal">
        {card.description}
      </p>
    </>
  );
}

export default function ScrollSplitCard({
  className,
  imageSrc,
  imageClassName,
  cards,
  startCaption,
  endCaption,
}: {
  /** Controls the outer scroll region, and therefore the scroll distance. */
  className?: string;
  imageSrc: string;
  /** Applied to each image slice, e.g. a filter. */
  imageClassName?: string;
  cards: ScrollSplitCardItem[];
  startCaption?: ReactNode;
  endCaption?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 0 → 0.4 the panels separate, 0.4 → 0.8 they flip and close up again.
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  // After a 180° Y flip a positive Z reads counter-clockwise.
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6]);

  // Square inner corners at rest, so the three panels read as one image.
  const radiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"]);
  const radiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"]);
  const radiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.35]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -120]);
  const endOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.8, 1], [40, 0]);
  const startOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const startY = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

  const shown = cards.slice(0, 3);

  if (reduced) {
    return (
      <div ref={containerRef} className="container-x py-24 md:py-32">
        {startCaption && <div className="mb-10 text-center">{startCaption}</div>}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {shown.map((card) => (
            <div
              key={card.title}
              className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl p-6"
              style={{ backgroundColor: card.bgColor, color: card.textColor }}
            >
              <CardFace card={card} />
            </div>
          ))}
        </div>
        {endCaption && <div className="mt-10 text-center">{endCaption}</div>}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative h-[320vh] w-full", className)}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]">
        {startCaption && (
          <motion.div
            className="absolute left-0 right-0 top-[11%] px-6 text-center"
            style={{ opacity: startOpacity, y: startY }}
          >
            {startCaption}
          </motion.div>
        )}

        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="relative top-[6vh] flex h-[340px] w-full max-w-4xl px-9 md:h-[400px] md:px-4"
        >
          {shown.map((card, i) => {
            const radius = i === 0 ? radiusLeft : i === 2 ? radiusRight : radiusMiddle;
            return (
              <motion.div
                key={card.title}
                className="relative h-full flex-1"
                style={{
                  x: i === 0 ? leftX : i === 2 ? rightX : 0,
                  rotateY,
                  rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                  zIndex: i, // left under middle, right over middle
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front: this panel's third of the image */}
                <motion.div
                  className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                  style={{ zIndex: 2, borderRadius: radius, boxShadow }}
                >
                  <div
                    className={cn("absolute inset-y-0 h-full w-[300%]", imageClassName)}
                    style={{
                      left: `${-100 * i}%`,
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </motion.div>

                {/* Back: the card, pre-rotated so it faces forward after the flip */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end overflow-hidden p-4 will-change-transform [backface-visibility:hidden] md:p-8"
                  style={{
                    backgroundColor: card.bgColor,
                    color: card.textColor,
                    transform: "rotateY(180deg)",
                    zIndex: 1,
                    borderRadius: radius,
                    boxShadow,
                  }}
                >
                  <CardFace card={card} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {endCaption && (
          <motion.div
            className="absolute bottom-[14%] left-0 right-0 px-6 text-center"
            style={{ opacity: endOpacity, y: endY }}
          >
            {endCaption}
          </motion.div>
        )}
      </div>
    </div>
  );
}
