import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Send, Shield, BadgeCheck } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/site-config";

interface FooterProps {
  phoneNumber?: string;
  phoneDisplay?: string;
  email?: string;
  logoSrc?: string | null;
  siteTitle?: string;
  siteSubtitle?: string;
}

export function Footer({
  phoneNumber = SITE_CONFIG.defaultPhone,
  phoneDisplay = SITE_CONFIG.defaultPhoneDisplay,
  email = SITE_CONFIG.email,
  logoSrc,
  siteTitle = SITE_CONFIG.name,
  siteSubtitle = SITE_CONFIG.tagline,
}: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-200 mt-12 md:mt-20">
      {/* Newsletter strip */}
      <div className="bg-primary-900 border-b border-primary-800">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-right">
            <div className="text-base sm:text-lg font-bold text-white">از تورهای جدید زودتر باخبر شوید</div>
            <div className="text-xs sm:text-sm text-primary-100 mt-1">
              ایمیل خود را وارد کنید و پیشنهادهای ویژه‌ی ماهانه را دریافت کنید
            </div>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              required
              placeholder="ایمیل شما"
              className="flex-1 md:w-64 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              aria-label="ایمیل"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-secondary hover:bg-secondary-600 text-white font-semibold transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              عضویت
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {logoSrc ? (
                <div className="relative w-10 h-10 shrink-0">
                  <Image src={logoSrc} alt={siteTitle} fill className="object-contain" sizes="40px" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                  ر
                </div>
              )}
              <div>
                <div className="font-bold text-white">{siteTitle}</div>
                <div className="text-xs text-stone-400">{siteSubtitle}</div>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              آژانس مسافرتی ریوان سفر با سال‌ها تجربه در ارائه‌ی تورهای داخلی و خارجی، در کنار شماست تا سفری روان و به‌یادماندنی برایتان رقم بزنیم.
            </p>
            <div className="flex gap-2">
              <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={SITE_CONFIG.socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="تلگرام" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          <FooterCol title="آژانس" links={FOOTER_LINKS.agency} />
          <FooterCol title="تورها" links={FOOTER_LINKS.tours} />
          <FooterCol title="پشتیبانی" links={FOOTER_LINKS.support} />

          {/* Contact column */}
          <div>
            <h3 className="font-bold text-white mb-4">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${phoneNumber}`} className="flex items-start gap-2 text-stone-300 hover:text-secondary transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="tabular-nums tracking-wide" dir="ltr">{phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2 text-stone-300 hover:text-secondary transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span dir="ltr">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{SITE_CONFIG.workingHours}</span>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="px-3 py-2 rounded-lg bg-stone-800 text-xs text-stone-400 border border-stone-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                نماد اعتماد
              </div>
              <div className="px-3 py-2 rounded-lg bg-stone-800 text-xs text-stone-400 border border-stone-700 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                مجوز رسمی
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} ریوان سفر — تمامی حقوق محفوظ است.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-stone-300">قوانین و مقررات</Link>
            <Link href="/privacy" className="hover:text-stone-300">حریم خصوصی</Link>
            <Link href="/sitemap" className="hover:text-stone-300">نقشه سایت</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-stone-400 hover:text-secondary transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
