"use client";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { getUsers } from "@/lib/admin-actions";
import type { Role } from "@/lib/auth";

interface UsersTabProps {
  data: Awaited<ReturnType<typeof getUsers>>;
  roleLabels: Record<Role, string>;
}

export function UsersTab({ data, roleLabels }: UsersTabProps) {
  return (
    <DataTable
      data={data}
      columns={[
        { key: "name", title: "نام" },
        { key: "email", title: "ایمیل" },
        {
          key: "role",
          title: "نقش",
          render: (row) => roleLabels[row.role as Role] || row.role,
        },
        {
          key: "isActive",
          title: "وضعیت",
          render: (row) =>
            row.isActive ? (
              <StatusBadge type="success">فعال</StatusBadge>
            ) : (
              <StatusBadge type="danger">غیرفعال</StatusBadge>
            ),
        },
      ]}
      keyExtractor={(row) => row.id}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  );
}
