import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getMenus } from "@/lib/admin-actions";
import { MenuManager } from "./components/menu-manager";

export default async function AdminMenusPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "menus.read")) redirect("/admin/login");

  const menus = await getMenus();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">مدیریت منوها</h1>
      <MenuManager data={menus} />
    </div>
  );
}
