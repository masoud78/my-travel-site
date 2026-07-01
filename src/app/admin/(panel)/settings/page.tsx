import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getSettings, getRedirects } from "@/lib/admin-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsTab } from "./components/settings-tab";
import { RedirectsTab } from "./components/redirects-tab";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "seo.*")) redirect("/admin/login");

  const [settings, redirects] = await Promise.all([
    getSettings(),
    getRedirects(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">تنظیمات سایت</h1>
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="settings">تنظیمات</TabsTrigger>
          <TabsTrigger value="redirects">ریدایرکت‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsTab data={settings} />
        </TabsContent>
        <TabsContent value="redirects">
          <RedirectsTab data={redirects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
