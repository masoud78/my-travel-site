import { Metadata } from "next";
import Image from "next/image";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { TourFiltersClient } from "@/components/tour/tour-filters-client";
import { prisma } from "@/lib/prisma";
import { safeParse } from "@/lib/utils";
import { formatJalaliDate } from "@/lib/jalali";

export const metadata: Metadata = {
  title: "تورهای مسافرتی",
  description:
    "مشاهده و مقایسه تمام تورهای داخلی و خارجی ریوان سفر. فیلتر بر اساس مقصد، ایرلاین، قیمت و مدت اقامت.",
};

export default async function ToursPage() {
  const [tours, destinations, transports] = await Promise.all([
    prisma.tour.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        destination: true,
        transport: true,
        tourDates: { orderBy: { departDate: "asc" }, take: 1 },
      },
    }),
    prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.transport.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, type: true },
    }),
  ]);

  const mappedTours = tours.map((tour) => {
    const images = safeParse<string[]>(tour.images, []);
    const firstDate = tour.tourDates[0];
    return {
      id: tour.id,
      slug: tour.slug,
      title: tour.title,
      destination: tour.destination?.name || "",
      destinationId: tour.destinationId || "",
      duration: tour.nights,
      transport: tour.transportType,
      transportId: tour.transportId || "",
      category: tour.category,
      airline: tour.transport?.name || null,
      price: tour.startPrice,
      image: tour.thumbnail || images[0] || undefined,
      startDate: firstDate ? formatJalaliDate(firstDate.departDate) : undefined,
      isLastMinute: tour.isLastMinute,
      isFeatured: tour.isFeatured,
      status: tour.status,
      createdAt: tour.createdAt.toISOString(),
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-52 sm:h-64 md:h-80 overflow-hidden">
          <Image
            src="/images/hero/hero-tours.jpg"
            alt="تورهای مسافرتی"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">تورهای مسافرتی</h1>
              <p className="text-base sm:text-lg text-stone-100">تورهای داخلی و خارجی با بهترین قیمت</p>
            </div>
          </div>
        </section>

        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "تورها" }]} className="mb-4" />
          <TourFiltersClient
            tours={mappedTours}
            destinations={destinations}
            transports={transports}
            title="همه تورها"
            subtitle=""
          />
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
