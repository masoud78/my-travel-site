"use client";

import { useState, useTransition } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { createMedia, deleteMedia } from "@/lib/admin-actions";
import { toFa, formatDateTime } from "@/lib/jalali";
import { formatPrice } from "@/lib/utils";
import type { Media } from "@prisma/client";

type MediaFormData = {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string;
  width?: number;
  height?: number;
};

const emptyForm: MediaFormData = {
  filename: "",
  originalName: "",
  mimeType: "image/jpeg",
  size: 0,
  url: "",
  altText: "",
};

const MIME_TYPES = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/avif", label: "AVIF" },
  { value: "video/mp4", label: "MP4" },
  { value: "application/pdf", label: "PDF" },
];

function guessMimeType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "mp4":
      return "video/mp4";
    case "pdf":
      return "application/pdf";
    default:
      return "image/jpeg";
  }
}

function guessSize(url: string): number {
  // Simulated size since we only store URL uploads.
  return Math.floor(Math.random() * 500_000) + 50_000;
}

export function MediaClient({ data, canManage }: { data: Media[]; canManage: boolean }) {
  const [items, setItems] = useState<Media[]>(data);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Media | null>(null);
  const [form, setForm] = useState<MediaFormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setForm(emptyForm);
    setOpen(false);
  };

  const handleUrlChange = (url: string) => {
    setForm((prev) => ({
      ...prev,
      url,
      filename: url.split("/").pop()?.split("?")[0] || prev.filename,
      mimeType: guessMimeType(url),
      size: guessSize(url),
    }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const created = await createMedia({
          filename: form.filename || form.url.split("/").pop()?.split("?")[0] || "upload",
          originalName: form.originalName || form.filename,
          mimeType: form.mimeType,
          size: form.size || guessSize(form.url),
          url: form.url,
          altText: form.altText || undefined,
          width: form.width,
          height: form.height,
        });
        setItems((prev) => [created, ...prev]);
        reset();
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در آپلود رسانه");
      }
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      try {
        await deleteMedia(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">مدیریت رسانه</h1>
        {canManage && (
          <Button
            onClick={() => {
              reset();
              setOpen(true);
            }}
          >
            <Upload className="w-4 h-4 ml-2" />
            آپلود رسانه
          </Button>
        )}
      </div>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        searchKeys={["filename", "originalName", "mimeType", "altText"]}
        columns={[
          {
            key: "preview",
            title: "پیش‌نمایش",
            render: (row) =>
              row.mimeType.startsWith("image/") ? (
                <img src={row.url} alt={row.altText || ""} className="w-16 h-10 object-cover rounded border border-stone-200" />
              ) : (
                <span className="text-xs text-stone-500">{row.mimeType}</span>
              ),
          },
          { key: "filename", title: "نام فایل" },
          { key: "mimeType", title: "نوع" },
          {
            key: "size",
            title: "حجم",
            render: (row) => formatPrice(Math.round(row.size / 1024)) + " کیلوبایت",
          },
          {
            key: "createdAt",
            title: "تاریخ آپلود",
            render: (row) => formatDateTime(row.createdAt),
          },
        ]}
        onDelete={canManage ? setDeleting : undefined}
      />

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="آپلود رسانه (شبیه‌سازی با URL)"
        onSubmit={handleSubmit}
        loading={isPending}
      >
        <div className="space-y-4">
          <div>
            <Label>آدرس فایل (URL)</Label>
            <Input
              dir="ltr"
              value={form.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {form.url && (
            <div className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-3">
              <span className="text-xs text-stone-500 block mb-2">پیش‌نمایش</span>
              {form.mimeType.startsWith("image/") ? (
                <img src={form.url} alt="" className="max-h-40 rounded-lg object-contain" />
              ) : (
                <span className="text-sm text-stone-600">{form.mimeType}</span>
              )}
            </div>
          )}
          <div>
            <Label>نام فایل</Label>
            <Input dir="ltr" value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} />
          </div>
          <div>
            <Label>نام اصلی</Label>
            <Input value={form.originalName} onChange={(e) => setForm({ ...form, originalName: e.target.value })} />
          </div>
          <div>
            <Label>نوع فایل</Label>
            <Input dir="ltr" value={form.mimeType} onChange={(e) => setForm({ ...form, mimeType: e.target.value })} />
          </div>
          <div>
            <Label>متن جایگزین (ALT)</Label>
            <Input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>عرض (px)</Label>
              <Input
                type="number"
                value={form.width || ""}
                onChange={(e) => setForm({ ...form, width: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <div>
              <Label>ارتفاع (px)</Label>
              <Input
                type="number"
                value={form.height || ""}
                onChange={(e) => setForm({ ...form, height: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>
          <div>
            <Label>حجم (بایت)</Label>
            <Input
              type="number"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: Number(e.target.value) })}
            />
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="حذف رسانه"
        description={`آیا از حذف «${deleting?.filename || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
