import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { TourCard } from "@/components/tour/tour-card";
import { CallbackForm } from "@/components/common/callback-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Users, Award, MapPin, TrendingUp, Star, Wallet, Headphones, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { TourCardSkeleton } from "@/components/tour/tour-card";

export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<TourSectionSkeleton />}>
          <FeaturedToursSection />
        </Suspense>
        <StatsSection />
        <WhyUsSection />
        <Suspense fallback={null}>
          <ReviewsSection />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}

function HeroSection() {
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
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="max-w-2xl">
          <Badge variant="accent" className="mb-4 text-sm gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            ویژه نوروز ۱۴۰۵
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-sm">
            سفری <span className="text-accent-300">روان</span> با{" "}
            <span className="text-white">ریوان سفر</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-100 leading-relaxed mb-8 drop-shadow-sm">
            تورهای داخلی و خارجی با بهترین قیمت، مشاوره‌ی تخصصی رایگان و پشتیبانی ۲۴ ساعته.
            سفر بعدی‌تان را با ما بسازید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" variant="cta" className="shadow-lg">
              <Link href="/tours">
                <Search className="w-5 h-5" />
                مشاهده تمام تورها
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
              <Link href="/contact">تماس با مشاور</Link>
            </Button>
          </div>
        </div>
      </div>
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
          <Link href="/tours" className="text-sm font-semibold text-primary hover:underline">
            مشاهده همه →
          </Link>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Section className="bg-primary text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-primary-100">{stat.label}</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => (
          <div key={idx} className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-shadow border border-stone-100">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${f.color} flex items-center justify-center shadow-sm`}>
              <f.icon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-stone-900 mb-2">{f.title}</h3>
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
          <Link href="/reviews" className="text-sm font-semibold text-primary hover:underline">
            همه نظرات →
          </Link>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-3 text-amber-400">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            {r.title && <h3 className="font-bold text-stone-900 mb-2">{r.title}</h3>}
            <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-4">{r.content}</p>
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold">
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
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            سفر رویایی‌تان را با ما بسازید
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            تیم مشاوران ما آماده‌اند تا با توجه به بودجه و علاقه‌ی شما، بهترین تور را پیشنهاد دهند. کافیست فرم زیر را پر کنید.
          </p>
          <ul className="space-y-2 text-sm text-stone-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              مشاوره رایگان با کارشناسان مجرب
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              پاسخگویی سریع در کمتر از ۳۰ دقیقه
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              تضمین بهترین قیمت بازار
            </li>
          </ul>
        </div>
        <CallbackForm />
      </div>
    </Section>
  );
}
