import { Metadata } from "next";
import Image from "next/image";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading, ModernSection } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { TourCard, TourCardSkeleton } from "@/components/tour/tour-card";
import { TourFiltersClient } from "@/components/tour/tour-filters-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { safeParse } from "@/lib/utils";
import { formatJalaliDate } from "@/lib/jalali";
import { Search, Plane, Globe, Building2, Star, Clock, MapPin } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "تورهای مسافرتی",
  description:
    "مشاهده و مقایسه تمام تورهای داخلی و خارجی ریوان سفر. فیلتر بر اساس مقصد، ایرلاین، قیمت و مدت اقامت.",
};

// Category Cards
const CATEGORY_CARDS = [
  {
    title: "تور داخلی",
    description: "تورهای داخلی ایران",
    image: "/images/destinations/iran.jpg",
    href: "/tours/domestic",
    color: "from-emerald-500 to-emerald-600",
    icon: Building2,
  },
  {
    title: "تور ترکیه",
    description: "پرفروش‌ترین تورهای خارجی",
    image: "/images/destinations/turkey.jpg",
    href: "/tours/turkey",
    color: "from-amber-500 to-amber-600",
    icon: Star,
  },
  {
    title: "تور اروپا",
    description: "تورهای اروپایی",
    image: "/images/destinations/europe.jpg",
    href: "/tours/europe",
    color: "from-blue-500 to-blue-600",
    icon: Globe,
  },
  {
    title: "تور آسیایی",
    description: "تورهای آسیا",
    image: "/images/destinations/asia.jpg",
    href: "/tours/asia",
    color: "from-purple-500 to-purple-600",
    icon: Plane,
  },
];

// Popular Destinations
const POPULAR_DESTINATIONS = [
  { name: "آنتالیا", count: "۱۲۰ تور", image: "/images/destinations/antalya.jpg" },
  { name: "استانبول", count: "۸۵ تور", image: "/images/destinations/istanbul.jpg" },
  { name: "دبی", count: "۶۰ تور", image: "/images/destinations/dubai.jpg" },
  { name: "تایلند", count: "۴۵ تور", image: "/images/destinations/thailand.jpg" },
  { name: "مالزی", count: "۳۵ تور", image: "/images/destinations/malaysia.jpg" },
  { name: "شمال ایران", count: "۱۵۰ تور", image: "/images/destinations/north-iran.jpg" },
];

// Category Card Component
function CategoryCard({ card }: { card: (typeof CATEGORY_CARDS)[0] }) {
  return (
    <Card
      variant="bordered"
      className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge
          variant="gradient"
          size="lg"
          className="absolute top-4 left-4 shadow-md"
        >
          <card.icon className="w-4 h-4" />
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-stone-900 mb-1">{card.title}</h3>
        <p className="text-sm text-stone-600">{card.description}</p>
      </div>
    </Card>
  );
}

// Destination Card Component
function DestinationCard({ destination }: { destination: (typeof POPULAR_DESTINATIONS)[0] }) {
  return (
    <Card
      variant="bordered"
      className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-white text-lg">{destination.name}</h3>
          <p className="text-white/80 text-sm">{destination.count}</p>
        </div>
      </div>
    </Card>
  );
}

