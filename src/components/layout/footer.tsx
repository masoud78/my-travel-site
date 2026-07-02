import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Send, Clock, ShieldCheck, Award, Users, Globe } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterProps {
  phoneNumber?: string;
  phoneDisplay?: string;
  email?: string;
  logoSrc?: string | null;
  siteTitle?: string;
  siteSubtitle?: string;
}

// Social Media Links
const SOCIAL_LINKS = [
  { name: "Instagram", href: SITE_CONFIG.socials.instagram, icon: Instagram, color: "bg-gradient-to-r from-pink-500 to-purple-600" },
  { name: "Telegram", href: SITE_CONFIG.socials.telegram, icon: Send, color: "bg-blue-500" },
  { name: "WhatsApp", href: SITE_CONFIG.socials.whatsapp, icon: Send, color: "bg-emerald-500" },
  { name: "YouTube", href: SITE_CONFIG.socials.youtube, icon: "📺", color: "bg-red-500" },
];

// Quick Stats
const QUICK_STATS = [
  { icon: Award, value: "۱۵+", label: "سال تجربه", color: "text-amber-600" },
  { icon: Users, value: "۲۰,۰۰۰+", label: "مسافر راضی", color: "text-primary-600" },
  { icon: Globe, value: "۱۵۰+", label: "مقصد گردشگری", color: "text-accent-600" },
  { icon: ShieldCheck, value: "۹۸٪", label: "رضایت مشتری", color: "text-emerald-600" },
];

// Trust Indicators
const TRUST_INDICATORS = [
  { icon: ShieldCheck, title: "گارانتی بهترین قیمت", description: "تضمین پایین‌ترین قیمت بازار" },
  { icon: Award, title: "مجوز رسمی", description: "از سازمان میراث فرهنگی" },
  { icon: Users, title: "پشتیبانی ۲۴/۷", description: "در تمام مراحل سفر" },
  { icon: Globe, title: "مقاصد متنوع", description: "بیش از ۱۵۰ مقصد" },
];

export function Footer({
  phoneNumber = SITE_CONFIG.defaultPhone,
  phoneDisplay = SITE_CONFIG.defaultPhoneDisplay,
  email = SITE_CONFIG.email,
  logoSrc,
  siteTitle = SITE_CONFIG.name,
  siteSubtitle = SITE_CONFIG.tagline,
}: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-200 mt-16 md:mt-24">
      {/* Newsletter Section - Modern Design */}
      <div className="bg-gradient-to-r from-primary-900/80 to-primary-800/80 border-b border-primary-700/50">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-right">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                از تورهای جدید و تخفیف‌های ویژه زودتر باخبر شوید
              </h2>
              <p className="text-sm sm:text-base text-primary-100">
                ایمیل خود را وارد کنید و پیشنهادهای ویژه‌ی ماهانه را دریافت کنید
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                placeholder="ایمیل شما (مثلاً example@email.com)"
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:border-accent-500 focus:ring-accent-500"
                dir="ltr"
              />
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full sm:w-auto whitespace-nowrap"
              >
                عضویت در خبرنامه
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {logoSrc ? (
                <div className="relative w-14 h-14 shrink-0">
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  ر
                </div>
              )}
              <div>
                <div className="font-bold text-xl text-white">{siteTitle}</div>
                <div className="text-sm text-stone-400">{siteSubtitle}</div>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              آژانس مسافرتی ریوان سفر با سال‌ها تجربه در ارائه‌ی تورهای داخلی و خارجی، 
              در کنار شماست تا سفری روان و به‌یادماندنی برایتان رقم بزنیم.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {QUICK_STATS.map((stat, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-stone-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center text-white hover:scale-105 hover:shadow-glow transition-all`}
                >
                  {typeof social.icon === 'string' ? (
                    <span className="text-xl">{social.icon}</span>
                  ) : (
                    <social.icon className="w-6 h-6" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <FooterColumn
            title="آژانس"
            links={FOOTER_LINKS.agency}
            icon={<ShieldCheck className="w-5 h-5 text-primary-500" />}
          />
          
          <FooterColumn
            title="تورها"
            links={FOOTER_LINKS.tours}
            icon={<Globe className="w-5 h-5 text-accent-500" />}
          />
          
          <FooterColumn
            title="پشتیبانی"
            links={FOOTER_LINKS.support}
            icon={<Clock className="w-5 h-5 text-secondary-500" />}
          />
        </div>

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-stone-700 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactInfo
            icon={Phone}
            title="تماس تلفنی"
            value={phoneDisplay}
            href={`tel:${phoneNumber}`}
            description="شنبه تا پنج‌شنبه ۹ تا ۲۱"
          />
          
          <ContactInfo
            icon={Mail}
            title="ایمیل"
            value={email}
            href={`mailto:${email}`}
            description="پاسخگویی در کمتر از ۲۴ ساعت"
          />
          
          <ContactInfo
            icon={MapPin}
            title="آدرس"
            value="تهران، خیابان انقلاب، پلاک ۱۲۳"
            description="دفتر مرکزی ریوان سفر"
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-stone-700">
          <h3 className="text-lg font-bold text-white mb-6 text-center">
            چرا به ما اعتماد کنید؟
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_INDICATORS.map((indicator, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <indicator.icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                <h4 className="font-semibold text-white mb-1">{indicator.title}</h4>
                <p className="text-xs text-stone-400">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-stone-800 py-6">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <div className="text-center sm:text-right">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. تمام حقوق محفوظ است.
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">
                حریم خصوصی
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                قوانین و مقررات
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                نقشه سایت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Footer Column Component
interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
  icon?: React.ReactNode;
}

function FooterColumn({ title, links, icon }: FooterColumnProps) {
  return (
    <div className="lg:col-span-1">
      <h3 className="flex items-center gap-2 font-bold text-white mb-4">
        {icon}
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-sm text-stone-300 hover:text-secondary hover:translate-x-1 transition-all duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Contact Info Component
interface ContactInfoProps {
  icon: React.ElementType;
  title: string;
  value: string;
  href?: string;
  description?: string;
}

function ContactInfo({ icon: Icon, title, value, href, description }: ContactInfoProps) {
  const content = (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-stone-400 mb-1">{title}</div>
        <div className="font-semibold text-white truncate" dir="ltr">
          {value}
        </div>
        {description && (
          <div className="text-xs text-stone-500 mt-1">{description}</div>
        )}
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block group">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}
