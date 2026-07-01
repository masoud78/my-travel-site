import { Metadata } from "next";
import Image from "next/image";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SITE_CONFIG } from "@/lib/site-config";
import { Award, Users, Globe, Headphones, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `آشنایی با آژانس مسافرتی ${SITE_CONFIG.name}، تاریخچه، چشم‌انداز و تعهد ما به مسافران.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "درباره ما" }]} className="mb-4" />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
                آژانس مسافرتی {SITE_CONFIG.name}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                با بیش از ۱۵ سال تجربه در صنعت گردشگری، {SITE_CONFIG.name} همراه شماست تا سفری بی‌دغدغه،
                ایمن و به‌یادماندنی را تجربه کنید. از تورهای داخلی تا مقاصد بین‌المللی، ما همواره بهترین را ارائه می‌دهیم.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about/about-office.jpg"
                alt="دفتر ریوان سفر"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Section>

        <Section>
          <SectionHeading title="مأموریت و چشم‌انداز" subtitle="هدف ما، سفر کردن آسان و مطمئن برای همه است" />
          <div className="grid md:grid-cols-2 gap-6">
            <ValueCard
              icon={Heart}
              title="مسافر در مرکز توجه"
              text="تمام تصمیمات ما بر اساس نیاز، بودجه و سلیقه‌ی شما گرفته می‌شود. رضایت مسافران بزرگ‌ترین سرمایه‌ی ماست."
            />
            <ValueCard
              icon={Shield}
              title="اعتبار و اطمینان"
              text="با مجوز رسمی از سازمان میراث فرهنگی و گردشگری و نماد اعتماد الکترونیک، خیالتان از بابت خرید تور راحت است."
            />
            <ValueCard
              icon={Globe}
              title="مقاصد متنوع"
              text="ترکیه، اروپا، آسیا و سراسر ایران؛ مجموعه‌ای گسترده از تورهای داخلی و خارجی را یکجا ببینید."
            />
            <ValueCard
              icon={Headphones}
              title="پشتیبانی شبانه‌روزی"
              text="تیم مشاوران ما در تمام مراحل سفر — از انتخاب تور تا بازگشت — کنارتان خواهند بود."
            />
          </div>
        </Section>

        <Section className="bg-primary text-white">
          <SectionHeading title="دلایل انتخاب ما" subtitle="چرا مسافران به ما اعتماد می‌کنند" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, value: "۱۵+", label: "سال تجربه" },
              { icon: Users, value: "۲۰,۰۰۰+", label: "مسافر راضی" },
              { icon: Globe, value: "۱۵۰+", label: "مقصد گردشگری" },
              { icon: Heart, value: "۹۸٪", label: "رضایت مشتری" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <s.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-primary-100">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-stone-50">
          <SectionHeading title="داستان ما" subtitle="از یک دفتر کوچک تا مجموعه‌ای مورد اعتماد" />
          <div className="max-w-4xl mx-auto space-y-6 text-stone-700 leading-loose">
            <p>
              {SITE_CONFIG.name} از سال ۱۳۸۹ کار خود را با یک تیم کوچک اما پرانرژی آغاز کرد. هدف ما از همان روز اول ساده بود:
              ارائه‌ی تجربه‌ی سفری روان و بدون استرس به هموطنان عزیز.
            </p>
            <p>
              امروز با افتخار به یکی از آژانس‌های شناخته‌شده در حوزه‌ی تورهای داخلی و خارجی تبدیل شدیم. تیم ما شامل کارشناسان مجرب
              بخش‌های مختلف از جمله رزرواسیون، ویزا، ترانسفر و پشتیبانی است که هر کدام با تخصص خود، قطعه‌ای از پازل سفر شما را کامل می‌کنند.
            </p>
            <p>
              ما معتقدیم سفر فقط جابجایی نیست؛ سفر یعنی تجربه‌ی زندگی، یعنی خاطره‌سازی و یعنی کشف دوباره‌ی خودمان. این باور را در
              تمام خدماتمان جاری کرده‌ایم.
            </p>
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}

function ValueCard({ icon: Icon, title, text }: { icon: typeof Heart; title: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-lg text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
    </div>
  );
}
