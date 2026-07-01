import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getHomeBlocks } from "@/lib/admin-actions";
import { HomeBlocksClient } from "./home-blocks-client";

export default async function AdminHomeBlocksPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "pages.read")) redirect("/admin/login");

  const blocks = await getHomeBlocks();

  return (
    <HomeBlocksClient
      blocks={blocks}
      canCreate={hasPermission(user.role as Role, "pages.create")}
      canUpdate={hasPermission(user.role as Role, "pages.update")}
      canDelete={hasPermission(user.role as Role, "pages.delete")}
    />
  );
}
