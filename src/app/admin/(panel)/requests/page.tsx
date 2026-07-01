import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getContactRequests } from "@/lib/admin-actions";
import { RequestsClient } from "./requests-client";

export default async function AdminRequestsPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "requests.read")) redirect("/admin/login");

  const requests = await getContactRequests();

  return (
    <RequestsClient
      requests={requests}
      canUpdate={hasPermission(user.role as Role, "requests.update")}
      canDelete={hasPermission(user.role as Role, "requests.delete")}
    />
  );
}
