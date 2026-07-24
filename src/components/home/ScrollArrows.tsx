"use client";

import { motion } from "framer-motion";

// Each arrow's opacity over one cycle: the bright (100%) point travels
// top -> bottom, then back up to the top, over the shared keyframe times.
// Everything else rests at 50%.
const ARROWS = [
  [1, 0.5, 0.5, 0.5, 1],
  [0.5, 1, 0.5, 1, 0.5],
  [0.5, 0.5, 1, 0.5, 0.5],
];
const TIMES = [0, 0.25, 0.5, 0.75, 1];

export default function ScrollArrows({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="flex flex-col items-center -space-y-1.5">
        {ARROWS.map((keys, i) => (
          <motion.svg
            key={i}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: keys }}
            transition={{
              duration: 1,
              times: TIMES,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-bone"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ))}
      </div>
    </div>
  );
}
