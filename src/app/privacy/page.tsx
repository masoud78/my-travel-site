import { Metadata } from "next";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SITE_CONFIG } from "@/lib/site-config";
import { Shield, Lock, Eye, Trash2, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "حریم خصوصی",
  description: `سیاست حفظ حریم خصوصی کاربران و مسافران ${SITE_CONFIG.name}.`,
};

export default function PrivacyPage() {
  const items = [
    {
      icon: UserCheck,
      title: "اطلاعات جمع‌آوری‌شده",
      text: "ما تنها اطلاعات لازم برای رزرو و ارائه‌ی خدمات را جمع‌آوری می‌کنیم: نام، نام خانوادگی، شماره تماس، ایمیل، اطلاعات گذرنامه و جزئیات پرداخت.",
    },
    {
      icon: Lock,
      title: "حفاظت از اطلاعات",
      text: "اطلاعات شما با استفاده از پروتکل‌های امنیتی استاندارد و رمزنگاری‌شده ذخیره و منتقل می‌شود. دسترسی به آن تنها برای کارشناسان مجاز امکان‌پذیر است.",
    },
    {
      icon: Eye,
      title: "نحوه‌ی استفاده",
      text: "اطلاعات شما صرفاً برای رزرو تور، ارتباط با شما، ارسال تاییدیه و ارائه‌ی پشتیبانی استفاده می‌شود و در اختیار اشخاص ثالث قرار نمی‌گیرد.",
    },
    {
      icon: Trash2,
      title: "حق حذف اطلاعات",
      text: "شما می‌توانید در هر زمان درخواست حذف یا اصلاح اطلاعات شخصی خود را از طریق تماس با ما ارسال کنید.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "حریم خصوصی" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">حریم خصوصی</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              در {SITE_CONFIG.name} حریم خصوصی کاربران برای ما اهمیت ویژه‌ای دارد. این صفحه نحوه‌ی جمع‌آوری، استفاده و حفاظت از
              اطلاعات شما را توضیح می‌دهد.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="اصلاحات حفاظت از داده" />
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-stone-50">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">تعهد ما</h2>
                <p className="text-stone-600 leading-loose">
                  {SITE_CONFIG.name} متعهد می‌شود اطلاعات شخصی کاربران را بدون رضایت صریح آن‌ها در اختیار هیچ سازمان یا شخص ثالثی
                  قرار ندهد، مگر در مواردی که قانون ایجاب کند یا برای ارائه‌ی خدمات ضروری باشد.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Eye className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">کوکی‌ها و تحلیل‌ها</h2>
                <p className="text-stone-600 leading-loose">
                  ما از کوکی‌ها و ابزارهای تحلیلی برای بهبود عملکرد وب‌سایت و تجربه‌ی کاربری استفاده می‌کنیم. این اطلاعات ناشناس
                  بوده و هویت شما را افشا نمی‌کند.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">تغییرات سیاست حریم خصوصی</h2>
                <p className="text-stone-600 leading-loose">
                  این سیاست ممکن است به‌روزرسانی شود. هرگونه تغییر مهم در این صفحه اطلاع‌رسانی خواهد شد و تاریخ آخرین به‌روزرسانی
                  در پایین صفحه ذکر می‌شود.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section className="text-center">
          <p className="text-sm text-stone-500">
            آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
          </p>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