// Featured Tours Section
async function FeaturedToursSection() {
  const tours = await prisma.tour.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { destination: true },
  });

  if (!tours.length) return null;

  const mappedTours = tours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destination: tour.destination?.name || tour.category,
    duration: tour.nights,
    transport: tour.transportType,
    price: tour.startPrice,
    oldPrice: tour.oldPrice || undefined,
    image: tour.thumbnail || undefined,
    hotelStars: 4,
    isFeatured: tour.isFeatured,
    isLastMinute: tour.isLastMinute,
    discount: tour.discount,
    rating: 4.8,
    reviewCount: 125,
  }));

  return (
    <Section>
      <SectionHeading
        title="تورهای ویژه"
        subtitle="پرفروش‌ترین تورهای این هفته"
        action={
          <Button asChild variant="outline" size="sm">
            <a href="#all-tours">
              مشاهده همه
            </a>
          </Button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {mappedTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </Section>
  );
}

// Last Minute Tours Section
async function LastMinuteToursSection() {
  const tours = await prisma.tour.findMany({
    where: { status: "PUBLISHED", isLastMinute: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { destination: true },
  });

  if (!tours.length) return null;

  const mappedTours = tours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destination: tour.destination?.name || tour.category,
    duration: tour.nights,
    transport: tour.transportType,
    price: tour.startPrice,
    oldPrice: tour.oldPrice || undefined,
    image: tour.thumbnail || undefined,
    hotelStars: 4,
    isFeatured: tour.isFeatured,
    isLastMinute: tour.isLastMinute,
    discount: tour.discount,
    rating: 4.8,
    reviewCount: 125,
  }));

  return (
    <Section className="bg-stone-50">
      <SectionHeading
        title="آخرین فرصت‌ها"
        subtitle="تورهای با تخفیف ویژه"
        action={
          <Button asChild variant="outline" size="sm">
            <a href="/tours/special">
              مشاهده همه
            </a>
          </Button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {mappedTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </Section>
  );
}

// Main Tours Page
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
      oldPrice: tour.oldPrice || undefined,
      image: tour.thumbnail || images[0] || undefined,
      startDate: firstDate ? formatJalaliDate(firstDate.departDate) : undefined,
      isLastMinute: tour.isLastMinute,
      isFeatured: tour.isFeatured,
      status: tour.status,
      createdAt: tour.createdAt.toISOString(),
      discount: tour.discount,
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 200) + 50,
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                تورهای مسافرتی
              </h1>
              <p className="text-base sm:text-lg text-stone-100">
                تورهای داخلی و خارجی با بهترین قیمت
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <ModernSection pattern="dots" decorative>
          <SectionHeading title="دسته‌بندی تورها" subtitle="تورهای خود را بر اساس مقصد انتخاب کنید" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_CARDS.map((card, index) => (
              <a key={index} href={card.href}>
                <CategoryCard card={card} />
              </a>
            ))}
          </div>
        </ModernSection>

        {/* Popular Destinations */}
        <Section className="bg-stone-50">
          <SectionHeading title="مقصدهای پرطرفدار" subtitle="محبوب‌ترین مقصدهای مسافران" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((destination, index) => (
              <DestinationCard key={index} destination={destination} />
            ))}
          </div>
        </Section>

        {/* Featured Tours */}
        <Suspense fallback={null}>
          <FeaturedToursSection />
        </Suspense>

        {/* Last Minute Tours */}
        <Suspense fallback={null}>
          <LastMinuteToursSection />
        </Suspense>

        {/* All Tours with Filters */}
        <Section id="all-tours" className="bg-stone-50">
          <Breadcrumb items={[{ label: "همه تورها" }]} className="mb-4" />
          <TourFiltersClient
            tours={mappedTours}
            destinations={destinations}
            transports={transports}
            title="همه تورها"
            subtitle="تورهای داخلی و خارجی ریوان سفر"
          />
        </Section>

        {/* CTA Section */}
        <Section className="bg-gradient-to-br from-secondary-50 via-white to-accent-50">
          <Card variant="gradient" className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
              تور مورد نظر خود را پیدا نکردید؟
            </h2>
            <p className="text-lg text-stone-600 mb-6 max-w-2xl mx-auto">
              تیم مشاوران ما آماده‌اند تا تور سفارشی شما را طراحی کنند. کافیست با ما تماس بگیرید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="lg">
                <a href={`tel:021-91012345`}>
                  تماس با مشاور
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">
                  درخواست سفارشی
                </a>
              </Button>
            </div>
          </Card>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
