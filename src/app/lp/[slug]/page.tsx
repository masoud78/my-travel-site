import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CallbackForm } from "@/components/common/callback-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourCard } from "@/components/tour/tour-card";
import { prisma } from "@/lib/prisma";
import { RichText } from "@/components/common/rich-text";
import { safeParse } from "@/lib/utils";
import { formatJalaliDate } from "@/lib/jalali";
import { SITE_CONFIG } from "@/lib/site-config";
import { Phone, ArrowLeft, CheckCircle2 } from "lucide-react";

interface LandingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug, type: "LANDING", status: "PUBLISHED" },
  });

  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || SITE_CONFIG.description,
    keywords: page.keywords,
    openGraph: page.ogImage
      ? {
          images: [{ url: page.ogImage }],
        }
      : undefined,
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug, type: "LANDING", status: "PUBLISHED" },
  });

  if (!page) return notFound();

  const [featuredTours, faqs] = await Promise.all([
    prisma.tour.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        destination: true,
        transport: true,
        tourDates: { orderBy: { departDate: "asc" }, take: 1 },
      },
    }),
    prisma.tourFaq.findMany({
      where: { isGlobal: true },
      orderBy: { order: "asc" },
      take: 8,
    }),
  ]);

  const mappedTours = featuredTours.map((tour) => {
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

  const faqItems =
    faqs.length > 0
      ? faqs
      : [
          {
            id: "1",
            question: "چطور می‌توانم تور مورد نظرم را رزرو کنم؟",
            answer:
              "کافی است تور مورد نظر را انتخاب کرده و فرم مشاوره را پر کنید. کارشناسان ما در کمتر از ۳۰ دقیقه با شما تماس می‌گیرند.",
          },
          {
            id: "2",
            question: "آیا امکان پرداخت اقساطی وجود دارد؟",
            answer:
              "بله، برای بسیاری از تورها امکان پرداخت چندمرحله‌ای وجود دارد. جزئیات را می‌توانید از کارشناسان ما جویا شوید.",
          },
          {
            id: "3",
            question: "مدارک لازم برای سفر خارجی چیست؟",
            answer:
              "معمولاً گذرنامه معتبر، عکس و برای برخی مقاصد ویزا لازم است. مدارک دقیق هر تور در صفحه توضیحات آمده است.",
          },
        ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {page.campaignBanner ? (
            <div className="relative aspect-[21/9] md:aspect-[3/1]">
              <Image
                src={page.campaignBanner}
                alt={page.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 md:py-24">
              <div className="container mx-auto px-4" />
            </div>
          )}

          <div className="container mx-auto px-4 relative">
            <div
              className={
                page.campaignBanner
                  ? "-mt-24 md:-mt-32 mb-8 relative z-10"
                  : "absolute inset-0 flex items-center"
              }
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-3xl">
                <Badge variant="accent" className="mb-4">
                  کمپین ویژه
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
                  {page.title}
                </h1>
                {page.campaignCta && (
                  <p className="text-lg text-stone-600 mb-6">{page.campaignCta}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" variant="cta">
                    <Link href="/tours">
                      مشاهده تورها
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
                      <Phone className="w-4 h-4 ml-2" />
                      تماس با مشاور
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        {page.content && (
          <Section>
            <Breadcrumb items={[{ label: page.title }]} className="mb-6" />
            <div className="max-w-4xl mx-auto">
              <RichText content={page.content} className="prose-fa max-w-none" />
            </div>
          </Section>
        )}

        {/* Featured Tours */}
        {mappedTours.length > 0 && (
          <Section className="bg-stone-50">
            <SectionHeading
              title="تورهای ویژه این کمپین"
              subtitle="پیشنهادهای ویژه و محبوب‌ترین تورهای ما"
              action={
                <Link href="/tours" className="text-sm font-semibold text-primary hover:underline">
                  مشاهده همه →
                </Link>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mappedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </Section>
        )}

        {/* FAQ */}
        <Section>
          <SectionHeading title="سوالات متداول" subtitle="پاسخ به پرسش‌های رایج" align="center" />
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>

        {/* CTA */}
        <Section className="bg-gradient-to-br from-secondary-50 to-accent-50">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-4">
                آماده سفر هستید؟
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                مشاوران ما ۲۴ ساعته آماده‌اند تا بهترین تور را با توجه به بودجه و سلیقه‌ی شما پیشنهاد دهند.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> مشاوره رایگان
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> تضمین بهترین قیمت
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> پشتیبانی ۲۴ ساعته
                </li>
              </ul>
            </div>
            <CallbackForm subject={`کمپین: ${page.title}`} />
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
