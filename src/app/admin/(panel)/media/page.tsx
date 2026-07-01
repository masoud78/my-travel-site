import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getMedia } from "@/lib/admin-actions";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "media.*")) redirect("/admin/login");

  const media = await getMedia();
  return <MediaClient data={media} canManage={hasPermission(user.role as Role, "media.*")} />;
}
