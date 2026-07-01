"use client";

import { useState, useTransition } from "react";
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
import { createBanner, updateBanner, deleteBanner } from "@/lib/admin-actions";
import type { Banner } from "@prisma/client";

type BannerFormData = {
  title: string;
  subtitle: string;
  image: string;
  url: string;
  buttonText: string;
  position: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
};

const POSITIONS = [
  { value: "HOME_MAIN", label: "اسلایدر اصلی" },
  { value: "HOME_OFFER", label: "پیشنهاد ویژه" },
  { value: "POPUP", label: "پاپ‌آپ" },
  { value: "ANNOUNCEMENT_BAR", label: "نوار اطلاع‌رسانی" },
];

export function BannersTab({ data }: { data: Banner[] }) {
  const [items, setItems] = useState<Banner[]>(data);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerFormData>({
    title: "",
    subtitle: "",
    image: "",
    url: "",
    buttonText: "",
    position: "HOME_MAIN",
    startDate: "",
    endDate: "",
    isActive: true,
    order: 0,
  });
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setForm({ title: "", subtitle: "", image: "", url: "", buttonText: "", position: "HOME_MAIN", startDate: "", endDate: "", isActive: true, order: 0 });
    setEditing(null);
    setOpen(false);
  };

  const toPayload = (form: BannerFormData) => ({
    title: form.title,
    subtitle: form.subtitle || undefined,
    image: form.image,
    url: form.url || undefined,
    buttonText: form.buttonText || undefined,
    position: form.position,
    startDate: form.startDate ? new Date(form.startDate) : undefined,
    endDate: form.endDate ? new Date(form.endDate) : undefined,
    isActive: form.isActive,
    order: form.order,
  });

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updateBanner(editing.id, toPayload(form));
          setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        } else {
          const created = await createBanner(toPayload(form) as Parameters<typeof createBanner>[0]);
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
        await deleteBanner(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const openEdit = (row: Banner) => {
    setEditing(row);
    setForm({
      title: row.title,
      subtitle: row.subtitle || "",
      image: row.image,
      url: row.url || "",
      buttonText: row.buttonText || "",
      position: row.position,
      startDate: row.startDate ? new Date(row.startDate).toISOString().slice(0, 16) : "",
      endDate: row.endDate ? new Date(row.endDate).toISOString().slice(0, 16) : "",
      isActive: row.isActive,
      order: row.order,
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
          بنر جدید
        </Button>
      </div>
      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["title", "position", "url"]}
        columns={[
          { key: "title", title: "عنوان" },
          { key: "position", title: "موقعیت" },
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

      <FormModal open={open} onClose={() => setOpen(false)} title={editing ? "ویرایش بنر" : "بنر جدید"} onSubmit={handleSubmit} loading={isPending}>
        <div className="space-y-4">
          <div>
            <Label>عنوان</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>زیرعنوان</Label>
            <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <ImagePicker value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="تصویر بنر" />
          <div>
            <Label>لینک</Label>
            <Input dir="ltr" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div>
            <Label>متن دکمه</Label>
            <Input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} />
          </div>
          <div>
            <Label>موقعیت</Label>
            <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>تاریخ شروع</Label>
              <Input type="datetime-local" dir="ltr" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <Label>تاریخ پایان</Label>
              <Input type="datetime-local" dir="ltr" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
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
        title="حذف بنر"
        description={`آیا از حذف بنر «${deleting?.title}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
