import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "پنل مدیریت | ریوان سفر",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
