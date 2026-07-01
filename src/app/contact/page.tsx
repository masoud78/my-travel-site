import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CallbackForm } from "@/components/common/callback-form";
import { SITE_CONFIG } from "@/lib/site-config";
import { Phone, Mail, MapPin, Clock, Send, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `راه‌های ارتباطی ${SITE_CONFIG.name} — تماس تلفنی، ایمیل، شبکه‌های اجتماعی و فرم درخواست مشاوره.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "تماس با ما" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">تماس با ما</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              هر سؤالی درباره‌ی تورها، رزرو، قیمت یا خدمات دارید با ما در میان بگذارید. کارشناسان ما در سریع‌ترین زمان پاسخگو هستند.
            </p>
          </div>
        </Section>

        <Section>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SectionHeading title="راه‌های ارتباطی" />
              <div className="grid sm:grid-cols-2 gap-4">
                <ContactCard
                  icon={Phone}
                  title="تماس تلفنی"
                  value={SITE_CONFIG.defaultPhoneDisplay}
                  href={`tel:${SITE_CONFIG.defaultPhone}`}
                />
                <ContactCard
                  icon={Mail}
                  title="ایمیل"
                  value={SITE_CONFIG.email}
                  href={`mailto:${SITE_CONFIG.email}`}
                />
                <ContactCard
                  icon={Clock}
                  title="ساعات کاری"
                  value={SITE_CONFIG.workingHours}
                />
                <ContactCard
                  icon={MapPin}
                  title="آدرس"
                  value="تهران، خیابان انقلاب"
                />
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-bold text-lg text-stone-900 mb-4">ما را در شبکه‌های اجتماعی دنبال کنید</h3>
                <div className="flex flex-wrap gap-3">
                  <SocialButton href={SITE_CONFIG.socials.instagram} icon={Instagram} label="اینستاگرام" />
                  <SocialButton href={SITE_CONFIG.socials.telegram} icon={Send} label="تلگرام" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CallbackForm subject="درخواست تماس از صفحه تماس با ما" />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof Phone;
  title: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-stone-200 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-sm text-stone-500 mb-1">{title}</div>
        <div className="font-semibold text-stone-900" dir={title === "ایمیل" || title === "تماس تلفنی" ? "ltr" : "rtl"}>
          {value}
        </div>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {body}
    </a>
  ) : (
    body
  );
}

function SocialButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Instagram;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-primary-50 hover:text-primary transition-colors text-sm font-medium"
    >
      <Icon className="w-4 h-4" />
      {label}
    </a>
  );
}
