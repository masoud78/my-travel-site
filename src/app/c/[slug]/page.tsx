import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { RichText } from "@/components/common/rich-text";
import { TourCard, TourCardData } from "@/components/tour/tour-card";
import { prisma } from "@/lib/prisma";
import { formatJalaliDate } from "@/lib/jalali";
import { safeParse } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.tourCategory.findUnique({ where: { slug } });
  if (!cat || !cat.isActive || cat.status !== "PUBLISHED") return {};
  return {
    title: cat.metaTitle || `${cat.title} | ریوان سفر`,
    description: cat.metaDesc || cat.subtitle || `تورهای ${cat.title}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cat = await prisma.tourCategory.findUnique({
    where: { slug },
    include: { tours: { select: { id: true } } },
  });

  if (!cat || !cat.isActive || cat.status !== "PUBLISHED") return notFound();

  const destinationIds = safeParse<string[]>(cat.destinationIds, []);
  const manualTourIds = safeParse<string[]>(cat.tourIds, []);

  let where: Record<string, unknown> = { status: "PUBLISHED" };

  if (manualTourIds.length > 0) {
    where = { ...where, id: { in: manualTourIds } };
  } else if (destinationIds.length > 0) {
    where = {
      ...where,
      OR: [{ destinationId: { in: destinationIds } }, { destinations: { some: { id: { in: destinationIds } } } }],
    };
  }

  if (cat.transportType) where = { ...where, transportType: cat.transportType };
  if (cat.originCity) where = { ...where, originCity: { contains: cat.originCity } };

  const tours = await prisma.tour.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: {
      destination: true,
      transport: true,
      tourDates: { orderBy: { departDate: "asc" }, take: 1 },
    },
  });

  const mappedTours: TourCardData[] = tours.map((t) => {
    const images = safeParse<string[]>(t.images, []);
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
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "تورها", href: "/tours" }, { label: cat.title }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">{cat.title}</h1>
            {cat.subtitle && <p className="text-lg text-stone-600 leading-relaxed">{cat.subtitle}</p>}
          </div>
        </Section>

        {cat.description && (
          <Section className="pt-0">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
              <RichText content={cat.description} className="prose-fa max-w-none" />
            </div>
          </Section>
        )}

        <Section>
          <SectionHeading title={`تورهای ${cat.title}`} subtitle={`${mappedTours.length} تور یافت شد`} />
          {mappedTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mappedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500">فعلاً توری در این دسته‌بندی وجود ندارد.</p>
            </div>
          )}
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
