import { redirect } from "next/navigation";
import { getCurrentUser, clearSessionCookie, ROLE_LABELS, type Role } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  async function logout() {
    "use server";
    await clearSessionCookie();
    redirect("/admin/login");
  }

  const userInfo = {
    name: user.name,
    role: user.role,
    roleLabel: ROLE_LABELS[user.role as Role],
  };

  return (
    <div className="min-h-screen bg-stone-50/80" dir="rtl">
      <AdminSidebar user={userInfo} logoutAction={logout} />
      <AdminMobileNav user={userInfo} logoutAction={logout} />
      <main className="md:mr-64 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
