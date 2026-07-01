"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Search } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface HeaderProps {
  phoneNumber?: string;
  phoneDisplay?: string;
}

export function Header({
  phoneNumber = SITE_CONFIG.defaultPhone,
  phoneDisplay = SITE_CONFIG.defaultPhoneDisplay,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200"
          : "bg-white border-b border-transparent"
      )}
    >
      {/* Announcement bar */}
      <div className="bg-primary text-white text-center text-xs sm:text-sm py-1.5 px-4">
        <span className="hidden sm:inline">تورهای نوروز ۱۴۰۵ رزرو شد — </span>
        <Link href="/tours/special" className="underline font-semibold hover:opacity-90">
          مشاهده پیشنهادهای ویژه
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="ریوان سفر">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
              ر
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg lg:text-xl text-stone-900 leading-tight">
                ریوان سفر
              </div>
              <div className="text-xs text-stone-500 leading-tight">
                همسفر روان شما
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="منوی اصلی">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-primary hover:bg-stone-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-primary hover:bg-stone-50 transition-colors"
            >
              بلاگ
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-primary hover:bg-stone-50 transition-colors"
            >
              درباره ما
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-primary hover:bg-stone-50 transition-colors"
            >
              تماس
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg text-stone-600 hover:text-primary hover:bg-stone-50 transition-colors"
              aria-label="جستجو"
            >
              <Search className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${phoneNumber}`}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-50 text-accent-700 border border-accent-200 hover:bg-accent-100 transition-colors font-semibold text-sm"
              aria-label={`تماس با ${SITE_CONFIG.name}`}
            >
              <Phone className="w-4 h-4" />
              <span className="font-mono" dir="ltr">{phoneDisplay}</span>
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="md:hidden p-2 rounded-lg bg-accent-50 text-accent-700"
              aria-label="تماس"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-50"
              aria-label="منو"
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-stone-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="منوی موبایل">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-stone-200 my-2" />
            <Link href="/blog" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50">
              بلاگ
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50">
              درباره ما
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50">
              تماس با ما
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
