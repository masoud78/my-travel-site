import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CallbackForm } from "@/components/common/callback-form";
import { prisma } from "@/lib/prisma";
import { Briefcase, MapPin, Clock, Users } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "فرصت‌های شغلی",
  description: "مشاغل خالی و فرصت‌های همکاری با آژانس مسافرتی ریوان سفر.",
};

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const typeLabels: Record<string, string> = {
    FULL_TIME: "تمام‌وقت",
    PART_TIME: "پاره‌وقت",
    REMOTE: "دورکاری",
    INTERN: "کارآموزی",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "فرصت‌های شغلی" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">فرصت‌های شغلی</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              به تیم پرانرژی {SITE_CONFIG.name} بپیوندید. ما به دنبال افراد علاقه‌مند به گردشگری و خدمات مشتری هستیم.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="موقعیت‌های شغلی" />
          {jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-stone-900">{job.title}</h3>
                      <p className="text-sm text-primary font-medium">{job.department || "آژانس مسافرتی"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-stone-500 mb-4">
                    <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      {typeLabels[job.type] || job.type}
                    </span>
                    {job.city && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.city}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">{job.description}</p>
                  <CallbackForm
                    compact
                    subject={`درخواست همکاری: ${job.title}`}
                    className="!p-0 !border-0 !rounded-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 mb-2">در حال حاضر موقعیت شغلی فعالی نداریم.</p>
              <p className="text-sm text-stone-400">می‌توانید رزومه‌ی خود را از طریق فرم تماس برای ما ارسال کنید.</p>
            </div>
          )}
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
