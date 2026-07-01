"use client";

import { useState, useTransition } from "react";
import { Plus, LayoutGrid, TreePine } from "lucide-react";
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
import { ImagePicker } from "@/components/admin/image-picker";
import { StatusBadge } from "@/components/admin/status-badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createPage, updatePage, deletePage } from "@/lib/admin-actions";
import { formatJalali, slugify } from "@/lib/utils";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: string;
  image?: string | null;
  parentId?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  status: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  parent: { id: string; title: string; slug: string } | null;
};

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "PUBLISHED", label: "منتشر شده" },
  { value: "ARCHIVED", label: "بایگانی" },
];

interface CategoriesClientProps {
  pages: PageItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  image: "",
  parentId: "",
  metaTitle: "",
  metaDesc: "",
  keywords: "",
  status: "PUBLISHED",
  order: "0",
};

export function CategoriesClient({ pages, canCreate, canUpdate, canDelete }: CategoriesClientProps) {
  const [items, setItems] = useState<PageItem[]>(pages);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<PageItem | null>(null);
  const [deleting, setDeleting] = useState<PageItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const parentOptions = items.filter((p) => !editing || p.id !== editing.id);

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
      image: page.image || "",
      parentId: page.parentId || "",
      metaTitle: page.metaTitle || "",
      metaDesc: page.metaDesc || "",
      keywords: page.keywords || "",
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
        type: "CATEGORY",
        image: form.image,
        parentId: form.parentId || null,
        metaTitle: form.metaTitle,
        metaDesc: form.metaDesc,
        keywords: form.keywords,
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
          setItems((prev) => [created as unknown as PageItem, ...prev]);
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
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-primary" />
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-sm text-stone-500 mt-1">صفحات دسته‌بندی، والد/فرزند و محتوای سئو</p>
        </div>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 ml-2" />
            دسته‌بندی جدید
          </Button>
        )}
      </div>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: "image",
            title: "تصویر",
            render: (row) =>
              row.image ? (
                <img
                  src={row.image}
                  alt={row.title}
                  className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs">
                  —
                </div>
              ),
          },
          { key: "title", title: "عنوان", render: (row) => <span className="font-medium">{row.title}</span> },
          { key: "slug", title: "اسلاگ", render: (row) => <span dir="ltr">{row.slug}</span> },
          {
            key: "parent",
            title: "والد",
            render: (row) => row.parent?.title || <span className="text-stone-400">بدون والد</span>,
          },
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
            render: (row) => row.order ?? 0,
          },
          {
            key: "createdAt",
            title: "تاریخ",
            render: (row) => formatJalali(row.createdAt),
          },
        ]}
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={canDelete ? openDelete : undefined}
        searchKeys={["title", "slug"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
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
                placeholder="عنوان دسته‌بندی"
              />
            </div>
            <div className="space-y-2">
              <Label>اسلاگ</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="turkey-tours"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label>والد</Label>
              <Select
                value={form.parentId || "none"}
                onValueChange={(v) => setForm({ ...form, parentId: v === "none" ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="بدون والد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون والد</SelectItem>
                  {parentOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
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

          <ImagePicker
            value={form.image}
            onChange={(v) => setForm({ ...form, image: v })}
            label="تصویر دسته‌بندی"
          />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              محتوای صفحه
            </Label>
            <RichTextEditor
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
              placeholder="محتوای دسته‌بندی را اینجا بنویسید..."
            />
          </div>

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
        title="حذف دسته‌بندی"
        description={`آیا از حذف «${deleting?.title || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
