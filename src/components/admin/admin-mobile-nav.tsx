"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

interface AdminMobileNavProps {
  user: { name: string; roleLabel: string };
  logoutAction: () => void;
}

const ADMIN_MENU_MOBILE = [
  { label: "داشبورد", href: "/admin/dashboard" },
  { label: "تورها", href: "/admin/tours" },
  { label: "مقصدها", href: "/admin/destinations" },
  { label: "هتل‌ها", href: "/admin/hotels" },
  { label: "حمل‌ونقل", href: "/admin/transports" },
  { label: "صفحات", href: "/admin/pages" },
  { label: "دسته‌بندی‌ها", href: "/admin/categories" },
  { label: "بلاگ", href: "/admin/blog" },
  { label: "درخواست‌ها", href: "/admin/requests" },
  { label: "نظرات", href: "/admin/reviews" },
  { label: "منوها", href: "/admin/menus" },
  { label: "رسانه", href: "/admin/media" },
  { label: "تنظیمات", href: "/admin/settings" },
  { label: "کاربران", href: "/admin/users" },
];

export function AdminMobileNav({ user, logoutAction }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b border-stone-200">
        <Link href="/admin/dashboard" className="font-bold text-stone-900">ریوان سفر</Link>
        <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-stone-100">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between p-4 border-b border-stone-200">
            <span className="font-bold text-stone-900">منوی مدیریت</span>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-stone-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {ADMIN_MENU_MOBILE.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    active ? "bg-primary-50 text-primary" : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 right-0 w-full p-4 border-t border-stone-100">
            <div className="text-sm font-semibold text-stone-900 mb-1">{user.name}</div>
            <div className="text-xs text-stone-500 mb-3">{user.roleLabel}</div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-sm text-red-600 bg-white border border-red-200 rounded-lg py-2 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
