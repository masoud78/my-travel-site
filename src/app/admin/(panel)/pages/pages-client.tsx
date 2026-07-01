"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { MediaPicker } from "@/components/admin/media-picker";
import type { MediaItem } from "@/components/admin/media-gallery";
import { StatusBadge } from "@/components/admin/status-badge";
import { createPage, updatePage, deletePage } from "@/lib/admin-actions";
import { toFa, formatJalali, slugify } from "@/lib/utils";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: string;
  campaignBanner?: string | null;
  campaignCta?: string | null;
  image?: string | null;
  parentId?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  status: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "PUBLISHED", label: "منتشر شده" },
  { value: "ARCHIVED", label: "بایگانی" },
];

const TYPE_OPTIONS = [
  { value: "STATIC", label: "صفحه ثابت" },
  { value: "LANDING", label: "لندینگ" },
];

interface PagesClientProps {
  pages: PageItem[];
  media: MediaItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  type: "STATIC",
  campaignBanner: "",
  campaignCta: "",
  metaTitle: "",
  metaDesc: "",
  keywords: "",
  ogImage: "",
  status: "PUBLISHED",
  order: "0",
};

export function PagesClient({ pages, media, canCreate, canUpdate, canDelete }: PagesClientProps) {
  const [items, setItems] = useState<PageItem[]>(pages);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<PageItem | null>(null);
  const [deleting, setDeleting] = useState<PageItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (page: PageItem) => {
    setEditing(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      type: page.type,
      campaignBanner: page.campaignBanner || "",
      campaignCta: page.campaignCta || "",
      metaTitle: page.metaTitle || "",
      metaDesc: page.metaDesc || "",
      keywords: page.keywords || "",
      ogImage: page.ogImage || "",
      status: page.status,
      order: String(page.order ?? 0),
    });
    setIsOpen(true);
  };

  const openDelete = (page: PageItem) => {
    setDeleting(page);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        content: form.content,
        type: form.type,
        campaignBanner: form.campaignBanner,
        campaignCta: form.campaignCta,
        metaTitle: form.metaTitle,
        metaDesc: form.metaDesc,
        keywords: form.keywords,
        ogImage: form.ogImage,
        status: form.status,
        order: Number(form.order || 0),
      };
      try {
        if (editing) {
          const updated = await updatePage(editing.id, data);
          setItems((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          );
        } else {
          const created = await createPage(data);
          setItems((prev) => [created, ...prev]);
        }
        setIsOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در ذخیره‌سازی");
      }
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      try {
        await deletePage(deleting.id);
        setItems((prev) => prev.filter((p) => p.id !== deleting.id));
        setIsDeleteOpen(false);
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const statusType = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "ARCHIVED":
        return "default";
      default:
        return "warning";
    }
  };

  const statusLabel = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.label || status;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">مدیریت محتوا</h1>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 ml-2" />
            صفحه جدید
          </Button>
        )}
      </div>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "title", title: "عنوان", render: (row) => <span className="font-medium">{row.title}</span> },
          { key: "slug", title: "اسلاگ", render: (row) => <span dir="ltr">{row.slug}</span> },
          { key: "type", title: "نوع" },
          {
            key: "status",
            title: "وضعیت",
            render: (row) => (
              <StatusBadge type={statusType(row.status)}>{statusLabel(row.status)}</StatusBadge>
            ),
          },
          {
            key: "order",
            title: "ترتیب",
            render: (row) => toFa(row.order ?? 0),
          },
          {
            key: "createdAt",
            title: "تاریخ",
            render: (row) => formatJalali(row.createdAt),
          },
        ]}
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={canDelete ? openDelete : undefined}
        onView={(row) =>
          window.open(row.type === "LANDING" ? `/lp/${row.slug}` : `/p/${row.slug}`, "_blank")
        }
        searchKeys={["title", "slug"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش صفحه" : "صفحه جدید"}
        onSubmit={handleSubmit}
        loading={isPending}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عنوان</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان صفحه"
              />
            </div>
            <div className="space-y-2">
              <Label>اسلاگ</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="about-us"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>نوع</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ترتیب</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>محتوا</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="محتوای صفحه (HTML/Markdown)"
              rows={10}
            />
          </div>
          {form.type === "LANDING" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>متن دکمه کمپین</Label>
                  <Input
                    value={form.campaignCta}
                    onChange={(e) => setForm({ ...form, campaignCta: e.target.value })}
                    placeholder="همین حالا رزرو کنید"
                  />
                </div>
                <div className="space-y-2">
                  <Label>لینک بنر کمپین</Label>
                  <Input
                    value={form.campaignBanner}
                    onChange={(e) => setForm({ ...form, campaignBanner: e.target.value })}
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>
              </div>
              <MediaPicker
                value={form.ogImage}
                onChange={(v) => setForm({ ...form, ogImage: v })}
                label="تصویر OG / بنر"
                media={media}
              />
            </>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عنوان سئو</Label>
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>توضیحات سئو</Label>
              <Input
                value={form.metaDesc}
                onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>کلمات کلیدی</Label>
            <Input
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="کلمه۱، کلمه۲"
            />
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف صفحه"
        description={`آیا از حذف «${deleting?.title || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
