import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  MapPin,
  Hotel,
  Bus,
  FileText,
  Newspaper,
  Inbox,
  MessageSquare,
  Users,
  Eye,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, ROLE_LABELS, type Role } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [toursCount, destinationsCount, hotelsCount, transportsCount, pagesCount, blogCount, requestsCount, reviewsCount, usersCount] = await Promise.all([
    prisma.tour.count(),
    prisma.destination.count(),
    prisma.hotel.count(),
    prisma.transport.count(),
    prisma.page.count(),
    prisma.blogPost.count(),
    prisma.contactRequest.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "تورها", value: toursCount, icon: Plane, href: "/admin/tours", color: "bg-blue-50 text-blue-600" },
    { label: "مقاصد", value: destinationsCount, icon: MapPin, href: "/admin/destinations", color: "bg-emerald-50 text-emerald-600" },
    { label: "هتل‌ها", value: hotelsCount, icon: Hotel, href: "/admin/hotels", color: "bg-amber-50 text-amber-600" },
    { label: "حمل‌ونقل", value: transportsCount, icon: Bus, href: "/admin/transports", color: "bg-purple-50 text-purple-600" },
    { label: "صفحات", value: pagesCount, icon: FileText, href: "/admin/pages", color: "bg-rose-50 text-rose-600" },
    { label: "مقالات", value: blogCount, icon: Newspaper, href: "/admin/blog", color: "bg-cyan-50 text-cyan-600" },
    { label: "درخواست‌های جدید", value: requestsCount, icon: Inbox, href: "/admin/requests", color: "bg-orange-50 text-orange-600" },
    { label: "نظرات در انتظار", value: reviewsCount, icon: MessageSquare, href: "/admin/reviews", color: "bg-pink-50 text-pink-600" },
    { label: "کاربران", value: usersCount, icon: Users, href: "/admin/users", color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">داشبورد</h1>
          <p className="text-stone-500 mt-1">خوش آمدید، {user.name} — {ROLE_LABELS[user.role as Role]}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
            <Eye className="w-4 h-4" />
            مشاهده سایت
          </Link>
          <Link href="/admin/tours?create=1" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plane className="w-4 h-4" />
            تور جدید
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-stone-300 group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                <div className="text-sm text-stone-500 mt-1">{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RecentTours />
        <RecentRequests />
      </div>
    </div>
  );
}

async function RecentTours() {
  const tours = await prisma.tour.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { destination: { select: { name: true } } },
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-stone-900">آخرین تورها</h2>
        <Link href="/admin/tours" className="text-sm text-primary hover:underline">مشاهده همه</Link>
      </div>
      <div className="space-y-3">
        {tours.map((tour) => (
          <div key={tour.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
            <div>
              <div className="font-medium text-stone-900">{tour.title}</div>
              <div className="text-xs text-stone-500">{tour.destination?.name ?? "بدون مقصد"} • {tour.status === "PUBLISHED" ? "منتشر شده" : "پیش‌نویس"}</div>
            </div>
            <Link href={`/admin/tours?edit=${tour.id}`} className="text-sm text-primary hover:underline">ویرایش</Link>
          </div>
        ))}
        {tours.length === 0 && <p className="text-stone-400 text-sm">توری ثبت نشده است.</p>}
      </div>
    </div>
  );
}

async function RecentRequests() {
  const requests = await prisma.contactRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-stone-900">آخرین درخواست‌ها</h2>
        <Link href="/admin/requests" className="text-sm text-primary hover:underline">مشاهده همه</Link>
      </div>
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
            <div>
              <div className="font-medium text-stone-900">{req.name}</div>
              <div className="text-xs text-stone-500">{req.phone} • {req.type} • {req.status}</div>
            </div>
            <Link href={`/admin/requests?edit=${req.id}`} className="text-sm text-primary hover:underline">مشاهده</Link>
          </div>
        ))}
        {requests.length === 0 && <p className="text-stone-400 text-sm">درخواستی ثبت نشده است.</p>}
      </div>
    </div>
  );
}
