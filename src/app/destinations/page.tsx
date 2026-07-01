import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { prisma } from "@/lib/prisma";
import { MapPin, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "مقاصد گردشگری | ریوان سفر",
  description: "مقاصد داخلی و خارجی محبوب ریوان سفر. از آنتالیا و استانبول تا دبی، تفلیس، رم و پاریس.",
};

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  const roots = destinations.filter((d) => !d.parentId);
  const childrenByParent = new Map<string, typeof destinations>();
  for (const d of destinations) {
    if (d.parentId) {
      if (!childrenByParent.has(d.parentId)) childrenByParent.set(d.parentId, []);
      childrenByParent.get(d.parentId)!.push(d);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src="/images/destinations/destinations-hero.jpg"
            alt="مقاصد گردشگری"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">مقاصد گردشگری</h1>
              <p className="text-lg text-stone-100">مقاصد محبوب داخلی و خارجی را کشف کنید</p>
            </div>
          </div>
        </section>

        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "مقاصد" }]} className="mb-4" />
          <SectionHeading title="مقاصد ما" subtitle="با مقاصد متنوع ما، سفری متناسب با سلیقه خود انتخاب کنید" />

          <div className="space-y-10">
            {roots.map((root) => {
              const children = childrenByParent.get(root.id) || [];
              return (
                <div key={root.id}>
                  <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {root.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DestinationCard destination={root} isRoot />
                    {children.map((child) => (
                      <DestinationCard key={child.id} destination={child} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}

function DestinationCard({
  destination,
  isRoot = false,
}: {
  destination: { id: string; name: string; slug: string; description?: string | null; image?: string | null };
  isRoot?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative rounded-2xl overflow-hidden border border-stone-200 hover:border-primary-200 hover:shadow-lg transition-all ${
        isRoot ? "ring-2 ring-primary/10" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
          {destination.description && (
            <p className="text-sm text-stone-100 line-clamp-2 opacity-90">{destination.description}</p>
          )}
        </div>
      </div>
      <div className="p-3 bg-white flex items-center justify-between">
        <span className="text-sm font-medium text-stone-600">مشاهده تورها</span>
        <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
