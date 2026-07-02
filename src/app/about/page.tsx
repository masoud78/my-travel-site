import { Metadata } from "next";
import Image from "next/image";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading, ModernSection } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  Award,
  Users,
  Globe,
  Headphones,
  Shield,
  Heart,
  Building2,
  Calendar,
  TrendingUp,
  Star,
  MapPin,
  Plane,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `آشنایی با آژانس مسافرتی ${SITE_CONFIG.name}، تاریخچه، چشم‌انداز و تعهد ما به مسافران.`,
};

// Team Members
const TEAM_MEMBERS = [
  {
    name: "مسعود کریمی",
    role: "مدیر عامل",
    description: "بنیانگذار و مدیر عامل ریوان سفر با بیش از ۱۵ سال تجربه در صنعت گردشگری",
    image: "/images/team/ceo.jpg",
  },
  {
    name: "سرنا محمدی",
    role: "مدیر عملیات",
    description: "مسئول هماهنگی تورها و مدیریت تیم مشاوران",
    image: "/images/team/operations.jpg",
  },
  {
    name: "علی رضایی",
    role: "سرپرست مشاوران",
    description: "کارشناس ارشد تورهای خارجی و داخلی",
    image: "/images/team/senior-advisor.jpg",
  },
  {
    name: "زهرا کرمی",
    role: "مسئول بازاریابی",
    description: "متخصص در طراحی کمپین‌های تبلیغاتی",
    image: "/images/team/marketing.jpg",
  },
];

// Value Cards
function ValueCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <Card variant="hoverable" className="p-6 text-center group">
      <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-bold text-lg text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
    </Card>
  );
}

// Team Member Card
function TeamMemberCard({ member }: { member: (typeof TEAM_MEMBERS)[0] }) {
  return (
    <Card variant="bordered" className="p-6 text-center hover:shadow-lg transition-shadow">
      <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="96px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <h3 className="font-bold text-lg text-stone-900 mb-1">{member.name}</h3>
      <p className="text-sm text-primary-600 font-medium mb-2">{member.role}</p>
      <p className="text-sm text-stone-600 leading-relaxed">{member.description}</p>
    </Card>
  );
}

// Stats Card
function StatsCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <Card variant="glass" className="p-4 text-center border border-white/20">
      <Icon className="w-6 h-6 mx-auto mb-2 text-secondary-400" />
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-stone-300">{label}</div>
    </Card>
  );
}

