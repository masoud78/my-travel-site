import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { TourFiltersClient } from "@/components/tour/tour-filters-client";
import { prisma } from "@/lib/prisma";
import { safeParse } from "@/lib/utils";
import { formatJalaliDate } from "@/lib/jalali";

export interface CategoryInfo {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
}

export const categories: CategoryInfo[] = [
  { slug: "domestic", category: "INTERNAL", title: "تورهای داخلی", subtitle: "بهترین تورهای داخل ایران" },
  { slug: "turkey", category: "TURKEY", title: "تورهای ترکیه", subtitle: "تورهای استانبول، آنتالیا و سایر شهرهای ترکیه" },
  { slug: "asia", category: "ASIA", title: "تورهای آسیایی", subtitle: "دبی، تایلند، مالزی و سایر مقاصد آسیا" },
  { slug: "europe", category: "EUROPE", title: "تورهای اروپا", subtitle: "تورهای کشورهای اروپایی با پرواز مستقیم" },
  { slug: "special", category: "SPECIAL", title: "تورهای ویژه", subtitle: "پیشنهادهای ویژه و تورهای لحظه آخری" },
];

const categoryHeroImages: Record<string, string> = {
  domestic: "/images/destinations/shiraz.jpg",
  turkey: "/images/destinations/istanbul.jpg",
  asia: "/images/destinations/dubai.jpg",
  europe: "/images/destinations/paris.jpg",
  special: "/images/destinations/antalya.jpg",
};

export interface CategoryToursPageProps {
  slug: string;
}

export async function CategoryToursPage({ slug }: CategoryToursPageProps) {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return notFound();

  const [tours, destinations, transports] = await Promise.all([
    prisma.tour.findMany({
      where: { status: "PUBLISHED", category: cat.category },
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
        {/* Hero */}
        <section className="relative h-56 md:h-72 overflow-hidden">
          <Image
            src={categoryHeroImages[cat.slug] || "/images/hero/hero-tours.jpg"}
            alt={cat.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{cat.title}</h1>
              <p className="text-lg text-stone-100">{cat.subtitle}</p>
            </div>
          </div>
        </section>

        <Section className="bg-stone-50">
          <Breadcrumb
            items={[
              { label: "تورها", href: "/tours" },
              { label: cat.title },
            ]}
            className="mb-4"
          />
          <TourFiltersClient
            tours={mappedTours}
            destinations={destinations}
            transports={transports}
            category={cat.category}
            title={cat.title}
            subtitle=""
            basePath={`/tours/${cat.slug}`}
          />
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
