import { Metadata } from "next";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { prisma } from "@/lib/prisma";
import { ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "گالری سفرها",
  description: "تصاویر و لحظات به‌یادماندنی از تورهای داخلی و خارجی ریوان سفر.",
};

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
    take: 48,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "گالری سفرها" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">گالری سفرها</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              لحظات خاص مسافران ما از مقاصد داخلی و بین‌المللی. هر عکس، داستانی از یک سفر روان و خاطره‌انگیز است.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="خاطرات مسافران" subtitle="گوشه‌ای از تجربه‌ی سفر با ریوان سفر" />
          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group aspect-square rounded-2xl overflow-hidden bg-stone-200 border border-stone-200 relative"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-label={item.title || "تصویر گالری"}
                  />
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 mb-2">گالری در حال تکمیل است.</p>
              <p className="text-sm text-stone-400">به‌زودی تصاویر جدیدی از سفرهایمان را با شما به اشتراک می‌گذاریم.</p>
            </div>
          )}
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
