import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "قوانین و مقررات",
  description: `قوانین و مقررات استفاده از خدمات و وب‌سایت ${SITE_CONFIG.name}.`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "قوانین و مقررات" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">قوانین و مقررات</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              با استفاده از وب‌سایت و خدمات {SITE_CONFIG.name}، شما موافقت خود را با شرایط و مقررات زیر اعلام می‌کنید.
            </p>
          </div>
        </Section>

        <Section>
          <div className="max-w-4xl mx-auto space-y-8">
            <TermSection number={1} title="شرایط عمومی">
              تمام خدمات ارائه‌شده در این وب‌سایت توسط {SITE_CONFIG.name} با مجوز رسمی از مراجع ذی‌ربط ارائه می‌شود. مسافر موظف است
              اطلاعات صحیح و کامل را در هنگام رزرو وارد کند و هرگونه مغایرت در اطلاعات شخصی بر عهده‌ی خود مسافر است.
            </TermSection>
            <TermSection number={2} title="رزرو و پرداخت">
              رزرو تور پس از تأیید ظرفیت توسط کارشناسان و واریز بیعانه یا مبلغ کامل قطعی می‌شود. پرداخت‌ها از طریق درگاه‌های امن
              بانکی انجام می‌شود و رسید پرداخت باید نزد مسافر محفوظ بماند.
            </TermSection>
            <TermSection number={3} title="تغییرات برنامه‌ی سفر">
              در شرایط غیرمترقبه مانند تغییر آب‌وهوا، شرایط سیاسی یا تصمیمات دولتی، آژانس مجاز است تغییرات لازم در برنامه‌ی سفر
              ایجاد کند. در این موارد آژانس تلاش خود را برای ارائه‌ی بهترین جایگزین به کار می‌گیرد.
            </TermSection>
            <TermSection number={4} title="مسئولیت مسافر">
              مسافر مسئول ارائه‌ی مدارک معتبر از جمله گذرنامه، ویزا و بیمه‌ی مسافرتی است. عدم ارائه‌ی مدارک صحیح در زمان مقرر،
              مسئولیت هرگونه لغو یا تأخیر را بر عهده‌ی مسافر قرار می‌دهد.
            </TermSection>
            <TermSection number={5} title="کنسلی و استرداد">
              شرایط کنسلی و استرداد وجه طبق بخش «شرایط کنسلی» وب‌سایت محاسبه می‌شود. هزینه‌های غیرقابل استرداد مانند بلیت
              هواپیما یا هتل مطابق قوانین تأمین‌کنندگان از مبلغ کسر می‌شود.
            </TermSection>
            <TermSection number={6} title="حریم خصوصی">
              اطلاعات شخصی کاربران نزد {SITE_CONFIG.name} محفوظ است و تنها برای ارائه‌ی خدمات مورد استفاده قرار می‌گیرد. جزئیات
              بیشتر در صفحه‌ی «حریم خصوصی» آمده است.
            </TermSection>
            <TermSection number={7} title="مالکیت محتوا">
              تمام محتوای وب‌سایت از جمله متون، تصاویر، لوگو و طرح‌ها متعلق به {SITE_CONFIG.name} است و هرگونه کپی‌برداری بدون
              اجازه‌ی کتبی ممنوع است.
            </TermSection>
            <TermSection number={8} title="اختلافات">
              در صورت بروز هرگونه اختلاف، طرفین تلاش می‌کنند موضوع از طریق مذاکره حل و فصل شود. در صورت عدم توافق، مراجع قانونی
              صالح ایرانی مرجع رسیدگی خواهند بود.
            </TermSection>
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}

function TermSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center font-bold text-sm">
          {number}
        </div>
        <h2 className="font-bold text-lg text-stone-900">{title}</h2>
      </div>
      <p className="text-stone-600 leading-loose">{children}</p>
    </div>
  );
}
