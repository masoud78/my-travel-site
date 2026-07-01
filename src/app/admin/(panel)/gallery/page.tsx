import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getGalleryItems } from "@/lib/admin-actions";
import { GalleryClient } from "./gallery-client";

export default async function AdminGalleryPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "media.*")) redirect("/admin/login");

  const gallery = await getGalleryItems();
  return <GalleryClient data={gallery} canManage={hasPermission(user.role as Role, "media.*")} />;
}
