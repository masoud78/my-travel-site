import { Metadata } from "next";
import Link from "next/link";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section, SectionHeading } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { prisma } from "@/lib/prisma";
import { formatJalaliDate } from "@/lib/jalali";
import { Clock, ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "بلاگ و راهنمای سفر",
  description: "مقالات، راهنماهای سفر و اخبار گردشگری از آژانس مسافرتی ریوان سفر.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 24,
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb items={[{ label: "بلاگ" }]} className="mb-4" />
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">بلاگ و راهنمای سفر</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              مقالات، نکات کاربردی و راهنماهای سفر را بخوانید و سفر بعدی‌تان را آگاهانه‌تر برنامه‌ریزی کنید.
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading title="آخرین مقالات" />
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
                      {post.thumbnail ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url(${post.thumbnail})` }}
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-primary-300" />
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                      {post.publishedAt && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatJalaliDate(post.publishedAt)}
                        </span>
                      )}
                      <span>{post.readingTime} دقیقه مطالعه</span>
                    </div>
                    <h2 className="font-bold text-lg text-stone-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      ادامه مطلب
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">هنوز مقاله‌ای منتشر نشده است.</p>
            </div>
          )}
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
