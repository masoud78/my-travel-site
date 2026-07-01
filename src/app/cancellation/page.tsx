import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SITE_CONFIG } from "@/lib/site-config";
import { AlertTriangle, CalendarX, Receipt, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "شرایط کنسلی",
  description: "مقررات و شرایط کنسلی تورهای داخلی و خارجی آژانس مسافرتی ریوان سفر.",
};

export default function CancellationPage() {
  const rules = [
    {
      icon: CalendarX,
      title: "انصراف تا ۳۰ روز قبل از حرکت",
      text: "۹۰ درصد مبلغ پرداختی (منهای جریمه‌های غیرقابل استرداد مانند بلیت هواپیما) بازگردانده می‌شود.",
    },
    {
      icon: CalendarX,
      title: "انصراف ۱۵ تا ۳۰ روز قبل از حرکت",
      text: "۷۰ درصد مبلغ تور استرداد می‌شود. هزینه‌های غیرقابل کنسلی از سوی هتل و ایرلاین کسر خواهد شد.",
    },
    {
      icon: CalendarX,
      title: "انصراف ۷ تا ۱۵ روز قبل از حرکت",
      text: "۵۰ درصد مبلغ تور بازگردانده می‌شود. در این بازه، جریمه‌ی هتل و پرواز بیشتر خواهد بود.",
    },
    {
      icon: CalendarX,
      title: "انصراف کمتر از ۷ روز قبل از حرکت",
      text: "متأسفانه استرداد وجه امکان‌پذیر نیست، مگر در موارد خاص که با مدارک پزشکی یا قضائی قابل بررسی است.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "شرایط کنسلی" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">شرایط کنسلی</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              قبل از رزرو، لطفاً شرایط کنسلی و استرداد وجه تورهای ما را به‌دقت مطالعه کنید تا در صورت تغییر برنامه، با آگاهی کامل تصمیم بگیرید.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="زمان‌بندی استرداد وجه" />
          <div className="grid md:grid-cols-2 gap-6">
            {rules.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 mb-2">{r.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-amber-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">نکات مهم</h2>
                <ul className="space-y-2 text-stone-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    کنسلی باید به‌صورت کتبی یا از طریق تماس تلفنی با کارشناس مربوطه اعلام شود.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    مدت زمان استرداد وجه بسته به روش پرداخت بین ۳ تا ۱۰ روز کاری متغیر است.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    در شرایط فورس ماژور یا لغو تور از سمت آژانس، کل مبلغ بدون کسر بازگردانده می‌شود.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <Receipt className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-900 mb-3">نیاز به استعلام کنسلی دارید؟</h2>
            <p className="text-stone-600 mb-6">
              برای استعلام دقیق‌تر وضعیت کنسلی تور خود، لطفاً با کارشناسان ما تماس بگیرید.
            </p>
            <a
              href={`tel:${SITE_CONFIG.defaultPhone}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-bold hover:bg-secondary-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              تماس با {SITE_CONFIG.defaultPhoneDisplay}
            </a>
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
