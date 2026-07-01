import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, ROLE_LABELS, type Role } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getJobs } from "@/lib/admin-actions";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "*")) redirect("/admin/login");

  const [users, jobs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    getJobs(),
  ]);

  return (
    <UsersClient
      users={users}
      jobs={jobs}
      roleLabels={ROLE_LABELS as unknown as Record<string, string>}
      canManageJobs={hasPermission(user.role as Role, "jobs.*")}
      canCreateJob={hasPermission(user.role as Role, "jobs.create")}
      canUpdateJob={hasPermission(user.role as Role, "jobs.update")}
      canDeleteJob={hasPermission(user.role as Role, "jobs.delete")}
    />
  );
}
