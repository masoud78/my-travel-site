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
import { Globe, Plane, Ship, Train } from "lucide-react";

export default async function HomePage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true, slug: true, type: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection destinations={destinations} />
        <QuickLinksSection />
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
        {/* Stronger multi-layer overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-950/92 via-primary-900/82 to-stone-900/88" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <div className="absolute inset-0 hero-pattern opacity-40" />
      </div>

      {/* Decorative floating shapes */}
      <div className="absolute top-12 right-8 w-28 h-28 bg-accent-500/20 rounded-full blur-3xl hero-float" />
      <div className="absolute bottom-16 left-12 w-36 h-36 bg-primary-400/30 rounded-full blur-3xl hero-float-delay" />

      {/* Hero content — compact height */}
      <div className="container mx-auto px-4 pt-14 pb-6 sm:pt-16 sm:pb-8 md:pt-20 md:pb-10 relative z-10">
        <div className="max-w-3xl">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">آژانس مسافرتی ریوان سفر</span>
          </div>

          {/* Main headline — stronger hierarchy */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.2] mb-3 sm:mb-4 drop-shadow-2xl">
            همسفر روان شما در{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-l from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent">
                دنیای سفر
              </span>
              <span className="absolute inset-0 bg-accent/30 blur-2xl rounded-full -z-10" />
            </span>
          </h1>

          {/* Subheadline — larger, more readable */}
          <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed mb-4 sm:mb-6 max-w-2xl drop-shadow-md">
            تورهای داخلی و خارجی با <span className="font-bold text-accent-200">بهترین قیمت</span>، مشاوره‌ی تخصصی رایگان و پشتیبانی ۲۴ ساعته.
          </p>

          {/* Hero stats row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 sm:mb-6">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent-400" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">رزرو مطمئن</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent-400" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">+۱۰ سال تجربه</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-accent-400" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">پشتیبانی ۲۴/۷</span>
            </div>
          </div>

          {/* CTA buttons — larger, more prominent */}
          <div className="flex flex-row gap-3">
            <Button asChild size="lg" className="bg-gradient-to-l from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg shadow-accent-500/30 h-12 px-6 text-sm font-bold border-0">
              <Link href="/tours">
                <Search className="w-4 h-4" />
                <span>مشاهده تورها</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white h-12 px-6 text-sm font-bold">
              <Link href="/contact">
                <MessageCircle className="w-4 h-4" />
                <span>مشاوره رایگان</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search widget — overlap on desktop, separate section on mobile */}
      <div className="relative z-20 hidden sm:block">
        <div className="-mt-8">
          <HeroSearchWidget destinations={destinations} />
        </div>
      </div>

      {/* Mobile search — separate section below hero */}
      <div className="sm:hidden relative z-10 px-3 pb-4 -mt-2">
        <HeroSearchWidget destinations={destinations} />
      </div>

      {/* Decorative fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent -z-10" />
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

function QuickLinksSection() {
  const categories = [
    { label: "تور داخلی", href: "/tours/domestic", icon: Globe, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
    { label: "تور ترکیه", href: "/tours/turkey", icon: Plane, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "تور آسیایی", href: "/tours/asia", icon: Ship, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
    { label: "تور اروپا", href: "/tours/europe", icon: Train, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
    { label: "تورهای ویژه", href: "/tours/special", icon: Globe, color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
  ];

  return (
    <Section className="bg-white">
      <SectionHeading title="دسته‌بندی تورها" subtitle="مقاصد محبوب خود را انتخاب کنید" align="center" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl border border-stone-100 hover:border-transparent ${cat.color} transition-all hover:shadow-md`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <cat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="font-semibold text-sm sm:text-base text-stone-800">{cat.label}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Users, value: "۲۰,۰�00+", label: "مسافر راضی" },
    { icon: MapPin, value: "۱۵۰+", label: "مقصد گردشگری" },
    { icon: Award, value: "�15 سال", label: "سابقه درخشان" },
    { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
  ];

  return (
    <Section className="bg-primary text-white py-12 sm:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-accent-300" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 num-en">{stat.value}</div>
              <div className="text-xs sm:text-sm text-primary-100">{stat.label}</div>
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
    },
    {
      title: "مشاوره رایگان",
      description: "مشاوران متخصص ما ۲۴ ساعته پاسخگوی شما هستند",
      icon: Headphones,
    },
    {
      title: "پرداخت امن",
      description: "پرداخت اقساطی و درگاه‌های معتبر بانکی",
      icon: ShieldCheck,
    },
    {
      title: "پشتیبانی همیشگی",
      description: "پشتیبانی ۲۴/۷ در تمام مراحل سفر شما",
      icon: HeartHandshake,
    },
  ];

  return (
    <Section className="bg-surface-soft">
      <SectionHeading title="چرا ریوان سفر؟" subtitle="چهار دلیل برای اطمینان به ما" align="center" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, idx) => (
          <div key={idx} className="group bg-white rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-shadow border border-stone-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-sm group-hover:bg-primary-100 transition-colors">
              <f.icon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 mb-2">{f.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{f.description}</p>
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
    <Section className="bg-surface-soft">
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
          <div key={r.id} className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-0.5 mb-3 text-amber-400" dir="ltr">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            {r.title && <h3 className="font-bold text-stone-900 mb-2 text-sm sm:text-base">{r.title}</h3>}
            <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-4">{r.content}</p>
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-sm">
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
    <Section className="bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-stone-900 mb-4 leading-tight">
            سفر رویایی‌تان را با ما بسازید
          </h2>
          <p className="text-base text-stone-600 leading-relaxed mb-6">
            تیم مشاوران ما آماده‌اند تا با توجه به بودجه و علاقه‌ی شما، بهترین تور را پیشنهاد دهند. کافیست فرم را پر کنید.
          </p>
          <ul className="space-y-3 text-sm text-stone-700">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>مشاوره رایگان با کارشناسان مجرب</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>پاسخگویی سریع در کمتر از ۳۰ دقیقه</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>تضمین بهترین قیمت بازار</span>
            </li>
          </ul>
        </div>
        <CallbackForm />
      </div>
    </Section>
  );
}
