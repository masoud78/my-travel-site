import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { Section } from "@/components/common/section";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { RichText } from "@/components/common/rich-text";
import { ReviewForm } from "@/components/review/review-form";
import { formatJalaliDate } from "@/lib/jalali";
import { prisma } from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import { Clock, ArrowLeft, User, Tag, Star } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || truncate(post.excerpt || "", 160),
    openGraph: post.thumbnail ? { images: [{ url: post.thumbnail }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 6 },
    },
  });

  if (!post) return notFound();

  const tags = post.tags ? (JSON.parse(post.tags) as string[]) : [];
  const avgRating =
    post.reviews.length > 0
      ? (post.reviews.reduce((s, r) => s + r.rating, 0) / post.reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Section className="bg-stone-50">
          <Breadcrumb
            items={[
              { label: "بلاگ", href: "/blog" },
              { label: post.title },
            ]}
            className="mb-4"
          />
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 text-primary px-2.5 py-1 rounded-md">
                <Tag className="w-3.5 h-3.5" />
                {post.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
              {post.author?.name && (
                <span className="inline-flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatJalaliDate(post.publishedAt)}
                </span>
              )}
              {avgRating && (
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{avgRating} از ۵</span>
                  <span className="text-stone-400 mr-1">({post.reviews.length} نظر)</span>
                </div>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} دقیقه مطالعه
              </span>
            </div>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="max-w-3xl mx-auto">
            {post.thumbnail && (
              <div
                className="w-full aspect-video rounded-2xl bg-cover bg-center mb-8 border border-stone-200"
                style={{ backgroundImage: `url(${post.thumbnail})` }}
                role="img"
                aria-label={post.title}
              />
            )}

            {post.excerpt && (
              <p className="text-lg text-stone-700 leading-relaxed mb-8 border-r-4 border-primary pr-4">
                {post.excerpt}
              </p>
            )}

            <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 mb-8">
              <RichText content={post.content} className="prose-fa max-w-none" />
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-stone-100 text-stone-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4">نظرات خوانندگان</h2>
              {avgRating && (
                <p className="text-sm text-stone-500 mb-4">
                  میانگین امتیاز: <span className="font-semibold text-amber-500">{avgRating} از ۵</span>
                </p>
              )}
              {post.reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {post.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-stone-50 border border-stone-100"
                    >
                      <div className="flex items-center gap-1 text-amber-500 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      {review.title && (
                        <h4 className="font-bold text-stone-900 mb-1">{review.title}</h4>
                      )}
                      <p className="text-sm text-stone-600 leading-relaxed mb-3">{review.content}</p>
                      <div className="text-xs text-stone-400">{review.authorName}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm mb-6">هنوز نظری ثبت نشده است. اولین نظر را شما بنویسید.</p>
              )}
              <ReviewForm blogPostId={post.id} postTitle={post.title} />
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت به بلاگ
            </Link>
          </div>
        </Section>
      </main>
      <MobileCTABar />
    </div>
  );
}
