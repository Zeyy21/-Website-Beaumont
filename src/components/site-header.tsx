"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/lib/config";
import { cn } from "@/lib/cn";
import { useT } from "@/components/i18n/locale-provider";
import { LanguageSwitch } from "@/components/i18n/language-switch";
import { ButtonLink, Container, Wordmark } from "./ui";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { dict } = useT();
  const quoteOverlay = pathname === "/quote";
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [logoOnDark, setLogoOnDark] = useState(pathname === "/" || quoteOverlay);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let frame = 0;
    const updateLogoTone = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = 42;
        const darkSurface = Array.from(
          document.querySelectorAll<HTMLElement>('[data-header-tone="dark"]'),
        ).some((surface) => {
          const rect = surface.getBoundingClientRect();
          return rect.top <= marker && rect.bottom > marker;
        });
        setLogoOnDark(darkSurface);
      });
    };
    updateLogoTone();
    window.addEventListener("scroll", updateLogoTone, { passive: true });
    window.addEventListener("resize", updateLogoTone);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateLogoTone);
      window.removeEventListener("resize", updateLogoTone);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.36;
        const current = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= marker && rect.bottom > marker;
        });
        if (current) setActiveHash(`#${current.id}`);
        else if (window.scrollY < window.innerHeight * 0.65) setActiveHash("");
      });
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    setActiveHash(href);
    window.history.pushState(null, "", href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return pathname === "/" ? href : `/${href}`;
  };
  const quoteHref = sectionHref("#quote");

  return (
    <header
      className={cn(
        "pointer-events-none z-50 h-[84px] transition-[background-color,border-color,box-shadow] duration-500",
        quoteOverlay
          ? "absolute inset-x-0 top-0 bg-transparent"
          : "sticky top-0 border-b backdrop-blur-xl",
        !quoteOverlay &&
          (logoOnDark
            ? "border-ivory/[0.07] bg-soil/90 shadow-[0_12px_35px_-28px_rgba(0,0,0,.9)]"
            : "border-oak/[0.07] bg-ivory/90 shadow-[0_12px_35px_-28px_rgba(28,28,26,.55)]"),
      )}
    >
      <Container className="flex h-[84px] max-w-[1600px] items-center justify-between gap-1 px-3 sm:gap-3 sm:px-6 2xl:grid 2xl:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          data-logo-tone={logoOnDark ? "light" : "dark"}
          className="pointer-events-auto flex h-14 w-fit items-center px-2 transition-opacity duration-300 hover:opacity-75 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre justify-self-start"
          aria-label={`${site.name} ${dict.header.homeAria}`}
        >
          <span className="relative block h-4 aspect-[7.5/1] xs:h-5 sm:h-[1.35rem] md:h-6" aria-hidden="true">
            <span className={cn("absolute inset-0 transition-opacity duration-500 ease-out", logoOnDark ? "opacity-100" : "opacity-0")}>
              <Wordmark className="h-full drop-shadow-[0_2px_6px_rgba(0,0,0,.45)]" />
            </span>
            <span className={cn("absolute inset-0 transition-opacity duration-500 ease-out", logoOnDark ? "opacity-0" : "opacity-100")}>
              <Wordmark dark priority className="h-full drop-shadow-[0_1px_2px_rgba(244,241,236,.7)]" />
            </span>
          </span>
          <span className="sr-only">{site.name}</span>
        </Link>

        <nav className="pointer-events-auto hidden items-center justify-self-center gap-0.5 rounded-full border border-oak/10 bg-ivory/95 p-1.5 shadow-[0_14px_40px_-24px_rgba(28,28,26,.8)] backdrop-blur-xl 2xl:flex" aria-label={dict.header.primaryNav}>
          {nav.map((item) => {
            const active = pathname === "/" ? activeHash === item.href : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={sectionHref(item.href)}
                onClick={(event) => pathname === "/" && scrollToSection(event, item.href)}
                className={cn(
                  "relative isolate whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-soil/60 transition-colors hover:text-oak",
                  active && "text-oak",
                )}
              >
                {dict.nav[item.key]}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full border border-ochre/10 bg-sand/35 shadow-[inset_0_1px_0_rgba(255,255,255,.5)]"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pointer-events-auto flex items-center justify-self-end gap-1 sm:gap-2">
          {/* Always visible Phone Button */}
          <a
            href="tel:4388135716"
            className="flex h-12 items-center gap-1.5 rounded-full border border-oak/10 bg-ivory/95 px-3 text-[11px] font-semibold text-soil/80 shadow-soft backdrop-blur-xl transition-colors hover:bg-sand/30 hover:text-oak sm:gap-2 sm:px-4 sm:text-sm sm:tracking-wide"
            aria-label="Call us at (438) 813-5716"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="whitespace-nowrap tracking-tight sm:tracking-normal">(438) 813-5716</span>
          </a>

          {/* Desktop Right Nav (hidden on mobile) */}
          <div className="hidden items-center gap-1 rounded-full border border-oak/10 bg-ivory/95 p-1.5 shadow-[0_14px_40px_-24px_rgba(28,28,26,.8)] backdrop-blur-xl 2xl:flex">
            <LanguageSwitch className="mr-1" />
            <ButtonLink href={signedIn ? "/dashboard" : "/login"} variant="ghost" size="sm">
              {signedIn ? dict.header.account : dict.header.signIn}
            </ButtonLink>
            <ButtonLink href={quoteHref} onClick={(event) => pathname === "/" && scrollToSection(event, "#quote")} size="sm">
              {dict.header.freeEstimate}
            </ButtonLink>
          </div>

          {/* Hamburger (hidden on desktop) */}
          <button
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-oak/10 bg-ivory/95 text-oak shadow-soft backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre 2xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={dict.header.toggleMenu}
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute inset-x-4 top-[76px] overflow-hidden rounded-[1.5rem] border border-oak/10 bg-ivory/95 p-3 shadow-lift backdrop-blur-xl 2xl:hidden"
          >
            <nav className="flex flex-col" aria-label={dict.header.mobileNav}>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={sectionHref(item.href)}
                  onClick={(event) => pathname === "/" && scrollToSection(event, item.href)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium text-soil/70 hover:bg-sand/30 hover:text-oak",
                    activeHash === item.href && "bg-sand/30 text-oak",
                  )}
                >
                  {dict.nav[item.key]}
                </Link>
              ))}
            </nav>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-oak/10 pt-3">
              <ButtonLink href={signedIn ? "/dashboard" : "/login"} variant="outline">
                {signedIn ? dict.header.account : dict.header.signIn}
              </ButtonLink>
              <ButtonLink href={quoteHref} onClick={(event) => pathname === "/" && scrollToSection(event, "#quote")}>
                {dict.header.quote}
              </ButtonLink>
            </div>
            <div className="mt-3 flex flex-col items-center gap-4 border-t border-oak/10 pt-4">
              <LanguageSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
