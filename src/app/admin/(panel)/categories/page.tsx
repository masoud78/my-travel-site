import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getTourCategories, getDestinations, getTours } from "@/lib/admin-actions";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "pages.read")) redirect("/admin/login");

  const [categories, destinations, tours] = await Promise.all([
    getTourCategories(),
    getDestinations(),
    getTours(),
  ]);

  return (
    <CategoriesClient
      categories={categories}
      destinations={destinations}
      tours={tours}
      canCreate={hasPermission(user.role as Role, "pages.create")}
      canUpdate={hasPermission(user.role as Role, "pages.update")}
      canDelete={hasPermission(user.role as Role, "pages.delete")}
    />
  );
}
