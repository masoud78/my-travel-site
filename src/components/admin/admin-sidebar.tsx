"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  MapPin,
  Hotel,
  Bus,
  FileText,
  Newspaper,
  Inbox,
  MessageSquare,
  Menu,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ImageIcon,
  Tags,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    name: string;
    roleLabel: string;
    role: string;
  };
  logoutAction: () => void;
}

const ADMIN_MENU = [
  { label: "داشبورد", href: "/admin/dashboard", icon: LayoutDashboard, perm: "*" },
  { label: "تورها", href: "/admin/tours", icon: Plane, perm: "tours.read" },
  { label: "مقصدها", href: "/admin/destinations", icon: MapPin, perm: "destinations.read" },
  { label: "هتل‌ها", href: "/admin/hotels", icon: Hotel, perm: "hotels.read" },
  { label: "حمل‌ونقل", href: "/admin/transports", icon: Bus, perm: "transports.read" },
  { label: "صفحات", href: "/admin/pages", icon: FileText, perm: "pages.read" },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Tags, perm: "pages.read" },
  { label: "بلاگ", href: "/admin/blog", icon: Newspaper, perm: "blog.read" },
  { label: "درخواست‌ها", href: "/admin/requests", icon: Inbox, perm: "requests.read" },
  { label: "نظرات", href: "/admin/reviews", icon: MessageSquare, perm: "reviews.read" },
  { label: "منوها", href: "/admin/menus", icon: Menu, perm: "menus.read" },
  { label: "رسانه", href: "/admin/media", icon: ImageIcon, perm: "media.*" },
  { label: "تنظیمات", href: "/admin/settings", icon: Settings, perm: "seo.*" },
  { label: "کاربران و تیم", href: "/admin/users", icon: Users, perm: "*" },
];

export function AdminSidebar({ user, logoutAction }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 right-0 h-full w-64 bg-white border-l border-stone-200 z-30 hidden md:flex flex-col shadow-sm">
      <div className="p-5 border-b border-stone-100">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
            ر
          </div>
          <div>
            <div className="font-bold text-stone-900 leading-tight">ریوان سفر</div>
            <div className="text-xs text-stone-500">پنل مدیریت</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {ADMIN_MENU.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href.split("?")[0]));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-primary-50 text-primary shadow-sm"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-stone-400"}`} />
                {item.label}
              </span>
              {active && <ChevronLeft className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-stone-600 font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-stone-900 truncate">{user.name}</div>
            <div className="text-xs text-stone-500 truncate">{user.roleLabel}</div>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 bg-white border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </form>
      </div>
    </aside>
  );
}
