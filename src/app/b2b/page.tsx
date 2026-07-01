import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CallbackForm } from "@/components/common/callback-form";
import { SITE_CONFIG } from "@/lib/site-config";
import { Handshake, Building2, TrendingUp, Headphones, BadgeCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "همکاری B2B",
  description: `درخواست همکاری سازمانی و آژانسی با ${SITE_CONFIG.name} — تور گروهی، قرارداد سازمانی و خدمات ویژه.`,
};

export default function B2bPage() {
  const benefits = [
    {
      icon: Building2,
      title: "مشتریان سازمانی",
      text: "برای شرکت‌ها، سازمان‌ها و ارگان‌های دولتی پکیج‌های سفری متناسب با بودجه و نیاز طراحی می‌کنیم.",
    },
    {
      icon: Handshake,
      title: "شریک آژانسی",
      text: "آژانس‌های همکار می‌توانند از قیمت‌های رقابتی، پشتیبانی اختصاصی و تسویه‌ی منعطف بهره‌مند شوند.",
    },
    {
      icon: TrendingUp,
      title: "کمیسیون منصفانه",
      text: "ساختار کمیسیون شفاف و به‌موقع برای همکاران تجاری در سراسر کشور.",
    },
    {
      icon: Headphones,
      title: "پشتیبانی اختصاصی",
      text: "یک کارشناس اختصاصی برای پیگیری درخواست‌ها، استعلام و رزروهای گروهی در اختیار شما خواهد بود.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "همکاری B2B" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">همکاری B2B</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              {SITE_CONFIG.name} آماده‌ی همکاری با آژانس‌های مسافرتی، شرکت‌ها و سازمان‌ها است. فرم زیر را پر کنید تا کارشناسان
              ما در اسرع وقت با شما تماس بگیرند.
            </p>
          </div>
        </Section>

        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <SectionHeading title="مزایای همکاری با ما" />
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((b, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3">
                      <b.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-stone-900 mb-1">{b.title}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{b.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BadgeCheck className="w-6 h-6 text-accent" />
                  <h3 className="font-bold text-lg text-stone-900">چرا ریوان سفر؟</h3>
                </div>
                <ul className="space-y-2 text-sm text-stone-600 leading-relaxed">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" /> بیش از ۱۵ سال تجربه در صنعت گردشگری</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" /> شبکه‌ی گسترده‌ی هتل و ایرلاین</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" /> پشتیبانی ۲۴ ساعته در ایام سفر</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" /> قراردادهای شفاف و منعطف</li>
                </ul>
              </div>
            </div>

            <div>
              <CallbackForm subject="درخواست همکاری B2B" />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
