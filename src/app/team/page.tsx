import { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { prisma } from "@/lib/prisma";
import { Phone, Award, User } from "lucide-react";

export const metadata: Metadata = {
  title: "تیم مشاوران",
  description: "آشنایی با مشاوران و کارشناسان مجرب آژانس مسافرتی ریوان سفر.",
};

export default async function TeamPage() {
  const consultants = await prisma.consultant.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "تیم مشاوران" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">تیم مشاوران ما</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              کارشناسان خبره‌ی ما آماده‌اند تا با توجه به بودجه و سلیقه‌ی شما، بهترین تور را پیشنهاد دهند.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="مشاوران تخصصی" subtitle="با ما تماس بگیرید و از تجربه‌ی سال‌ها کار بهره ببرید" />
          {consultants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultants.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center text-2xl font-bold shrink-0">
                      {c.avatar ? (
                        <Image
                          src={c.avatar}
                          alt={c.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-stone-900">{c.name}</h3>
                      <p className="text-sm text-primary font-medium">{c.title}</p>
                    </div>
                  </div>
                  {c.specialty && (
                    <div className="flex items-start gap-2 text-sm text-stone-600 mb-3">
                      <Award className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      {c.specialty}
                    </div>
                  )}
                  {c.bio && <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-3">{c.bio}</p>}
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-700"
                    >
                      <Phone className="w-4 h-4" />
                      {c.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500">اطلاعات تیم به‌زودی به‌روزرسانی می‌شود.</p>
            </div>
          )}
        </Section>
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
