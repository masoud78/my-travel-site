"use client";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { getBranches } from "@/lib/admin-actions";

interface BranchesTabProps {
  data: Awaited<ReturnType<typeof getBranches>>;
}

export function BranchesTab({ data }: BranchesTabProps) {
  return (
    <DataTable
      data={data}
      columns={[
        { key: "name", title: "نام شعبه" },
        { key: "phone", title: "تلفن" },
        { key: "address", title: "آدرس" },
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
