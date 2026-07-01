"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { createRedirect, updateRedirect, deleteRedirect } from "@/lib/admin-actions";
import type { Redirect } from "@prisma/client";

type RedirectFormData = {
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
};

export function RedirectsTab({ data }: { data: Redirect[] }) {
  const [items, setItems] = useState<Redirect[]>(data);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Redirect | null>(null);
  const [deleting, setDeleting] = useState<Redirect | null>(null);
  const [form, setForm] = useState<RedirectFormData>({
    fromPath: "",
    toPath: "",
    statusCode: 301,
    isActive: true,
  });
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setForm({ fromPath: "", toPath: "", statusCode: 301, isActive: true });
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updateRedirect(editing.id, form);
          setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        } else {
          const created = await createRedirect(form);
          setItems((prev) => [created, ...prev]);
        }
        reset();
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در ذخیره‌سازی");
      }
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      try {
        await deleteRedirect(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const openEdit = (row: Redirect) => {
    setEditing(row);
    setForm({
      fromPath: row.fromPath,
      toPath: row.toPath,
      statusCode: row.statusCode,
      isActive: row.isActive,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 ml-2" />
          ریدایرکت جدید
        </Button>
      </div>
      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["fromPath", "toPath"]}
        columns={[
          { key: "fromPath", title: "از مسیر" },
          { key: "toPath", title: "به مسیر" },
          { key: "statusCode", title: "کد وضعیت" },
          {
            key: "hitCount",
            title: "تعداد بازدید",
            render: (row) => row.hitCount.toLocaleString("fa-IR"),
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
        onEdit={openEdit}
        onDelete={setDeleting}
      />

      <FormModal open={open} onClose={() => setOpen(false)} title={editing ? "ویرایش ریدایرکت" : "ریدایرکت جدید"} onSubmit={handleSubmit} loading={isPending}>
        <div className="space-y-4">
          <div>
            <Label>از مسیر</Label>
            <Input dir="ltr" value={form.fromPath} onChange={(e) => setForm({ ...form, fromPath: e.target.value })} />
          </div>
          <div>
            <Label>به مسیر</Label>
            <Input dir="ltr" value={form.toPath} onChange={(e) => setForm({ ...form, toPath: e.target.value })} />
          </div>
          <div>
            <Label>کد وضعیت</Label>
            <Input type="number" value={form.statusCode} onChange={(e) => setForm({ ...form, statusCode: Number(e.target.value) })} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <Label>فعال</Label>
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="حذف ریدایرکت"
        description={`آیا از حذف ریدایرکت «${deleting?.fromPath}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
