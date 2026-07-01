import { Metadata } from "next";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { prisma } from "@/lib/prisma";
import { Star, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "نظرات مشتریان",
  description: "مشاهده‌ی نظرات و تجربیات واقعی مسافران ریوان سفر از تورهای داخلی و خارجی.",
};

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const avgRating =
    reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "نظرات مشتریان" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">نظرات مشتریان</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              نظرات صادقانه‌ی مسافران ما را بخوانید و با خیال راحت سفر بعدی‌تان را انتخاب کنید.
            </p>
            {avgRating && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-stone-900 text-lg">{avgRating}</span>
                </div>
                <span className="text-sm text-stone-500">میانگین امتیاز از {reviews.length} نظر</span>
              </div>
            )}
          </div>
        </Section>

        <Section>
          <SectionHeading title="تجربه‌ی مسافران" subtitle="نظرات تاییدشده‌ی مشتریان عزیز" />
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? "fill-current" : "text-stone-200"}`}
                      />
                    ))}
                  </div>
                  {r.title && <h3 className="font-bold text-stone-900 mb-2">{r.title}</h3>}
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">{r.content}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold">
                      {r.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-stone-900">{r.authorName}</div>
                      {r.tourTitle && <div className="text-xs text-stone-500">{r.tourTitle}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">هنوز نظری ثبت نشده است.</p>
            </div>
          )}
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
