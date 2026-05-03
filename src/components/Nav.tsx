"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useIntroState } from "@/lib/intro";

const NAV_LINKS = [
  { href: "/", label: "Index" },
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const pathname = usePathname();
  const introState = useIntroState();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // When intro loader is showing this session, delay until it exits.
  // Otherwise (returning visitor), animate right away.
  const navDelay = introState === true ? 2.4 : 0.1;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={introState === null ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: navDelay }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[120] transition-colors duration-500",
          scrolled || open
            ? "bg-bone/85 backdrop-blur-md border-b border-hairline"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-16 md:h-20 items-center justify-between">
          <Link
            href="/"
            aria-label="Onyx Creative Asia — home"
            className="flex items-center gap-2 group"
          >
            <span className="block h-2 w-2 rounded-full bg-ink transition-transform duration-500 group-hover:scale-150" />
            <span className="text-sm md:text-base font-medium tracking-tight">
              Onyx<span className="font-light italic">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.slice(1, -1).map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-bone transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
            >
              Start a project
              <span aria-hidden>→</span>
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden flex flex-col justify-center items-end gap-[5px] h-10 w-10"
            >
              <span
                className={cn(
                  "block h-px bg-ink transition-all duration-500 ease-out-expo",
                  open ? "w-6 translate-y-[3px] rotate-45" : "w-6"
                )}
              />
              <span
                className={cn(
                  "block h-px bg-ink transition-all duration-500 ease-out-expo",
                  open ? "w-6 -translate-y-[3px] -rotate-45" : "w-4"
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[110] bg-ink text-bone flex flex-col pt-20 md:hidden"
          >
            <nav className="container-x flex flex-col gap-2 pt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 text-4xl font-medium tracking-tight"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto container-x pb-10 text-xs uppercase tracking-[0.2em] opacity-60">
              hello@onyxcreative.asia
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative text-sm tracking-tight text-ink/80 hover:text-ink transition-colors"
    >
      <span className="relative">
        {label}
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-px bg-ink transition-all duration-500 ease-out-expo",
            active ? "w-full" : "w-0 group-hover:w-full"
          )}
        />
      </span>
    </Link>
  );
}
