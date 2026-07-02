import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

const vazirmatn = localFont({
  src: [
    { path: "../fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "پنل مدیریت | ریوان سفر",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin layout must NOT render <html>/<body> again — the root layout already does.
  // It only needs to ensure font CSS variables are inherited. We wrap in a div with
  // the font variable class so the admin pages keep Vazirmatn without duplicating tags.
  return (
    <div lang="fa" dir="rtl" className={vazirmatn.variable}>
      {children}
    </div>
  );
}
