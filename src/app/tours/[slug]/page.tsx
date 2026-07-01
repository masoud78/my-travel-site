import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CallbackForm } from "@/components/common/callback-form";
import { RichText } from "@/components/common/rich-text";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TourImageGallery } from "@/components/tour/tour-image-gallery";
import { ShareButtons } from "@/components/tour/share-buttons";
import { SimilarToursCarousel } from "@/components/tour/similar-tours";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  safeParse,
  formatPrice,
  formatNumber,
  truncate,
} from "@/lib/utils";
import { ReviewForm } from "@/components/review/review-form";
import { formatJalaliDate } from "@/lib/jalali";
import { touristTripSchema, breadcrumbSchema, jsonLd } from "@/lib/seo";
import {
  Clock,
  Calendar,
  MapPin,
  Plane,
  Train,
  Bus,
  Car,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Headphones,
  Phone,
  Star,
  AlertCircle,
} from "lucide-react";

interface TourDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = await prisma.tour.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { destination: true },
  });

  if (!tour) return {};

  return {
    title: tour.metaTitle || tour.title,
    description: tour.metaDesc || truncate(tour.shortDesc || tour.description || SITE_CONFIG.description),
    keywords: tour.keywords,
    openGraph: {
      title: tour.metaTitle || tour.title,
      description: tour.metaDesc || truncate(tour.shortDesc || tour.description || ""),
      images: tour.thumbnail ? [tour.thumbnail] : safeParse<string[]>(tour.images, []),
    },
  };
}

const transportIcons: Record<string, React.ReactNode> = {
  PLANE: <Plane className="w-5 h-5" />,
  TRAIN: <Train className="w-5 h-5" />,
  BUS: <Bus className="w-5 h-5" />,
  ROAD: <Car className="w-5 h-5" />,
  MIXED: <Plane className="w-5 h-5" />,
};

const transportLabels: Record<string, string> = {
  PLANE: "هواپیما",
  TRAIN: "قطار",
  BUS: "اتوبوس",
  ROAD: "زمینی",
  MIXED: "ترکیبی",
};

