"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { StatusBadge } from "@/components/admin/status-badge";
import { ImagePicker } from "@/components/admin/image-picker";
import { createMenu, updateMenu, deleteMenu } from "@/lib/admin-actions";
import type { Menu } from "@prisma/client";

type MenuWithParent = Menu & { parent?: { label: string } | null };

type MenuFormData = {
  location: string;
  label: string;
  url: string;
  icon: string;
  image: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
};

const LOCATIONS = [
  { value: "HEADER", label: "منوی بالا" },
  { value: "FOOTER", label: "فوتر" },
  { value: "MEGA", label: "مگامنو" },
  { value: "MOBILE", label: "موبایل" },
];

export function MenuManager({ data }: { data: MenuWithParent[] }) {
  const [items, setItems] = useState<MenuWithParent[]>(data);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuWithParent | null>(null);
  const [deleting, setDeleting] = useState<MenuWithParent | null>(null);
  const [form, setForm] = useState<MenuFormData>({
    location: "HEADER",
    label: "",
    url: "",
    icon: "",
    image: "",
    parentId: null,
    order: 0,
    isActive: true,
  });
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setForm({ location: "HEADER", label: "", url: "", icon: "", image: "", parentId: null, order: 0, isActive: true });
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updateMenu(editing.id, form);
          setItems((prev) => prev.map((i) => (i.id === updated.id ? { ...updated, parent: i.parent } : i)));
        } else {
          const created = await createMenu(form);
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
        await deleteMenu(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const openEdit = (row: MenuWithParent) => {
    setEditing(row);
    setForm({
      location: row.location,
      label: row.label,
      url: row.url,
      icon: row.icon || "",
      image: row.image || "",
      parentId: row.parentId,
      order: row.order,
      isActive: row.isActive,
    });
    setOpen(true);
  };

  const parentOptions = useMemo(
    () => items.filter((m) => m.id !== editing?.id && !m.parentId),
    [items, editing]
  );

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
          آیتم منو جدید
        </Button>
      </div>
      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["label", "url", "location"]}
        columns={[
          { key: "label", title: "برچسب" },
          { key: "url", title: "URL" },
          { key: "location", title: "موقعیت" },
          {
            key: "parentId",
            title: "والد",
            render: (row) => row.parent?.label || "—",
          },
          { key: "order", title: "ترتیب" },
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

      <FormModal open={open} onClose={() => setOpen(false)} title={editing ? "ویرایش منو" : "منوی جدید"} onSubmit={handleSubmit} loading={isPending}>
        <div className="space-y-4">
          <div>
            <Label>موقعیت</Label>
            <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>برچسب</Label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </div>
          <div>
            <Label>URL</Label>
            <Input dir="ltr" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div>
            <Label>آیکون (نام آیکون lucide)</Label>
            <Input dir="ltr" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          </div>
          <ImagePicker value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="تصویر (مگامنو)" />
          <div>
            <Label>والد</Label>
            <Select value={form.parentId || "__root__"} onValueChange={(v) => setForm({ ...form, parentId: v === "__root__" ? null : v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__root__">بدون والد</SelectItem>
                {parentOptions.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ترتیب</Label>
            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
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
        title="حذف منو"
        description={`آیا از حذف «${deleting?.label}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
