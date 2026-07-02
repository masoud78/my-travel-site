"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Search, ChevronDown, Globe, Sun, Moon, Sparkles } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  phoneNumber?: string;
  phoneDisplay?: string;
  logoSrc?: string | null;
  siteTitle?: string;
  siteSubtitle?: string;
}

// Mega Menu Categories
const MEGA_MENU_CATEGORIES = [
  {
    key: "internal",
    label: "تور داخلی",
    href: "/tours/domestic",
    description: "تورهای داخلی ایران",
    icon: "🏔️",
    subItems: [
      { label: "تور شمال", href: "/tours/domestic/north" },
      { label: "تور جنوب", href: "/tours/domestic/south" },
      { label: "تور غرب", href: "/tours/domestic/west" },
      { label: "تور شرق", href: "/tours/domestic/east" },
      { label: "تور جزیره", href: "/tours/domestic/islands" },
    ],
  },
  {
    key: "turkey",
    label: "تور ترکیه",
    href: "/tours/turkey",
    description: "پرفروش‌ترین تورهای خارجی",
    icon: "🇹🇷",
    subItems: [
      { label: "تور آنتالیا", href: "/tours/turkey/antalya" },
      { label: "تور استانبول", href: "/tours/turkey/istanbul" },
      { label: "تور کمر", href: "/tours/turkey/kemer" },
      { label: "تور آلانیا", href: "/tours/turkey/alanya" },
      { label: "تور بودروم", href: "/tours/turkey/bodrum" },
    ],
  },
  {
    key: "europe",
    label: "تور اروپا",
    href: "/tours/europe",
    description: "تورهای اروپایی",
    icon: "🇪🇺",
    subItems: [
      { label: "تور ایتالیا", href: "/tours/europe/italy" },
      { label: "تور فرانسه", href: "/tours/europe/france" },
      { label: "تور اسپانیا", href: "/tours/europe/spain" },
      { label: "تور آلمان", href: "/tours/europe/germany" },
      { label: "تور اتریش", href: "/tours/europe/austria" },
    ],
  },
  {
    key: "asia",
    label: "تور آسیایی",
    href: "/tours/asia",
    description: "تورهای آسیا",
    icon: "🌏",
    subItems: [
      { label: "تور تایلند", href: "/tours/asia/thailand" },
      { label: "تور مالزی", href: "/tours/asia/malaysia" },
      { label: "تور دبی", href: "/tours/asia/dubai" },
      { label: "تور سنگاپور", href: "/tours/asia/singapore" },
      { label: "تور اندونزی", href: "/tours/asia/indonesia" },
    ],
  },
];

const OTHER_LINKS = [
  { label: "تورهای ویژه", href: "/tours/special", icon: <Sparkles className="w-4 h-4" /> },
  { label: "بلاگ", href: "/blog", icon: "📝" },
  { label: "درباره ما", href: "/about", icon: "ℹ️" },
  { label: "تماس با ما", href: "/contact", icon: "📞" },
];

export function Header({
  phoneNumber = SITE_CONFIG.defaultPhone,
  phoneDisplay = SITE_CONFIG.defaultPhoneDisplay,
  logoSrc,
  siteTitle = SITE_CONFIG.name,
  siteSubtitle = SITE_CONFIG.tagline,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mega-menu-container")) {
        setMegaMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // In a real implementation, you would toggle the theme class on html
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-stone-200"
          : "bg-white/80 border-b border-transparent"
      )}
    >
      {/* Announcement Bar - Modern Design */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">تورهای نوروز ۱۴۰۵ با تخفیف ویژه —</span>
            <Link
              href="/tours/special"
              className="font-semibold hover:underline flex items-center gap-1"
            >
              پیشنهادهای ویژه
              <span className="text-secondary-300">✨</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo - Modern Design */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label={siteTitle}>
            {logoSrc ? (
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 shrink-0">
                <Image
                  src={logoSrc}
                  alt={siteTitle}
                  fill
                  className="object-contain"
                  sizes="56px"
                  priority
                />
              </div>
            ) : (
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                <span className="relative z-10">ر</span>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <div className="hidden sm:block">
              <div className="font-bold text-lg lg:text-xl text-stone-900 leading-tight">
                {siteTitle}
              </div>
              <div className="text-xs text-stone-500 leading-tight">
                {siteSubtitle}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Mega Menu */}
          <nav className="hidden lg:flex items-center gap-1 mega-menu-container" aria-label="منوی اصلی">
            {MEGA_MENU_CATEGORIES.map((category) => (
              <div key={category.key} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 px-4 py-2 text-stone-700 hover:text-primary hover:bg-primary-50 rounded-xl font-medium gap-1"
                  onClick={() => setMegaMenuOpen(megaMenuOpen === category.key ? null : category.key)}
                  rightIcon={<ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen === category.key ? "rotate-180" : ""}`} />}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </Button>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen === category.key && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-stone-100">
                      <h3 className="font-bold text-stone-900 flex items-center gap-2">
                        {category.icon}
                        {category.label}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">{category.description}</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                      {category.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-primary-50 hover:text-primary transition-colors"
                          onClick={() => setMegaMenuOpen(null)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                    <div className="p-4 border-t border-stone-100 bg-stone-50">
                      <Link
                        href={category.href}
                        className="block w-full text-center py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                        onClick={() => setMegaMenuOpen(null)}
                      >
                        مشاهده همه تورهای {category.label}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Other Links */}
            {OTHER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 h-12 rounded-xl text-sm font-medium text-stone-700 hover:text-primary hover:bg-primary-50 transition-colors flex items-center gap-1"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <Link
              href="/search"
              className="p-2.5 rounded-xl text-stone-600 hover:text-primary hover:bg-primary-50 transition-colors"
              aria-label="جستجو"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex rounded-xl"
              onClick={toggleTheme}
              aria-label="تغییر تم"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Phone Button */}
            <a
              href={`tel:${phoneNumber}`}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
              aria-label={`تماس با ${SITE_CONFIG.name}`}
            >
              <Phone className="w-4 h-4" />
              <span className="tabular-nums tracking-wide" dir="ltr">{phoneDisplay}</span>
            </a>

            {/* Mobile Phone Button */}
            <a
              href={`tel:${phoneNumber}`}
              className="md:hidden p-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white"
              aria-label="تماس"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-xl"
                  aria-label="منو"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <MobileNavigation setOpen={setOpen} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Separate for better UX */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}
    </header>
  );
}

// Mobile Navigation Component
function MobileNavigation({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold">
            ر
          </div>
          <span className="font-bold text-stone-900">{SITE_CONFIG.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {MEGA_MENU_CATEGORIES.map((category) => (
          <div key={category.key} className="border border-stone-100 rounded-xl overflow-hidden">
            <button
              className="w-full p-4 text-right flex items-center justify-between gap-2 hover:bg-stone-50 transition-colors"
              onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
            >
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="font-medium text-stone-900">{category.label}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${expandedCategory === category.key ? "rotate-180" : ""}`} />
            </button>
            {expandedCategory === category.key && (
              <div className="p-4 pt-0 space-y-2 bg-stone-50">
                {category.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="block p-3 rounded-lg text-sm text-stone-700 hover:bg-white transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-stone-100 space-y-2">
          {OTHER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 p-4 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-100 bg-stone-50">
        <a
          href={`tel:${SITE_CONFIG.defaultPhone}`}
          className="block w-full text-center py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Phone className="w-5 h-5 mx-auto mb-1" />
          تماس با مشاور
        </a>
      </div>
    </div>
  );
}

// Animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Add animation styles to document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = animationStyles;
  document.head.appendChild(styleElement);
}
