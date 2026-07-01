"use client";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { getJobs } from "@/lib/admin-actions";

interface JobsTabProps {
  data: Awaited<ReturnType<typeof getJobs>>;
}

export function JobsTab({ data }: JobsTabProps) {
  return (
    <DataTable
      data={data}
      columns={[
        { key: "title", title: "عنوان" },
        { key: "type", title: "نوع" },
        { key: "department", title: "دپارتمان" },
        { key: "city", title: "شهر" },
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
