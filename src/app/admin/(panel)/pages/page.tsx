import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getPages, getMedia } from "@/lib/admin-actions";
import { PagesClient } from "./pages-client";

export default async function AdminPagesPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "pages.read")) redirect("/admin/login");

  const [pages, media] = await Promise.all([getPages(), getMedia()]);

  return (
    <PagesClient
      pages={pages}
      media={media}
      canCreate={hasPermission(user.role as Role, "pages.create")}
      canUpdate={hasPermission(user.role as Role, "pages.update")}
      canDelete={hasPermission(user.role as Role, "pages.delete")}
    />
  );
}
