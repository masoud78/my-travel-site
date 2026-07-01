/**
 * Site-wide configuration constants.
 * These are FALLBACK values — runtime values come from the Setting table (CMS).
 * Used during SSG when DB is unavailable.
 */
export const SITE_CONFIG = {
  name: "ریوان سفر",
  nameEn: "Rivan Safar",
  tagline: "همسفر روان شما در دنیای سفر",
  description:
    "آژانس مسافرتی ریوان سفر، ارائه‌دهنده‌ی تورهای داخلی و خارجی با مدل مشاوره‌ی تخصصی تلفنی. تورهای ترکیه، اروپا، آسیا و مقصدهای داخلی با بهترین قیمت.",
  url: "https://rivansafar.com",
  locale: "fa_IR",
  defaultPhone: "021-91012345",
  defaultPhoneDisplay: "۰۲۱-۹۱۰۱۲۳۴۵",
  whatsapp: "989121234567",
  telegram: "rivansafar",
  email: "info@rivansafar.com",
  workingHours: "شنبه تا پنج‌شنبه ۹ تا ۲۱ — جمعه ۱۰ تا ۱۸",
  socials: {
    instagram: "https://instagram.com/rivansafar",
    telegram: "https://t.me/rivansafar",
    whatsapp: "https://wa.me/989121234567",
    youtube: "https://youtube.com/@rivansafar",
  },
  defaultMetaImage: "/og-default.png",
} as const;

export const NAV_LINKS = [
  { label: "تور داخلی", href: "/tours/domestic", key: "domestic" },
  { label: "تور ترکیه", href: "/tours/turkey", key: "turkey" },
  { label: "تور آسیایی", href: "/tours/asia", key: "asia" },
  { label: "تور اروپا", href: "/tours/europe", key: "europe" },
  { label: "تورهای ویژه", href: "/tours/special", key: "special" },
] as const;

export const FOOTER_LINKS = {
  agency: [
    { label: "درباره ما", href: "/about" },
    { label: "تیم مشاورها", href: "/team" },
    { label: "شعب و نمایندگی", href: "/branches" },
    { label: "نظرات مشتریان", href: "/reviews" },
    { label: "گالری سفرها", href: "/gallery" },
    { label: "فرصت‌های شغلی", href: "/careers" },
  ],
  tours: [
    { label: "تور داخلی", href: "/tours/domestic" },
    { label: "تور ترکیه", href: "/tours/turkey" },
    { label: "تور آسیایی", href: "/tours/asia" },
    { label: "تور اروپا", href: "/tours/europe" },
    { label: "تورهای ویژه", href: "/tours/special" },
  ],
  support: [
    { label: "تماس با ما", href: "/contact" },
    { label: "سؤالات متداول", href: "/faq" },
    { label: "شرایط کنسلی", href: "/cancellation" },
    { label: "قوانین و مقررات", href: "/terms" },
    { label: "حریم خصوصی", href: "/privacy" },
  ],
  business: [
    { label: "همکاری B2B", href: "/b2b" },
    { label: "بلاگ و راهنمای سفر", href: "/blog" },
    { label: "نقشه سایت", href: "/sitemap" },
  ],
} as const;
