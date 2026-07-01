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
import { createBlogPost, updateBlogPost, deleteBlogPost, type getBlogPosts } from "@/lib/admin-actions";
import { formatDateTime } from "@/lib/jalali";
import { toFa, formatPrice, slugify } from "@/lib/utils";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { JalaliDatePicker } from "@/components/admin/jalali-date-picker";

type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "PUBLISHED", label: "منتشر شده" },
  { value: "ARCHIVED", label: "بایگانی" },
];

interface BlogClientProps {
  posts: BlogPost[];
  media: MediaItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  readingTime: "",
  category: "",
  tags: "",
  status: "DRAFT",
  metaTitle: "",
  metaDesc: "",
  publishedAt: null as Date | string | null,
};

export function BlogClient({ posts, media, canCreate, canUpdate, canDelete }: BlogClientProps) {
  const [items, setItems] = useState<BlogPost[]>(posts);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      thumbnail: post.thumbnail || "",
      readingTime: post.readingTime ? String(post.readingTime) : "",
      category: post.category,
      tags: post.tags ? JSON.parse(post.tags).join(", ") : "",
      status: post.status,
      metaTitle: post.metaTitle || "",
      metaDesc: post.metaDesc || "",
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    });
    setIsOpen(true);
  };

  const openDelete = (post: BlogPost) => {
    setDeleting(post);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        thumbnail: form.thumbnail,
        readingTime: form.readingTime ? Number(form.readingTime) : undefined,
        category: form.category || "GENERAL",
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: form.status,
        metaTitle: form.metaTitle,
        metaDesc: form.metaDesc,
        publishedAt: form.publishedAt ? new Date(form.publishedAt) : undefined,
      };
      try {
        if (editing) {
          const updated = await updateBlogPost(editing.id, data);
          setItems((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          );
        } else {
          const created = await createBlogPost(data);
          setItems((prev) => [{ ...created, author: null }, ...prev]);
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
        await deleteBlogPost(deleting.id);
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
        <h1 className="text-2xl font-bold text-stone-900">مدیریت بلاگ</h1>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 ml-2" />
            مقاله جدید
          </Button>
        )}
      </div>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: "title",
            title: "عنوان",
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.thumbnail && (
                  <img
                    src={row.thumbnail}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                  />
                )}
                <span className="font-medium">{row.title}</span>
              </div>
            ),
          },
          { key: "author", title: "نویسنده", render: (row) => row.author?.name || "—" },
          {
            key: "status",
            title: "وضعیت",
            render: (row) => (
              <StatusBadge type={statusType(row.status)}>{statusLabel(row.status)}</StatusBadge>
            ),
          },
          {
            key: "views",
            title: "بازدید",
            render: (row) => toFa(row.views),
          },
          {
            key: "createdAt",
            title: "تاریخ",
            render: (row) => formatDateTime(row.createdAt),
          },
        ]}
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={canDelete ? openDelete : undefined}
        onView={(row) => window.open(`/blog/${row.slug}`, "_blank")}
        searchKeys={["title", "category", "excerpt"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش مقاله" : "مقاله جدید"}
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
                placeholder="عنوان مقاله"
              />
            </div>
            <div className="space-y-2">
              <Label>اسلاگ</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="my-article"
                dir="ltr"
              />
            </div>
          </div>
          <MediaPicker
            value={form.thumbnail}
            onChange={(v) => setForm({ ...form, thumbnail: v })}
            label="تصویر شاخص"
            media={media}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="GENERAL"
              />
            </div>
            <div className="space-y-2">
              <Label>زمان مطالعه (دقیقه)</Label>
              <Input
                type="number"
                value={form.readingTime}
                onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v })}
              >
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
          </div>
          <div className="space-y-2">
            <Label>برچسب‌ها (با کاما جدا کنید)</Label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="آنتالیا، ترکیه، تور"
            />
          </div>
          <div className="space-y-2">
            <Label>خلاصه</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="خلاصه کوتاه مقاله"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>محتوا</Label>
            <RichTextEditor
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
              placeholder="محتوای مقاله"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JalaliDatePicker
              label="تاریخ انتشار"
              value={form.publishedAt}
              onChange={(d) => setForm({ ...form, publishedAt: d })}
              showTime
            />
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
        </div>
      </FormModal>

      <DeleteDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف مقاله"
        description={`آیا از حذف «${deleting?.title || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
