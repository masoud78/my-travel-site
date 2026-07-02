import { Metadata } from "next";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading, ModernSection } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CallbackForm } from "@/components/common/callback-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  MessageCircle,
  Home,
  Building2,
  Navigation2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `راه‌های ارتباطی ${SITE_CONFIG.name} — تماس تلفنی، ایمیل، شبکه‌های اجتماعی و فرم درخواست مشاوره.`,
};

// Contact Methods
const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "تماس تلفنی",
    value: SITE_CONFIG.defaultPhoneDisplay,
    href: `tel:${SITE_CONFIG.defaultPhone}`,
    description: "شنبه تا پنج‌شنبه ۹ تا ۲۱ — جمعه ۱۰ تا ۱۸",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Mail,
    title: "ایمیل",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    description: "پاسخگویی در کمتر از ۲۴ ساعت",
    color: "bg-primary-50",
    iconColor: "text-primary-600",
  },
  {
    icon: Clock,
    title: "ساعات کاری",
    value: SITE_CONFIG.workingHours,
    description: "در ایام تعطیل نیز پاسخگوی شما هستیم",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: MapPin,
    title: "آدرس",
    value: "تهران، خیابان انقلاب، پلاک ۱۲۳",
    description: "دفتر مرکزی ریوان سفر",
    color: "bg-secondary-50",
    iconColor: "text-secondary-600",
  },
];

// Social Media Links
const SOCIAL_LINKS = [
  { name: "Instagram", href: SITE_CONFIG.socials.instagram, icon: Instagram, color: "bg-gradient-to-r from-pink-500 to-purple-600" },
  { name: "Telegram", href: SITE_CONFIG.socials.telegram, icon: Send, color: "bg-blue-500" },
  { name: "WhatsApp", href: SITE_CONFIG.socials.whatsapp, icon: MessageCircle, color: "bg-emerald-500" },
];

// Branch Offices
const BRANCHES = [
  {
    name: "دفتر مرکزی",
    address: "تهران، خیابان انقلاب، پلاک ۱۲۳",
    phone: "۰۲۱-۹۱۰۱۲۳۴۵",
    hours: "شنبه تا پنج‌شنبه ۹ تا ۲۱",
  },
  {
    name: "شعبه شمال",
    address: "رشت، خیابان طالقانی، پلاک ۴۵",
    phone: "۰۱۳-۳۲۳۴۵۶۷۸",
    hours: "شنبه تا پنج‌شنبه ۹ تا ۱۸",
  },
  {
    name: "شعبه غرب",
    address: "کرمانشاه، خیابان مدرس، پلاک ۷۸",
    phone: "۰۸۳-۳۴۵۶۷۸۹۰",
    hours: "شنبه تا پنج‌شنبه ۹ تا ۱۷",
  },
];

// FAQ Items
const FAQ_ITEMS = [
  {
    question: "چگونه می‌توانم تور رزرو کنم؟",
    answer: "شما می‌توانید از طریق وب‌سایت تور مورد نظر خود را انتخاب کرده و با تماس تلفنی یا از طریق واتساپ رزرو خود را نهایی کنید.",
  },
  {
    question: "آیا امکان کنسل کردن تور وجود دارد؟",
    answer: "بله، شما می‌توانید تا ۴۸ ساعت قبل از حرکت تور، رزرو خود را کنسل کنید. شرایط کنسل شدن در صفحه قوانین و مقررات توضیح داده شده است.",
  },
  {
    question: "چه روش‌های پرداختی پذیرفته می‌شود؟",
    answer: "ما تمام کارت‌های بانکی عضو شتاب را می‌پذیریم. همچنین امکان پرداخت اقساطی و در محل نیز وجود دارد.",
  },
  {
    question: "آیا ویزا را شما تهیه می‌کنید؟",
    answer: "بله، تیم ما تمام مراحل اخذ ویزا را برای تورهای خارجی انجام می‌دهد. شما فقط نیاز به ارائه مدارک مورد نیاز دارید.",
  },
  {
    question: "پشتیبانی در حین سفر چگونه است؟",
    answer: "تیم پشتیبانی ما ۲۴ ساعته و در تمام ایام هفته آماده پاسخگویی به شما هستند. شما می‌توانید از طریق تلفن یا واتساپ با ما در تماس باشید.",
  },
];

