"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ImagePicker } from "@/components/admin/image-picker";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/admin-actions";
import { toFa, formatDateTime } from "@/lib/jalali";
import type { GalleryItem } from "@prisma/client";

type GalleryFormData = {
  title: string;
  image: string;
  thumbnail: string;
  destination: string;
  tourId: string;
  order: number;
};

const emptyForm: GalleryFormData = {
  title: "",
  image: "",
  thumbnail: "",
  destination: "",
  tourId: "",
  order: 0,
};

export function GalleryClient({ data, canManage }: { data: GalleryItem[]; canManage: boolean }) {
  const [items, setItems] = useState<GalleryItem[]>(data);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<GalleryFormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updateGalleryItem(editing.id, form);
          setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        } else {
          const created = await createGalleryItem(form);
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
        await deleteGalleryItem(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const openEdit = (row: GalleryItem) => {
    setEditing(row);
    setForm({
      title: row.title || "",
      image: row.image,
      thumbnail: row.thumbnail || "",
      destination: row.destination || "",
      tourId: row.tourId || "",
      order: row.order,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">مدیریت گالری</h1>
        {canManage && (
          <Button
            onClick={() => {
              reset();
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 ml-2" />
            تصویر جدید
          </Button>
        )}
      </div>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["title", "destination"]}
        columns={[
          { key: "title", title: "عنوان" },
          { key: "destination", title: "مقصد/برچسب" },
          {
            key: "image",
            title: "پیش‌نمایش",
            render: (row) =>
              row.image ? (
                <img src={row.image} alt="" className="w-16 h-10 object-cover rounded border border-stone-200" />
              ) : (
                "—"
              ),
          },
          {
            key: "order",
            title: "ترتیب",
            render: (row) => toFa(row.order),
          },
          {
            key: "createdAt",
            title: "تاریخ",
            render: (row) => formatDateTime(row.createdAt),
          },
        ]}
        onEdit={canManage ? openEdit : undefined}
        onDelete={canManage ? setDeleting : undefined}
      />

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "ویرایش تصویر گالری" : "تصویر جدید گالری"}
        onSubmit={handleSubmit}
        loading={isPending}
      >
        <div className="space-y-4">
          <div>
            <Label>عنوان</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <ImagePicker value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="تصویر اصلی" />
          <ImagePicker value={form.thumbnail} onChange={(v) => setForm({ ...form, thumbnail: v })} label="تصویر بندانگشتی" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>مقصد/برچسب</Label>
              <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </div>
            <div>
              <Label>شناسه تور</Label>
              <Input dir="ltr" value={form.tourId} onChange={(e) => setForm({ ...form, tourId: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>ترتیب</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="حذف تصویر گالری"
        description={`آیا از حذف تصویر «${deleting?.title || "بدون عنوان"}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
