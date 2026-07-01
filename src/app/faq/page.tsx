import { Metadata } from "next";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "سؤالات متداول",
  description: "پاسخ به پرسش‌های رایج درباره‌ی رزرو تور، پرداخت، کنسلی و خدمات ریوان سفر.",
};

export default async function FaqPage() {
  const faqs = await prisma.tourFaq.findMany({
    where: { isGlobal: true },
    orderBy: { order: "asc" },
    take: 30,
  });

  const defaultFaqs = [
    {
      id: "1",
      question: "چطور می‌توانم یک تور را رزرو کنم؟",
      answer:
        "پس از انتخاب تور مورد نظر، می‌توانید از طریق فرم درخواست مشاوره یا تماس تلفنی با کارشناسان ما اقدام کنید. پس از تأیید ظرفیت و پرداخت بیعانه، رزرو شما قطعی می‌شود.",
    },
    {
      id: "2",
      question: "آیا امکان پرداخت اقساطی وجود دارد؟",
      answer:
        "بله، برای بسیاری از تورهای داخلی و خارجی امکان پرداخت چندمرحله‌ای وجود دارد. جزئیات دقیق را می‌توانید از کارشناس مربوطه جویا شوید.",
    },
    {
      id: "3",
      question: "مدارک لازم برای سفر خارجی چیست؟",
      answer:
        "معمولاً گذرنامه معتبر با حداقل ۶ ماه اعتبار، عکس پاسپورتی و برای برخی مقاصد ویزا لازم است. مدارک هر تور به‌صورت دقیق در صفحه‌ی تور ذکر شده است.",
    },
    {
      id: "4",
      question: "شرایط کنسلی تور چگونه است؟",
      answer:
        "شرایط کنسلی بسته به زمان اعلام انصراف و نوع تور متفاوت است. لطفاً بخش شرایط کنسلی یا صفحه‌ی هر تور را مطالعه کنید.",
    },
    {
      id: "5",
      question: "آیا تورها شامل بیمه مسافرتی می‌شوند؟",
      answer:
        "بله، تمام تورهای خارجی ما شامل بیمه‌ی مسافرتی هستند. در تورهای داخلی نیز بیمه‌ی حوادث سفر ارائه می‌شود.",
    },
  ];

  const items = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "سؤالات متداول" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">سؤالات متداول</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              پاسخ پرسش‌های رایگ خود را اینجا پیدا کنید. در صورت نیاز، با کارشناسان ما تماس بگیرید.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="پرسش‌های رایج" />
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200 p-4 md:p-6">
            <Accordion type="single" collapsible className="w-full">
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
