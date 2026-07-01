"use client";

import { useState, useTransition } from "react";
import { DataTable } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteNewsletter } from "@/lib/admin-actions";
import type { Newsletter } from "@prisma/client";

export function NewslettersTab({ data }: { data: Newsletter[] }) {
  const [items, setItems] = useState<Newsletter[]>(data);
  const [deleting, setDeleting] = useState<Newsletter | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      try {
        await deleteNewsletter(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  return (
    <div className="space-y-4">
      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["email", "name"]}
        columns={[
          { key: "email", title: "ایمیل" },
          { key: "name", title: "نام" },
          {
            key: "createdAt",
            title: "تاریخ عضویت",
            render: (row) => new Intl.DateTimeFormat("fa-IR").format(new Date(row.createdAt)),
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
        onDelete={setDeleting}
      />

      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="حذف عضو خبرنامه"
        description={`آیا از حذف «${deleting?.email}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
