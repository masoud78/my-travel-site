import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { RichText } from "@/components/common/rich-text";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/site-config";
import { truncate } from "@/lib/utils";

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findFirst({
    where: { slug, type: { in: ["PAGE", "CONTENT"] }, status: "PUBLISHED" },
  });

  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || truncate(page.content, 160),
    openGraph: page.ogImage ? { images: [{ url: page.ogImage }] } : undefined,
  };
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;

  const page = await prisma.page.findFirst({
    where: { slug, type: { in: ["PAGE", "CONTENT"] }, status: "PUBLISHED" },
  });

  if (!page) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: page.title }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">{page.title}</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              اطلاعات تکمیلی درباره‌ی {page.title} در {SITE_CONFIG.name}.
            </p>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
            {page.content ? (
              <RichText content={page.content} className="prose-fa max-w-none" />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-500">محتوای این صفحه به‌زودی تکمیل می‌شود.</p>
              </div>
            )}
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
