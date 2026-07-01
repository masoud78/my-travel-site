"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { updateSetting, createSetting, deleteSetting } from "@/lib/admin-actions";
import type { Setting } from "@prisma/client";

type SettingFormData = {
  key: string;
  value: string;
  label: string;
  group: string;
  type: string;
};

const GROUPS = [
  { value: "GENERAL", label: "عمومی" },
  { value: "CONTACT", label: "تماس" },
  { value: "SEO", label: "سئو" },
  { value: "SOCIAL", label: "شبکه‌های اجتماعی" },
  { value: "APPEARANCE", label: "ظاهر" },
];

const TYPES = [
  { value: "TEXT", label: "متن" },
  { value: "NUMBER", label: "عدد" },
  { value: "BOOLEAN", label: "بله/خیر" },
  { value: "JSON", label: "JSON" },
  { value: "IMAGE", label: "تصویر" },
];

export function SettingsTab({ data }: { data: Setting[] }) {
  const [items, setItems] = useState<Setting[]>(data);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Setting | null>(null);
  const [deleting, setDeleting] = useState<Setting | null>(null);
  const [form, setForm] = useState<SettingFormData>({
    key: "",
    value: "",
    label: "",
    group: "GENERAL",
    type: "TEXT",
  });
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setForm({ key: "", value: "", label: "", group: "GENERAL", type: "TEXT" });
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updateSetting(editing.id, form.value);
          setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        } else {
          const created = await createSetting(form);
          setItems((prev) => [...prev, created].sort((a, b) => a.group.localeCompare(b.group) || a.key.localeCompare(b.key)));
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
        await deleteSetting(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const openEdit = (row: Setting) => {
    setEditing(row);
    setForm({
      key: row.key,
      value: row.value,
      label: row.label || "",
      group: row.group,
      type: row.type,
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
          تنظیم جدید
        </Button>
      </div>
      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["key", "label", "group", "value"]}
        columns={[
          { key: "key", title: "کلید" },
          { key: "label", title: "برچسب" },
          { key: "group", title: "گروه" },
          { key: "type", title: "نوع" },
          { key: "value", title: "مقدار", render: (row) => <span className="truncate max-w-xs block">{row.value}</span> },
        ]}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

      <FormModal open={open} onClose={() => setOpen(false)} title={editing ? "ویرایش تنظیم" : "تنظیم جدید"} onSubmit={handleSubmit} loading={isPending}>
        <div className="space-y-4">
          <div>
            <Label>کلید</Label>
            <Input dir="ltr" disabled={!!editing} value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
          </div>
          <div>
            <Label>برچسب</Label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>گروه</Label>
              <Select value={form.group} onValueChange={(v) => setForm({ ...form, group: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROUPS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>نوع</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>مقدار</Label>
            <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="حذف تنظیم"
        description={`آیا از حذف تنظیم «${deleting?.key}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
