import { getTours, getDestinations, getTransports, getServiceTemplates } from "@/lib/admin-actions";
import { Suspense } from "react";
import ToursClient from "./tours-client";
import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";

export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const create = params.create === "1";
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "tours.read")) redirect("/admin/login");

  const [tours, destinations, transports, serviceTemplates] = await Promise.all([
    getTours(),
    getDestinations(),
    getTransports(),
    getServiceTemplates(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center">در حال بارگذاری...</div>}>
      <ToursClient
        initialTours={tours}
        initialDestinations={destinations}
        initialTransports={transports}
        serviceTemplates={serviceTemplates}
        create={create}
      />
    </Suspense>
  );
}