const categoryLabels: Record<string, string> = {
  INTERNAL: "تور داخلی",
  TURKEY: "تور ترکیه",
  ASIA: "تور آسیایی",
  EUROPE: "تور اروپا",
  SPECIAL: "تور ویژه",
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "accent" | "success" | "warning" | "destructive" }
> = {
  PUBLISHED: { label: "منتشر شده", variant: "success" },
  RUNNING: { label: "در حال اجرا", variant: "accent" },
  NOT_RUNNING: { label: "غیرفعال", variant: "warning" },
  INACTIVE: { label: "غیرفعال", variant: "destructive" },
  DRAFT: { label: "پیش‌نویس", variant: "secondary" },
};

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: {
      destination: true,
      transport: true,
      tourDates: { orderBy: { departDate: "asc" } },
      tourHotels: {
        include: { hotel: true },
        orderBy: { priceDouble: "asc" },
      },
      faqs: { orderBy: { order: "asc" } },
      reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 6 },
    },
  });

  if (!tour || tour.status !== "PUBLISHED") {
    return notFound();
  }

  // Increment views (non-blocking)
  prisma.tour.update({
    where: { id: tour.id },
    data: { views: { increment: 1 } },
  }).catch(() => null);

  const images = safeParse<string[]>(tour.images, []);
  const includes = safeParse<string[]>(tour.includes, []);
  const excludes = safeParse<string[]>(tour.excludes, []);
  const requirements = safeParse<string[]>(tour.requirements, []);
  const itinerary = safeParse<ItineraryDay[] | string>(tour.itinerary, []);
  const origins = safeParse<string[]>(tour.origins, []);

  const normalizedItinerary: ItineraryDay[] = Array.isArray(itinerary)
    ? itinerary
    : typeof itinerary === "string" && itinerary.trim()
    ? [{ day: 1, title: "برنامه سفر", description: itinerary }]
    : [];

  const imageGalleryImages =
    images.length > 0 ? images : tour.thumbnail ? [tour.thumbnail] : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;
  const tourUrl = `${siteUrl}/tours/${tour.slug}`;

  const touristTrip = touristTripSchema({
    name: tour.title,
    description: tour.shortDesc || tour.description || SITE_CONFIG.description,
    image: imageGalleryImages.length > 0 ? imageGalleryImages : [SITE_CONFIG.defaultMetaImage],
    price: tour.startPrice,
    duration: tour.duration,
    url: tourUrl,
    destination: tour.destination?.name || categoryLabels[tour.category] || tour.category,
    startDate: tour.tourDates[0]?.departDate.toISOString(),
    endDate: tour.tourDates[0]?.returnDate.toISOString(),
  });

  const breadcrumbs = breadcrumbSchema([
    { name: "تورها", url: "/tours" },
    {
      name: categoryLabels[tour.category] || tour.category,
      url: `/tours/${tour.category.toLowerCase() === "internal" ? "domestic" : tour.category.toLowerCase()}`,
    },
    { name: tour.title, url: `/tours/${tour.slug}` },
  ]);

  const similarTours = await prisma.tour.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: tour.id },
      OR: [
        { category: tour.category },
        { destinationId: tour.destinationId || undefined },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      destination: true,
      transport: true,
      tourDates: { orderBy: { departDate: "asc" }, take: 1 },
    },
  });

  const mappedSimilar = similarTours.map((t) => {
    const tImages = safeParse<string[]>(t.images, []);
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
      image: t.thumbnail || tImages[0] || undefined,
      startDate: firstDate ? formatJalaliDate(firstDate.departDate) : undefined,
      isLastMinute: t.isLastMinute,
      isFeatured: t.isFeatured,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    };
  });

  const avgRating =
    tour.reviews.length > 0
      ? (tour.reviews.reduce((s, r) => s + r.rating, 0) / tour.reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50 pb-6">
          <Breadcrumb
            items={[
              { label: "تورها", href: "/tours" },
              {
                label: categoryLabels[tour.category] || tour.category,
                href: `/tours/${tour.category.toLowerCase() === "internal" ? "domestic" : tour.category.toLowerCase()}`,
              },
              { label: tour.title },
            ]}
            className="mb-4"
          />

          {/* Header */}
          <div className="flex flex-wrap items-start gap-3 mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
              {tour.title}
            </h1>
            {statusConfig[tour.status] && (
              <Badge variant={statusConfig[tour.status].variant} className="mt-1.5">
                {statusConfig[tour.status].label}
              </Badge>
            )}
          </div>

          {/* Share + rating row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                {transportIcons[tour.transportType] || <Plane className="w-4 h-4" />}
                {transportLabels[tour.transportType] || tour.transportType}
              </span>
              <span className="w-px h-4 bg-stone-300" />
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {tour.destination?.name || "نامشخص"}
              </span>
              {avgRating && (
                <>
                  <span className="w-px h-4 bg-stone-300" />
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    {avgRating} ({tour.reviews.length} نظر)
                  </span>
                </>
              )}
            </div>
            <ShareButtons url={tourUrl} title={tour.title} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <TourImageGallery images={imageGalleryImages} title={tour.title} thumbnail={tour.thumbnail} />

              {/* Podcast */}
              {tour.podcastUrl && (
                <AudioPlayer src={tour.podcastUrl} title="مشاوره سفر صوتی" />
              )}

              {/* Description */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                <SectionHeading title="درباره تور" className="mb-4" />
                {tour.shortDesc && (
                  <p className="text-lg text-stone-700 leading-relaxed mb-6">{tour.shortDesc}</p>
                )}
                {tour.description ? (
                  <RichText content={tour.description} />
                ) : (
                  <p className="text-stone-500">توضیحات تکمیلی به زودی اضافه می‌شود.</p>
                )}
              </div>

              {/* Itinerary */}
              {normalizedItinerary.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <SectionHeading title="برنامه روزانه" className="mb-4" />
                  <div className="space-y-4">
                    {normalizedItinerary.map((day) => (
                      <div
                        key={day.day}
                        className="flex gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100"
                      >
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 mb-1">{day.title}</h3>
                          <p className="text-sm text-stone-600 leading-relaxed">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates table */}
              {tour.tourDates.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <SectionHeading title="تاریخ‌های حرکت" className="mb-4" />
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-500">
                          <th className="text-right py-3 px-2">تاریخ رفت</th>
                          <th className="text-right py-3 px-2">تاریخ برگشت</th>
                          <th className="text-right py-3 px-2">قیمت</th>
                          <th className="text-right py-3 px-2">ظرفیت</th>
                          <th className="text-right py-3 px-2">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tour.tourDates.map((date) => (
                          <tr key={date.id} className="border-b border-stone-100 last:border-0">
                            <td className="py-3 px-2">{formatJalaliDate(date.departDate)}</td>
                            <td className="py-3 px-2">{formatJalaliDate(date.returnDate)}</td>
                            <td className="py-3 px-2 font-bold text-primary">
                              {formatPrice(date.price)}
                            </td>
                            <td className="py-3 px-2">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-stone-400" />
                                {formatNumber(date.remaining)} / {formatNumber(date.capacity)}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <Badge
                                variant={
                                  date.status === "AVAILABLE"
                                    ? "success"
                                    : date.status === "FULL"
                                    ? "destructive"
                                    : "warning"
                                }
                              >
                                {date.status === "AVAILABLE"
                                  ? "قابل رزرو"
                                  : date.status === "FULL"
                                  ? "تکمیل ظرفیت"
                                  : "لغو شده"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hotels table */}
              {tour.tourHotels.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <SectionHeading title="هتل‌ها و قیمت‌ها" className="mb-4" />
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-500">
                          <th className="text-right py-3 px-2">هتل</th>
                          <th className="text-right py-3 px-2">ستاره</th>
                          <th className="text-right py-3 px-2">دو تخته</th>
                          <th className="text-right py-3 px-2">یک نفر اضافه</th>
                          <th className="text-right py-3 px-2">کودک</th>
                          <th className="text-right py-3 px-2">نوزاد</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tour.tourHotels.map((th) => (
                          <tr key={th.id} className="border-b border-stone-100 last:border-0">
                            <td className="py-3 px-2 font-medium">{th.hotel.name}</td>
                            <td className="py-3 px-2">
                              <span className="text-amber-500">{"★".repeat(th.hotel.stars)}</span>
                            </td>
                            <td className="py-3 px-2 font-bold text-primary">
                              {formatPrice(th.priceDouble)}
                            </td>
                            <td className="py-3 px-2 text-stone-600">
                              {th.priceExtra ? formatPrice(th.priceExtra) : "-"}
                            </td>
                            <td className="py-3 px-2 text-stone-600">
                              {th.priceChild ? formatPrice(th.priceChild) : "-"}
                            </td>
                            <td className="py-3 px-2 text-stone-600">
                              {th.priceInfant ? formatPrice(th.priceInfant) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Includes / Excludes / Requirements */}
              <div className="grid md:grid-cols-2 gap-6">
                {includes.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      خدمات شامل
                    </h3>
                    <ul className="space-y-2">
                      {includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {excludes.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      خدمات غیرشامل
                    </h3>
                    <ul className="space-y-2">
                      {excludes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                          <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {requirements.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <SectionHeading title="مدارک لازم" className="mb-4" />
                  <ul className="space-y-3">
                    {requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-stone-700">
                        <FileText className="w-5 h-5 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cancellation */}
              {tour.cancellation && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">شرایط کنسلی</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">{tour.cancellation}</p>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {tour.faqs.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <SectionHeading title="سوالات متداول" className="mb-4" />
                  <Accordion type="single" collapsible className="w-full">
                    {tour.faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                <SectionHeading title="نظرات مشتریان" className="mb-4" />
                {avgRating && (
                  <p className="text-sm text-stone-500 mb-4">
                    میانگین امتیاز: <span className="font-semibold text-amber-500">{avgRating} از ۵</span>
                  </p>
                )}
                {tour.reviews.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {tour.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-xl bg-stone-50 border border-stone-100"
                      >
                        <div className="flex items-center gap-1 text-amber-500 mb-2">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        {review.title && (
                          <h4 className="font-bold text-stone-900 mb-1">{review.title}</h4>
                        )}
                        <p className="text-sm text-stone-600 leading-relaxed mb-3">
                          {review.content}
                        </p>
                        <div className="text-xs text-stone-400">{review.authorName}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 text-sm mb-6">هنوز نظری ثبت نشده است. اولین نظر را شما بنویسید.</p>
                )}
                <ReviewForm tourId={tour.id} tourTitle={tour.title} />
              </div>

            </div>
            {/* Sticky sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Summary card */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <div className="text-sm text-stone-500 mb-1">شروع قیمت از</div>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {formatPrice(tour.startPrice)}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-stone-100">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> مدت
                      </span>
                      <span className="font-medium">
                        {formatNumber(tour.duration)} روز / {formatNumber(tour.nights)} شب
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-stone-100">
                      <span className="text-stone-500 flex items-center gap-1">
                        {transportIcons[tour.transportType] || <Plane className="w-4 h-4" />}
                        حمل‌ونقل
                      </span>
                      <span className="font-medium">
                        {tour.transport?.name || transportLabels[tour.transportType] || tour.transportType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-stone-100">
                      <span className="text-stone-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> مقصد
                      </span>
                      <span className="font-medium">{tour.destination?.name || "-"}</span>
                    </div>
                    {origins.length > 0 && (
                      <div className="flex items-center justify-between text-sm py-2 border-b border-stone-100">
                        <span className="text-stone-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> مبدأ
                        </span>
                        <span className="font-medium">{origins.join("، ")}</span>
                      </div>
                    )}
                    {tour.tourDates[0] && (
                      <div className="flex items-center justify-between text-sm py-2 border-b border-stone-100">
                        <span className="text-stone-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> اولین تاریخ
                        </span>
                        <span className="font-medium">
                          {formatJalaliDate(tour.tourDates[0].departDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button asChild size="lg" className="w-full mb-3" variant="cta">
                    <Link href="#callback-form">
                      <Headphones className="w-4 h-4 ml-2" />
                      درخواست مشاوره
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
                      <Phone className="w-4 h-4 ml-2" />
                      تماس فوری
                    </a>
                  </Button>
                </div>

                {/* Callback form */}
                <div id="callback-form">
                  <CallbackForm tourTitle={tour.title} />
                </div>
              </div>
            </aside>
          </div>
        </Section>

        {/* Similar tours */}
        {mappedSimilar.length > 0 && (
          <Section className="bg-stone-50 border-t border-stone-200">
            <SectionHeading
              title="تورهای مشابه"
              subtitle="تورهای پیشنهادی با مقصد یا دسته‌بندی مشابه"
              action={
                <Link href="/tours" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  همه تورها
                  <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
                </Link>
              }
            />
            <SimilarToursCarousel tours={mappedSimilar} />
          </Section>
        )}
      </main>
      <Footer />
      <MobileCTABar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd([touristTrip, breadcrumbs]) }}
      />
    </div>
  );
}
