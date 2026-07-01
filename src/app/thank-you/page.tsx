import { Metadata } from "next";
import Link from "next/link";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "با تشکر از شما",
  description: "درخواست شما با موفقیت ثبت شد. کارشناسان ما به‌زودی با شما تماس می‌گیرند.",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "با تشکر" }]} className="mb-4" />
        </Section>

        <Section className="pt-0">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">با تشکر از شما</h1>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              درخواست شما با موفقیت ثبت شد. کارشناسان ما در کوتاه‌ترین زمان ممکن با شما تماس خواهند گرفت.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="cta">
                <Link href="/tours">
                  <ArrowLeft className="w-5 h-5" />
                  مشاهده تورها
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
                  <Phone className="w-5 h-5" />
                  تماس فوری
                </a>
              </Button>
            </div>

            <div className="mt-12 p-6 bg-white rounded-2xl border border-stone-200 text-right">
              <SectionHeading title="گام‌های بعدی" className="mb-4" />
              <ul className="space-y-3 text-stone-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-50 text-primary flex items-center justify-center text-sm font-bold shrink-0">۱</span>
                  کارشناس ما ظرف چند دقیقه با شما تماس می‌گیرد.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-50 text-primary flex items-center justify-center text-sm font-bold shrink-0">۲</span>
                  گزینه‌های مناسب با بودجه و سلیقه‌ی شما پیشنهاد می‌شود.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-50 text-primary flex items-center justify-center text-sm font-bold shrink-0">۳</span>
                  پس از تأیید، رزرو شما قطعی و تاییدیه ارسال می‌شود.
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
