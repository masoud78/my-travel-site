import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SearchPageClient } from "@/components/search/search-page-client";
import { CustomTourForm } from "@/components/search/custom-tour-form";
import { Section } from "@/components/common/section";
import { prisma } from "@/lib/prisma";
import { safeParse } from "@/lib/utils";
import { formatJalaliDate } from "@/lib/jalali";

export const metadata: Metadata = {
  title: "جستجوی پیشرفته تور",
  description:
    "جستجوی پیشرفته تورهای ریوان سفر با فیلتر مقصد، قیمت، نوع حمل‌ونقل و مدت اقامت.",
};

export default async function SearchPage() {
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
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "جستجو" }]} className="mb-4" />
          <SearchPageClient
            initialTours={mappedTours}
            destinations={destinations}
            transports={transports}
          />
        </Section>

        <Section className="bg-accent-50">
          <div className="max-w-3xl mx-auto">
            <CustomTourForm />
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
