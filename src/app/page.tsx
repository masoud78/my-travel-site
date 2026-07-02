import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { TourCard, TourCardSkeleton } from "@/components/tour/tour-card";
import { CallbackForm } from "@/components/common/callback-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Users,
  Award,
  MapPin,
  TrendingUp,
  Star,
  Wallet,
  Headphones,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Plane,
  Clock,
  Calendar,
  Zap,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveHomeBlocks } from "@/lib/admin-actions";
import type { Tour, Destination } from "@prisma/client";
import { formatPrice, formatNumber } from "@/lib/utils";

// Modern Hero Section with Animation
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-home.jpg"
          alt="سفر با ریوان سفر"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-900/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.15),transparent_70%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary-500/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500/10 rounded-full animate-float delay-1000" />
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent-500/10 rounded-full animate-float delay-2000" />
        <Plane className="absolute top-1/3 right-1/4 w-16 h-16 text-white/10 opacity-50" />
        <Globe className="absolute bottom-1/3 left-1/3 w-20 h-20 text-white/10 opacity-50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 relative z-20">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
          {/* Badge */}
          <Badge
            variant="gradient"
            size="lg"
            className="mb-4 md:mb-6 animate-fade-in"
          >
            <Sparkles className="w-4 h-4" />
            ویژه نوروز ۱۴۰۵
          </Badge>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 md:mb-6 animate-fade-in delay-100">
            سفری <span className="text-gradient">روان</span> با{" "}
            <span className="text-white">ریوان سفر</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-stone-100 leading-relaxed mb-8 md:mb-10 animate-fade-in delay-200 max-w-lg">
            تورهای داخلی و خارجی با بهترین قیمت، مشاوره‌ی تخصصی رایگان و پشتیبانی ۲۴ ساعته.
            سفر بعدی‌تان را با ما بسازید.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
            <Button asChild size="lg" variant="cta" className="w-full sm:w-auto">
              <Link href="/tours">
                <Search className="w-5 h-5" />
                مشاهده تمام تورها
              </Link>
            </Button>
            <Button asChild size="lg" variant="light" className="w-full sm:w-auto">
              <Link href="/contact">
                <Headphones className="w-5 h-5" />
                تماس با مشاور
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in delay-400">
            {[
              { icon: Users, value: "۲۰,۰۰۰+", label: "مسافر راضی" },
              { icon: MapPin, value: "۱۵۰+", label: "مقصد گردشگری" },
              { icon: Award, value: "۱۵ سال", label: "سابقه درخشان" },
              { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
            ].map((stat, idx) => (
              <Card
                key={idx}
                variant="glass"
                className="p-4 text-center border border-white/20"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-secondary-400" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-stone-300">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-xs">به پایین اسکرول کنید</span>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </section>
  );
}

// Featured Tours Section with Modern Slider
async function FeaturedToursSection() {
  const tours = await prisma.tour.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
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
    image: tour.thumbnail || undefined,
    hotelStars: 4,
    isFeatured: tour.isFeatured,
    isLastMinute: tour.isLastMinute,
    discount: tour.discount,
  }));

  return (
    <Section className="bg-stone-50">
      <SectionHeading
        title="تورهای محبوب"
        subtitle="پرطرفدارترین تورهای این هفته را ببینید"
        action={
          <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/tours">
              مشاهده همه
              <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {mappedTours.slice(0, 4).map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </Section>
  );
}

// Home Blocks Section
async function HomeBlocksSection() {
  const blocks = await getActiveHomeBlocks();
  if (!blocks.length) {
    return <FeaturedToursSection />;
  }
  return (
    <>
      {blocks.map((block) => (
        <HomeBlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}

// Home Block Renderer
async function HomeBlockRenderer({ block }: { block: { id: string; title: string; subtitle: string | null; layout: string; filterType: string; filterValue: string | null } }) {
  let where: Record<string, unknown> = { status: "PUBLISHED" };

  switch (block.filterType) {
    case "FEATURED":
      where = { ...where, isFeatured: true };
      break;
    case "LAST_MINUTE":
      where = { ...where, isLastMinute: true };
      break;
    case "CATEGORY":
      where = { ...where, category: block.filterValue || undefined };
      break;
    case "DESTINATION": {
      const dest = block.filterValue
        ? await prisma.destination.findUnique({ where: { slug: block.filterValue }, select: { id: true } })
        : null;
      if (dest) {
        where = { ...where, destinationId: dest.id };
      }
      break;
    }
    case "CUSTOM": {
      try {
        const ids: string[] = JSON.parse(block.filterValue || "[]");
        if (ids.length) {
          where = { ...where, id: { in: ids } };
        }
      } catch {
        // ignore invalid JSON
      }
      break;
    }
  }

  const tours = await prisma.tour.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: block.layout === "GRID_4" ? 8 : 6,
    include: { destination: true },
  });

  if (!tours.length) return null;

  const gridClass =
    block.layout === "GRID_4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : block.layout === "LIST"
      ? "grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section>
      <SectionHeading
        title={block.title}
        subtitle={block.subtitle || undefined}
        action={
          <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/tours">
              مشاهده همه
              <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
            </Link>
          </Button>
        }
      />
      <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={{
              id: tour.id,
              slug: tour.slug,
              title: tour.title,
              destination: tour.destination?.name || tour.category,
              duration: tour.nights,
              transport: tour.transportType,
              price: tour.startPrice,
              image: tour.thumbnail || undefined,
              hotelStars: 4,
              isFeatured: tour.isFeatured,
              isLastMinute: tour.isLastMinute,
              discount: tour.discount,
            }}
          />
        ))}
      </div>
    </Section>
  );
}

