import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { SearchX, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "صفحه مورد نظر یافت نشد",
  description: "متأسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد.",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-xl mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto mb-6">
              <SearchX className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">۴۰۴</h1>
            <h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-4">صفحه مورد نظر یافت نشد</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              متأسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد یا منتقل شده است. می‌توانید به صفحه اصلی بازگردید یا تورهای ما را
              جستجو کنید.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="cta">
                <Link href="/">
                  <Home className="w-5 h-5" />
                  صفحه اصلی
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tours">
                  <ArrowLeft className="w-5 h-5" />
                  مشاهده تورها
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
