import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { RichText } from "@/components/common/rich-text";
import { TourCard, TourCardData } from "@/components/tour/tour-card";
import { prisma } from "@/lib/prisma";
import { formatJalaliDate } from "@/lib/jalali";
import { MapPin, ArrowLeft, Calendar } from "lucide-react";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) return {};
  return {
    title: `${dest.name} | مقاصد گردشگری ریوان سفر`,
    description: dest.metaDesc || dest.description || `تورهای ${dest.name} با بهترین قیمت`,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      parent: { select: { name: true, slug: true } },
      children: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  });

  if (!destination) return notFound();

  const tours = await prisma.tour.findMany({
    where: { status: "PUBLISHED", destinationId: destination.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: true,
      transport: true,
      tourDates: { orderBy: { departDate: "asc" }, take: 1 },
    },
  });

  const mappedTours: TourCardData[] = tours.map((t) => {
    const images = JSON.parse(t.images || "[]") as string[];
    const firstDate = t.tourDates[0];
    return {
      id: t.id,
      slug: t.slug,
      title: t.title,
      destination: t.destination?.name || "",
      destinationId: t.destinationId || "",
      duration: t.nights,
      transport: t.transportType,
      transportId: t.transportId || "",
      category: t.category,
      airline: t.transport?.name || null,
      price: t.startPrice,
      image: t.thumbnail || images[0] || undefined,
      startDate: firstDate ? formatJalaliDate(firstDate.departDate) : undefined,
      isLastMinute: t.isLastMinute,
      isFeatured: t.isFeatured,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative h-52 sm:h-64 md:h-80 overflow-hidden">
          <Image
            src={destination.image || "/images/destinations/destinations-hero.jpg"}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{destination.name}</h1>
              {destination.parent && (
                <Link
                  href={`/destinations/${destination.parent.slug}`}
                  className="text-stone-200 hover:text-white text-sm"
                >
                  بازگشت به {destination.parent.name}
                </Link>
              )}
            </div>
          </div>
        </section>

        <Section className="bg-stone-50">
          <Breadcrumb
            items={[
              { label: "مقاصد", href: "/destinations" },
              { label: destination.name },
            ]}
            className="mb-4"
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {destination.description && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">درباره {destination.name}</h2>
                  <RichText content={destination.description} className="prose-fa max-w-none text-stone-700" />
                </div>
              )}

              {mappedTours.length > 0 ? (
                <div>
                  <SectionHeading title={`تورهای ${destination.name}`} subtitle="تورهای فعال در این مقصد" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {mappedTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                  <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-stone-900 mb-2">فعلاً توری برای این مقصد نداریم</h3>
                  <p className="text-stone-600 mb-4">به زودی تورهای این مقصد اضافه خواهد شد.</p>
                  <Link
                    href="/tours"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    مشاهده همه تورها
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {destination.children.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-bold text-lg text-stone-900 mb-4">زیرمقاصد</h3>
              <div className="space-y-3">
                    {destination.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/destinations/${child.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors border border-stone-100"
                      >
                        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                          {child.image ? (
                            <Image
                              src={child.image}
                              alt={child.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <MapPin className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">{child.name}</div>
                          {child.description && (
                            <div className="text-xs text-stone-500 line-clamp-1">{child.description}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
                <h3 className="font-bold text-lg text-stone-900 mb-3">نیاز به مشاوره دارید؟</h3>
                <p className="text-sm text-stone-600 mb-4">
                  کارشناسان ما برای انتخاب بهترین تور {destination.name} کنار شما هستند.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  درخواست مشاوره
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