// Stats Section with Animation
function StatsSection() {
  const stats = [
    { icon: Users, value: "۲۰,۰۰۰+", label: "مسافر راضی" },
    { icon: MapPin, value: "۱۵۰+", label: "مقصد گردشگری" },
    { icon: Award, value: "۱۵ سال", label: "سابقه درخشان" },
    { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
  ];

  return (
    <Section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            variant="glass"
            className="p-4 sm:p-6 border border-white/20 hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-primary-100">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// Why Us Section with Modern Cards
function WhyUsSection() {
  const features = [
    {
      title: "بهترین قیمت",
      description: "تضمین پایین‌ترین قیمت بازار با امکان مقایسه",
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "مشاوره رایگان",
      description: "مشاوران متخصص ما ۲۴ ساعته پاسخگوی شما هستند",
      icon: Headphones,
      color: "bg-primary-50 text-primary-600",
      gradient: "from-primary-500 to-primary-600",
    },
    {
      title: "پرداخت امن",
      description: "پرداخت اقساطی و درگاه‌های معتبر بانکی",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "پشتیبانی همیشگی",
      description: "پشتیبانی ۲۴/۷ در تمام مراحل سفر شما",
      icon: HeartHandshake,
      color: "bg-amber-50 text-amber-600",
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <Section className="bg-stone-50">
      <SectionHeading title="چرا ریوان سفر؟" subtitle="چهار دلیل برای اطمینان به ما" align="center" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, idx) => (
          <Card
            key={idx}
            variant="hoverable"
            className="group text-center p-4 sm:p-6 cursor-pointer"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl ${f.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
              <f.icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 mb-2">{f.title}</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{f.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// Reviews Section with Modern Design
async function ReviewsSection() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (!reviews.length) return null;

  return (
    <Section>
      <SectionHeading
        title="نظرات مشتریان"
        subtitle="تجربه‌ی واقعی مسافران ما"
        action={
          <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/reviews">
              همه نظرات
              <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {reviews.map((r) => (
          <Card key={r.id} variant="bordered" className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-1 mb-3 text-amber-400">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            {r.title && <h3 className="font-bold text-stone-900 mb-2 text-sm sm:text-base">{r.title}</h3>}
            <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-4">{r.content}</p>
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {r.authorName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm text-stone-900">{r.authorName}</div>
                {r.tourTitle && <div className="text-xs text-stone-500">{r.tourTitle}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// CTA Section with Modern Design
function CTASection() {
  return (
    <Section className="bg-gradient-to-br from-secondary-50 via-white to-accent-50">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-3 md:mb-4">
            سفر رویایی‌تان را با ما بسازید
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-4 md:mb-6">
            تیم مشاوران ما آماده‌اند تا با توجه به بودجه و علاقه‌ی شما، بهترین تور را پیشنهاد دهند. کافیست فرم زیر را پر کنید.
          </p>
          <ul className="space-y-2 text-sm text-stone-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>مشاوره رایگان با کارشناسان مجرب</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>پاسخگویی سریع در کمتر از ۳۰ دقیقه</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>تضمین بهترین قیمت بازار</span>
            </li>
          </ul>
        </div>
        <CallbackForm className="shadow-xl" />
      </div>
    </Section>
  );
}

// Skeleton for Home Blocks
function TourSectionSkeleton() {
  return (
    <Section>
      <SectionHeading title="تورهای محبوب" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <TourCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  );
}

// Main Page Component
export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<TourSectionSkeleton />}>
          <HomeBlocksSection />
        </Suspense>
        <StatsSection />
        <WhyUsSection />
        <Suspense fallback={null}>
          <ReviewsSection />
        </Suspense>
        <CTASection />
      </main>
      <MobileCTABar />
    </div>
  );
}
