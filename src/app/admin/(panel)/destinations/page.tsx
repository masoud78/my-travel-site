import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getDestinations } from "@/lib/admin-actions";
import AdminDestinationsClient from "./destinations-client";

export default async function AdminDestinationsPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "destinations.read")) redirect("/admin/login");

  const destinations = await getDestinations();

  return (
    <AdminDestinationsClient
      initialDestinations={destinations}
      canCreate={hasPermission(user.role as Role, "destinations.create")}
      canUpdate={hasPermission(user.role as Role, "destinations.update")}
      canDelete={hasPermission(user.role as Role, "destinations.delete")}
    />
  );
}
