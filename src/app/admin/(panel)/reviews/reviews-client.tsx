"use client";

import { useState, useTransition } from "react";
import { Plus, Star, Filter, Search } from "lucide-react";
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
import { StatusBadge } from "@/components/admin/status-badge";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsAdmin,
} from "@/lib/admin-actions";
import { formatJalali } from "@/lib/utils";

type ReviewItem = Awaited<ReturnType<typeof getReviewsAdmin>>[number];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "در انتظار" },
  { value: "APPROVED", label: "تأیید شده" },
  { value: "REJECTED", label: "رد شده" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "همه" },
  { value: "tour", label: "تور" },
  { value: "blog", label: "بلاگ" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "تاریخ" },
  { value: "rating", label: "امتیاز" },
  { value: "status", label: "وضعیت" },
];

interface ReviewsClientProps {
  reviews: ReviewItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const emptyForm = {
  authorName: "",
  authorEmail: "",
  authorPhone: "",
  rating: "5",
  title: "",
  content: "",
  tourId: "",
  tourTitle: "",
  blogPostId: "",
  postTitle: "",
  status: "PENDING",
};

export function ReviewsClient({ reviews, canCreate, canUpdate, canDelete }: ReviewsClientProps) {
  const [items, setItems] = useState<ReviewItem[]>(reviews);
  const [filters, setFilters] = useState({
    type: "all" as "all" | "tour" | "blog",
    status: "all" as "all" | "PENDING" | "APPROVED" | "REJECTED",
    sortBy: "createdAt" as "createdAt" | "rating" | "status",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ReviewItem | null>(null);
  const [deleting, setDeleting] = useState<ReviewItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (review: ReviewItem) => {
    setEditing(review);
    setForm({
      authorName: review.authorName,
      authorEmail: review.authorEmail || "",
      authorPhone: review.authorPhone || "",
      rating: String(review.rating),
      title: review.title || "",
      content: review.content,
      tourId: review.tourId || "",
      tourTitle: review.tourTitle || "",
      blogPostId: review.blogPostId || "",
      postTitle: review.postTitle || "",
      status: review.status,
    });
    setIsOpen(true);
  };

  const openDelete = (review: ReviewItem) => {
    setDeleting(review);
    setIsDeleteOpen(true);
  };

  const applyFilters = () => {
    startTransition(async () => {
      const filtered = await getReviewsAdmin(filters);
      setItems(filtered);
    });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        authorName: form.authorName,
        authorEmail: form.authorEmail,
        authorPhone: form.authorPhone,
        rating: Number(form.rating || 5),
        title: form.title,
        content: form.content,
        tourId: form.tourId || undefined,
        tourTitle: form.tourTitle,
        blogPostId: form.blogPostId || undefined,
        postTitle: form.postTitle,
        status: form.status,
      };
      try {
        if (editing) {
          const updated = await updateReview(editing.id, data);
          setItems((prev) =>
            prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
          );
        } else {
          const created = (await createReview(data)) as ReviewItem;
          setItems((prev) => [{ ...created, tour: null, blogPost: null }, ...prev]);
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
        await deleteReview(deleting.id);
        setItems((prev) => prev.filter((r) => r.id !== deleting.id));
        setIsDeleteOpen(false);
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const statusType = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning";
    }
  };

  const statusLabel = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.label || status;

  const targetLabel = (row: ReviewItem) => {
    if (row.tour) return `تور: ${row.tour.title}`;
    if (row.tourTitle) return `تور: ${row.tourTitle}`;
    if (row.blogPost) return `بلاگ: ${row.blogPost.title}`;
    if (row.postTitle) return `بلاگ: ${row.postTitle}`;
    return "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">مدیریت نظرات</h1>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 ml-2" />
            نظر جدید
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-stone-700 font-semibold">
          <Filter className="w-4 h-4" />
          فیلتر و مرتب‌سازی
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label>نوع</Label>
            <Select
              value={filters.type}
              onValueChange={(v) => {
                const next = { ...filters, type: v as typeof filters.type };
                setFilters(next);
                startTransition(async () => setItems(await getReviewsAdmin(next)));
              }}
            >
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
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v as typeof filters.status }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[{ value: "all", label: "همه" }, ...STATUS_OPTIONS].map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>مرتب‌سازی بر اساس</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v as typeof filters.sortBy }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>جهت</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(v) => setFilters((f) => ({ ...f, sortOrder: v as typeof filters.sortOrder }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">نزولی</SelectItem>
                <SelectItem value="asc">صعودی</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={applyFilters} disabled={isPending} className="w-full md:w-auto">
            اعمال فیلتر
          </Button>
        </div>
      </div>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: "authorName",
            title: "نویسنده",
            render: (row) => (
              <div>
                <div className="font-medium">{row.authorName}</div>
                {row.authorEmail && (
                  <div className="text-xs text-stone-500" dir="ltr">
                    {row.authorEmail}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "target",
            title: "مربوط به",
            render: (row) => <div className="text-sm">{targetLabel(row)}</div>,
          },
          {
            key: "rating",
            title: "امتیاز",
            render: (row) => (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{row.rating}</span>
              </div>
            ),
          },
          {
            key: "status",
            title: "وضعیت",
            render: (row) => (
              <StatusBadge type={statusType(row.status)}>{statusLabel(row.status)}</StatusBadge>
            ),
          },
          {
            key: "createdAt",
            title: "تاریخ",
            render: (row) => formatJalali(row.createdAt),
          },
        ]}
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={canDelete ? openDelete : undefined}
        searchKeys={["authorName", "authorEmail", "tourTitle", "postTitle", "content"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش نظر" : "نظر جدید"}
        onSubmit={handleSubmit}
        loading={isPending}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نام نویسنده</Label>
              <Input
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input
                value={form.authorEmail}
                onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>موبایل</Label>
              <Input
                value={form.authorPhone}
                onChange={(e) => setForm({ ...form, authorPhone: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>امتیاز</Label>
              <Select
                value={form.rating}
                onValueChange={(v) => setForm({ ...form, rating: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r} ستاره
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>شناسه تور (اختیاری)</Label>
              <Input
                value={form.tourId}
                onChange={(e) => setForm({ ...form, tourId: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>عنوان تور (اختیاری)</Label>
              <Input
                value={form.tourTitle}
                onChange={(e) => setForm({ ...form, tourTitle: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>شناسه مقاله (اختیاری)</Label>
              <Input
                value={form.blogPostId}
                onChange={(e) => setForm({ ...form, blogPostId: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>عنوان مقاله (اختیاری)</Label>
              <Input
                value={form.postTitle}
                onChange={(e) => setForm({ ...form, postTitle: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>عنوان نظر</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>متن نظر</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
            />
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
        </div>
      </FormModal>

      <DeleteDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف نظر"
        description={`آیا از حذف نظر «${deleting?.authorName || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
