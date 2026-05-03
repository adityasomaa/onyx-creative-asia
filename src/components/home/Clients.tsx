"use client";

import Marquee from "@/components/Marquee";
import { CLIENTS } from "@/lib/data";

export default function Clients() {
  return (
    <section className="border-y border-hairline py-8 md:py-10">
      <Marquee items={CLIENTS} />
    </section>
  );
}
