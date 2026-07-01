import { Metadata } from "next";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "شعب و نمایندگی‌ها",
  description: "لیست شعب و نمایندگی‌های آژانس مسافرتی ریوان سفر در سراسر کشور.",
};

export default async function BranchesPage() {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: [{ isMain: "desc" }, { order: "asc" }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "شعب و نمایندگی‌ها" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">شعب و نمایندگی‌ها</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              ما در نزدیک‌ترین شعبه به شما منتظر حضورتان هستیم. برای مشاوره‌ی حضوری، لطفاً به شعبه‌ی مورد نظر مراجعه کنید.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="لیست شعب" subtitle="شعب فعال ریوان سفر" />
          {branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                        {b.name}
                        {b.isMain && (
                          <span className="inline-flex items-center gap-1 text-xs bg-accent-50 text-accent-700 px-2 py-0.5 rounded-md">
                            <Star className="w-3 h-3" />
                            شعبه اصلی
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">{b.address}</p>
                  <div className="space-y-2 text-sm">
                    <a
                      href={`tel:${b.phone}`}
                      className="flex items-center gap-2 text-stone-700 hover:text-secondary"
                      dir="ltr"
                    >
                      <Phone className="w-4 h-4" />
                      {b.phone}
                    </a>
                    {b.workHours && (
                      <div className="flex items-center gap-2 text-stone-500">
                        <Clock className="w-4 h-4" />
                        {b.workHours}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 mb-2">در حال حاضر اطلاعات شعبه‌ای ثبت نشده است.</p>
              <p className="text-sm text-stone-400">می‌توانید از طریق تماس تلفنی یا فرم تماس با ما در ارتباط باشید.</p>
            </div>
          )}
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