// Timeline Item
function TimelineItem({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className="relative pl-8 pb-6">
      <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-primary-500 border-4 border-white shadow-md" />
      <div className="absolute left-3 top-0 h-full w-1 bg-primary-200" />
      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
        <div className="text-xs text-primary-600 font-bold mb-1">{year}</div>
        <h4 className="font-bold text-stone-900 mb-1">{title}</h4>
        <p className="text-sm text-stone-600">{description}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "درباره ما" }]} className="mb-4" />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
                آژانس مسافرتی {SITE_CONFIG.name}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                با بیش از ۱۵ سال تجربه در صنعت گردشگری، {SITE_CONFIG.name} همراه شماست تا سفری بی‌دغدغه،
                ایمن و به‌یادماندنی را تجربه کنید. از تورهای داخلی تا مقاصد بین‌المللی، ما همواره بهترین را ارائه می‌دهیم.
              </p>
              <div className="flex gap-4 mt-6">
                <Button asChild variant="cta" size="lg">
                  <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
                    تماس با ما
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#story">
                    داستان ما
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about/about-office.jpg"
                alt="دفتر ریوان سفر"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </Section>

        {/* Mission and Vision */}
        <ModernSection pattern="dots" decorative>
          <SectionHeading title="مأموریت و چشم‌انداز" subtitle="هدف ما، سفر کردن آسان و مطمئن برای همه است" />
          <div className="grid md:grid-cols-2 gap-6">
            <ValueCard
              icon={Heart}
              title="مسافر در مرکز توجه"
              text="تمام تصمیمات ما بر اساس نیاز، بودجه و سلیقه‌ی شما گرفته می‌شود. رضایت مسافران بزرگ‌ترین سرمایه‌ی ماست."
            />
            <ValueCard
              icon={Shield}
              title="اعتبار و اطمینان"
              text="با مجوز رسمی از سازمان میراث فرهنگی و گردشگری و نماد اعتماد الکترونیک، خیالتان از بابت خرید تور راحت است."
            />
            <ValueCard
              icon={Globe}
              title="مقاصد متنوع"
              text="ترکیه، اروپا، آسیا و سراسر ایران؛ مجموعه‌ای گسترده از تورهای داخلی و خارجی را یکجا ببینید."
            />
            <ValueCard
              icon={Headphones}
              title="پشتیبانی شبانه‌روزی"
              text="تیم مشاوران ما در تمام مراحل سفر — از انتخاب تور تا بازگشت — کنارتان خواهند بود."
            />
          </div>
        </ModernSection>

        {/* Stats Section */}
        <Section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <SectionHeading title="دلایل انتخاب ما" subtitle="چرا مسافران به ما اعتماد می‌کنند" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <StatsCard icon={Award} value="۱۵+" label="سال تجربه" />
            <StatsCard icon={Users} value="۲۰,۰۰۰+" label="مسافر راضی" />
            <StatsCard icon={Globe} value="۱۵۰+" label="مقصد گردشگری" />
            <StatsCard icon={Heart} value="۹۸٪" label="رضایت مشتری" />
          </div>
        </Section>

        {/* Story Section */}
        <Section id="story" className="bg-stone-50">
          <SectionHeading title="داستان ما" subtitle="از یک دفتر کوچک تا مجموعه‌ای مورد اعتماد" />
          <div className="max-w-4xl mx-auto space-y-6 text-stone-700 leading-loose">
            <Card variant="bordered" className="p-6">
              <p className="mb-4">
                {SITE_CONFIG.name} از سال ۱۳۸۹ کار خود را با یک تیم کوچک اما پرانرژی آغاز کرد. هدف ما از همان روز اول ساده بود:
                ارائه‌ی تجربه‌ی سفری روان و بدون استرس به هموطنان عزیز.
              </p>
              <p className="mb-4">
                امروز با افتخار به یکی از آژانس‌های شناخته‌شده در حوزه‌ی تورهای داخلی و خارجی تبدیل شدیم. تیم ما شامل کارشناسان مجرب
                بخش‌های مختلف از جمله رزرواسیون، ویزا، ترانسفر و پشتیبانی است که هر کدام با تخصص خود، قطعه‌ای از پازل سفر شما را کامل می‌کنند.
              </p>
              <p>
                ما معتقدیم سفر فقط جابجایی نیست؛ سفر یعنی تجربه‌ی زندگی، یعنی خاطره‌سازی و یعنی کشف دوباره‌ی خودمان. این باور را در
                هر مرحله از همکاری با شما به کار می‌بندیم.
              </p>
            </Card>
          </div>
        </Section>

        {/* Timeline */}
        <Section>
          <SectionHeading title="گذر زمان" subtitle="مراحل رشد و توسعه ریوان سفر" />
          <div className="max-w-3xl mx-auto relative">
            <TimelineItem
              year="۱۳۸۹"
              title="تاسیس ریوان سفر"
              description="آغاز کار با یک دفتر کوچک در تهران و تیمی ۵ نفره"
            />
            <TimelineItem
              year="۱۳۹۲"
              title="اولین تور خارجی"
              description="راه‌اندازی تورهای ترکیه و آغاز فعالیت بین‌المللی"
            />
            <TimelineItem
              year="۱۳۹۵"
              title="گسترش فعالیت‌ها"
              description="افزایش تیم به ۲۰ نفر و راه‌اندازی تورهای اروپایی"
            />
            <TimelineItem
              year="۱۳۹۸"
              title="دفاتر استانی"
              description="تاسیس شعب در شهرهای بزرگ ایران"
            />
            <TimelineItem
              year="۱۴۰۰"
              title="پلتفرم آنلاین"
              description="راه‌اندازی وب‌سایت و سیستم رزرو آنلاین"
            />
            <TimelineItem
              year="۱۴۰۳"
              title="نسل جدید"
              description="مدرن‌سازی کامل برند و راه‌اندازی پلتفرم جدید"
            />
          </div>
        </Section>

        {/* Team Section */}
        <ModernSection pattern="lines" decorative>
          <SectionHeading title="تیم ما" subtitle="با کارشناسان مجرب ریوان سفر آشنا شوید" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </ModernSection>

        {/* Partners Section */}
        <Section className="bg-stone-50">
          <SectionHeading title="همکاران ما" subtitle="شركت‌ها و آژانس‌های همکار" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: "ایرلاین ماهان", logo: "/images/partners/mahan.png" },
              { name: "ایرلاین ایران ایر", logo: "/images/partners/iranair.png" },
              { name: "هتل‌های بین‌المللی", logo: "/images/partners/hotels.png" },
              { name: "تور اپراتورها", logo: "/images/partners/operators.png" },
              { name: "شركت‌های بیمه", logo: "/images/partners/insurance.png" },
            ].map((partner, index) => (
              <Card key={index} variant="bordered" className="p-6 flex items-center justify-center h-24">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={40}
                  className="object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all"
                />
              </Card>
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section className="bg-gradient-to-br from-secondary-50 via-white to-accent-50">
          <Card variant="gradient" className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
              آماده‌اید سفر کنید؟
            </h2>
            <p className="text-lg text-stone-600 mb-6 max-w-2xl mx-auto">
              تیم مشاوران ما آماده‌اند تا بهترین تور را برای شما پیدا کنند. کافیست با ما تماس بگیرید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="lg">
                <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
                  تماس تلفنی
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">
                  ارسال پیام
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
