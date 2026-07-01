"use client";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { getConsultants } from "@/lib/admin-actions";

interface ConsultantsTabProps {
  data: Awaited<ReturnType<typeof getConsultants>>;
}

export function ConsultantsTab({ data }: ConsultantsTabProps) {
  return (
    <DataTable
      data={data}
      columns={[
        { key: "name", title: "نام" },
        { key: "title", title: "سمت" },
        { key: "specialty", title: "تخصص" },
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
