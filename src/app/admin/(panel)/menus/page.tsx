import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getMenus, getMenuSettings } from "@/lib/admin-actions";
import { MenuManager } from "./components/menu-manager";
import { MenuSettingsClient } from "./components/menu-settings";

export default async function AdminMenusPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "menus.read")) redirect("/admin/login");

  const [menus, settings] = await Promise.all([getMenus(), getMenuSettings()]);

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-stone-900">مدیریت منوها</h1>
        <MenuManager data={menus} />
      </div>

      <div className="border-t border-stone-200 pt-8">
        <MenuSettingsClient
          settings={settings}
          canUpdate={hasPermission(user.role as Role, "menus.update")}
          canDelete={hasPermission(user.role as Role, "menus.delete")}
        />
      </div>
    </div>
  );
}
