import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getPages } from "@/lib/admin-actions";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "pages.read")) redirect("/admin/login");

  const pages = await getPages("CATEGORY");

  return (
    <CategoriesClient
      pages={pages}
      canCreate={hasPermission(user.role as Role, "pages.create")}
      canUpdate={hasPermission(user.role as Role, "pages.update")}
      canDelete={hasPermission(user.role as Role, "pages.delete")}
    />
  );
}