// Contact Card Component
function ContactCard({ icon: Icon, title, value, href, description, color, iconColor }: 
  { icon: React.ElementType; title: string; value: string; href?: string; description: string; color: string; iconColor: string }) {
  const content = (
    <Card variant="bordered" className={`p-4 hover:shadow-lg transition-shadow ${color}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <div className="text-sm text-stone-500 mb-1">{title}</div>
          <div className="font-semibold text-stone-900 truncate" dir="ltr">
            {value}
          </div>
          <div className="text-xs text-stone-500 mt-1">{description}</div>
        </div>
      </div>
    </Card>
  );

  return href ? (
    <a href={href} className="block group">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

// Branch Card Component
function BranchCard({ branch }: { branch: (typeof BRANCHES)[0] }) {
  return (
    <Card variant="bordered" className="p-6 hover:shadow-lg transition-shadow">
      <h3 className="font-bold text-lg text-stone-900 mb-2">{branch.name}</h3>
      <div className="space-y-2 text-sm text-stone-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span>{branch.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-stone-400" />
          <span dir="ltr">{branch.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-400" />
          <span>{branch.hours}</span>
        </div>
      </div>
    </Card>
  );
}

// FAQ Item Component
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  return (
    <Card variant="bordered" className="p-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0">
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-stone-900 mb-1">{question}</h4>
          <p className="text-sm text-stone-600">{answer}</p>
        </div>
      </div>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "تماس با ما" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
              تماس با ما
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              هر سؤالی درباره‌ی تورها، رزرو، قیمت یا خدمات دارید با ما در میان بگذارید. کارشناسان ما در سریع‌ترین زمان پاسخگو هستند.
            </p>
          </div>
        </Section>

        {/* Contact Methods */}
        <ModernSection pattern="dots" decorative>
          <SectionHeading title="راه‌های ارتباطی" subtitle="چگونه می‌توانید با ما تماس بگیرید" />
          <div className="grid sm:grid-cols-2 gap-4">
            {CONTACT_METHODS.map((method, index) => (
              <ContactCard key={index} {...method} />
            ))}
          </div>
        </ModernSection>

        {/* Contact Form Section */}
        <Section className="bg-stone-50">
          <SectionHeading title="فرم تماس" subtitle="پیام خود را برای ما ارسال کنید" />
          <div className="max-w-2xl mx-auto">
            <CallbackForm compact={false} className="shadow-xl" />
          </div>
        </Section>

        {/* Social Media */}
        <Section>
          <SectionHeading title="ما را در شبکه‌های اجتماعی دنبال کنید" align="center" />
          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={`w-14 h-14 rounded-xl ${social.color} flex items-center justify-center text-white hover:scale-105 hover:shadow-glow transition-all`}
              >
                <social.icon className="w-7 h-7" />
              </a>
            ))}
          </div>
        </Section>

        {/* Branches Section */}
        <ModernSection pattern="lines" decorative>
          <SectionHeading title="شعب و نمایندگی‌ها" subtitle="دفتر مرکزی و شعب استانی" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BRANCHES.map((branch, index) => (
              <BranchCard key={index} branch={branch} />
            ))}
          </div>
        </ModernSection>

        {/* Map Section */}
        <Section className="bg-stone-50">
          <SectionHeading title="موقعیت مکانی" subtitle="دفتر مرکزی ریوان سفر" />
          <Card variant="bordered" className="p-0 overflow-hidden">
            <div className="aspect-[16/9] bg-stone-100 flex items-center justify-center">
              <div className="text-center p-8">
                <Building2 className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                <p className="text-stone-500">نقشه گوگل مپ در اینجا نمایش داده می‌شود</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    مشاهده در گوگل مپ
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </Section>

        {/* FAQ Section */}
        <Section>
          <SectionHeading title="سؤالات متداول" subtitle="پاسخ به پرسش‌های رایج" />
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQ_ITEMS.map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section className="bg-gradient-to-br from-secondary-50 via-white to-accent-50">
          <Card variant="gradient" className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
              آماده پاسخگویی هستیم
            </h2>
            <p className="text-lg text-stone-600 mb-6 max-w-2xl mx-auto">
              تیم مشاوران ما آماده‌اند تا به تمام سؤالات شما پاسخ دهند. کافیست با ما تماس بگیرید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="lg">
                <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
                  <Phone className="w-5 h-5" />
                  تماس تلفنی
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={SITE_CONFIG.socials.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  واتساپ
                </a>
              </Button>
            </div>
          </Card>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
