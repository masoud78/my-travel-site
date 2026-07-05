import Link from "next/link";
import Image from "next/image";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { TourCard } from "@/components/tour/tour-card";
import { CallbackForm } from "@/components/common/callback-form";
import { Button } from "@/components/ui/button";
import { HeroSearchWidget } from "@/components/home/hero-search";
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
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { TourCardSkeleton } from "@/components/tour/tour-card";
import { getActiveHomeBlocks } from "@/lib/admin-actions";

export default async function HomePage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true, slug: true, type: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection destinations={destinations} />
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
          <Link href="/tours" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            مشاهده همه
            <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
          </Link>
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
            }}
          />
        ))}
      </div>
    </Section>
  );
}

function HeroSection({ destinations }: { destinations: { id: string; name: string; slug: string; type: string }[] }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-home.jpg"
          alt="سفر با ریوان سفر"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-950/85 via-primary-900/70 to-stone-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 hero-pattern opacity-50" />
      </div>

      {/* Decorative floating shapes */}
      <div className="absolute top-16 right-8 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl hero-float" />
      <div className="absolute bottom-24 left-12 w-40 h-40 bg-primary-400/30 rounded-full blur-3xl hero-float-delay" />
      <div className="absolute top-32 left-1/3 w-3 h-3 bg-accent-400 rounded-full hero-float opacity-70" />
      <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-primary-300 rounded-full hero-float-delay opacity-70" />

      {/* Hero content */}
      <div className="container mx-auto px-4 pt-16 pb-32 sm:pt-20 sm:pb-36 md:pt-24 md:pb-40 relative z-10">
        <div className="max-w-3xl">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span className="text-white/90 text-xs sm:text-sm font-semibold tracking-wide">آژانس مسافرتی ریوان سفر</span>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-4 sm:mb-5 drop-shadow-2xl">
            همسفر روان شما در{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-l from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
                دنیای سفر
              </span>
              <span className="absolute inset-0 bg-accent/30 blur-2xl rounded-full -z-10" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl drop-shadow-md">
            تورهای داخلی و خارجی با <span className="font-bold text-accent-300">بهترین قیمت</span>، مشاوره‌ی تخصصی رایگان و پشتیبانی ۲۴ ساعته.
          </p>

          {/* Hero stats row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/20 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-accent-400" />
              </div>
              <span className="text-white/90 text-sm font-medium">رزرو مطمئن</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/20 backdrop-blur-sm">
                <Award className="w-4 h-4 text-accent-400" />
              </div>
              <span className="text-white/90 text-sm font-medium">+۱۰ سال تجربه</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/20 backdrop-blur-sm">
                <HeartHandshake className="w-4 h-4 text-accent-400" />
              </div>
              <span className="text-white/90 text-sm font-medium">پشتیبانی ۲۴/۷</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-row gap-3">
            <Button asChild size="lg" className="bg-gradient-to-l from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-xl shadow-accent-500/40 h-12 px-6 text-base font-bold border-0">
              <Link href="/tours">
                <Search className="w-5 h-5" />
                <span>مشاهده تورها</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white h-12 px-6 text-base font-bold">
              <Link href="/contact">
                <MessageCircle className="w-5 h-5" />
                <span>مشاوره رایگان</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search widget — overlapping bottom of hero */}
      <HeroSearchWidget destinations={destinations} />

      {/* Decorative fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface to-transparent -z-10" />
    </section>
  );
}

async function FeaturedToursSection() {
  const tours = await prisma.tour.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { destination: true },
  });

  if (!tours.length) return null;

  return (
    <Section>
      <SectionHeading
        title="تورهای محبوب"
        subtitle="پرطرفدارترین تورهای این هفته را ببینید"
        action={
          <Link href="/tours" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            مشاهده همه
            <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            }}
          />
        ))}
      </div>
    </Section>
  );
}

function TourSectionSkeleton() {
  return (
    <Section>
      <SectionHeading title="تورهای محبوب" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <TourCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Users, value: "۲۰,۰۰۰+", label: "مسافر راضی" },
    { icon: MapPin, value: "۱۵۰+", label: "مقصد گردشگری" },
    { icon: Award, value: "۱۵ سال", label: "سابقه درخشان" },
    { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
  ];

  return (
    <Section className="bg-primary text-white py-12 sm:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative">
            {/* Glassmorphism circle */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 backdrop-blur-lg" />
            </div>
            <div className="relative flex flex-col items-center gap-3">
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <stat.icon className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 num-en">{stat.value}</div>
                <div className="text-xs sm:text-sm text-primary-100">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function WhyUsSection() {
  const features = [
    {
      title: "بهترین قیمت",
      description: "تضمین پایین‌ترین قیمت بازار با امکان مقایسه",
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "مشاوره رایگان",
      description: "مشاوران متخصص ما ۲۴ ساعته پاسخگوی شما هستند",
      icon: Headphones,
      color: "bg-primary-50 text-primary-600",
    },
    {
      title: "پرداخت امن",
      description: "پرداخت اقساطی و درگاه‌های معتبر بانکی",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "پشتیبانی همیشگی",
      description: "پشتیبانی ۲۴/۷ در تمام مراحل سفر شما",
      icon: HeartHandshake,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <Section className="bg-stone-50">
      <SectionHeading title="چرا ریوان سفر؟" subtitle="چهار دلیل برای اطمینان به ما" align="center" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, idx) => (
          <div key={idx} className="group bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-shadow border border-stone-100">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl ${f.color} flex items-center justify-center shadow-sm`}>
              <f.icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 mb-2">{f.title}</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

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
          <Link href="/reviews" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            همه نظرات
            <ArrowLeft className="w-4 h-4 scale-x-[-1]" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-3 text-amber-400">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            {r.title && <h3 className="font-bold text-stone-900 mb-2 text-sm sm:text-base">{r.title}</h3>}
            <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-4">{r.content}</p>
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-sm sm:text-base">
                {r.authorName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm text-stone-900">{r.authorName}</div>
                {r.tourTitle && <div className="text-xs text-stone-500">{r.tourTitle}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CTASection() {
  return (
    <Section className="bg-gradient-to-br from-secondary-50 to-accent-50">
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
        <CallbackForm />
      </div>
    </Section>
  );
}
