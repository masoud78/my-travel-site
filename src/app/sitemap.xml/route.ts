import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/site-config";

export async function GET() {
  const baseUrl = SITE_CONFIG.url;

  const [tours, destinations, blogPosts, pages, jobs] = await Promise.all([
    prisma.tour.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.destination.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.job.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const routes = [
    { loc: baseUrl, lastmod: new Date().toISOString(), changefreq: "daily", priority: 1.0 },
    { loc: `${baseUrl}/tours`, lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.9 },
    { loc: `${baseUrl}/tours/domestic`, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/tours/turkey`, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/tours/asia`, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/tours/europe`, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/tours/special`, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: 0.7 },
    { loc: `${baseUrl}/team`, changefreq: "monthly", priority: 0.6 },
    { loc: `${baseUrl}/branches`, changefreq: "monthly", priority: 0.6 },
    { loc: `${baseUrl}/reviews`, changefreq: "weekly", priority: 0.7 },
    { loc: `${baseUrl}/gallery`, changefreq: "weekly", priority: 0.6 },
    { loc: `${baseUrl}/blog`, changefreq: "daily", priority: 0.8 },
    { loc: `${baseUrl}/faq`, changefreq: "monthly", priority: 0.7 },
    { loc: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.7 },
    { loc: `${baseUrl}/careers`, changefreq: "weekly", priority: 0.6 },
    { loc: `${baseUrl}/b2b`, changefreq: "monthly", priority: 0.6 },
    { loc: `${baseUrl}/sitemap`, changefreq: "monthly", priority: 0.5 },
    { loc: `${baseUrl}/cancellation`, changefreq: "yearly", priority: 0.5 },
    { loc: `${baseUrl}/terms`, changefreq: "yearly", priority: 0.5 },
    { loc: `${baseUrl}/privacy`, changefreq: "yearly", priority: 0.5 },
    ...tours.map((t) => ({ loc: `${baseUrl}/tours/${t.slug}`, lastmod: t.updatedAt.toISOString(), changefreq: "daily", priority: 0.9 })),
    ...destinations.map((d) => ({ loc: `${baseUrl}/tours?destination=${d.slug}`, lastmod: d.updatedAt.toISOString(), changefreq: "weekly", priority: 0.7 })),
    ...blogPosts.map((b) => ({ loc: `${baseUrl}/blog/${b.slug}`, lastmod: b.updatedAt.toISOString(), changefreq: "monthly", priority: 0.8 })),
    ...pages.map((p) => ({ loc: `${baseUrl}/p/${p.slug}`, lastmod: p.updatedAt.toISOString(), changefreq: "monthly", priority: 0.7 })),
    ...jobs.map((j) => ({ loc: `${baseUrl}/careers/${j.slug}`, lastmod: j.updatedAt.toISOString(), changefreq: "weekly", priority: 0.7 })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
