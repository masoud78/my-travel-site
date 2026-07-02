"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, LayoutGrid, MapPin, Plane, Star } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ImagePicker } from "@/components/admin/image-picker";
import { StatusBadge } from "@/components/admin/status-badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  createTourCategory,
  updateTourCategory,
  deleteTourCategory,
} from "@/lib/admin-actions";
import { formatJalali, slugify } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "منتشر شده" },
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "ARCHIVED", label: "بایگانی" },
];

const TRANSPORT_TYPES = [
  { value: "", label: "همه" },
  { value: "PLANE", label: "هواپیما" },
  { value: "TRAIN", label: "قطار" },
  { value: "BUS", label: "اتوبوس" },
  { value: "ROAD", label: "زمینی" },
  { value: "MIXED", label: "ترکیبی" },
];

interface TourCategoryItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
  destinationIds: string;
  hotelStars?: number | null;
  transportType?: string | null;
  originCity?: string | null;
  tourIds: string;
  status: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tours?: { id: string; title: string; slug: string }[];
}

interface DestinationItem {
  id: string;
  name: string;
  type: string;
  parentId?: string | null;
}

interface TourItem {
  id: string;
  title: string;
  slug: string;
  destinationId?: string | null;
  destinations?: { id: string }[];
  transportType?: string | null;
  originCity?: string | null;
}

interface CategoriesClientProps {
  categories: TourCategoryItem[];
  destinations: DestinationItem[];
  tours: TourItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

function parseIds(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const emptyForm = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  image: "",
  destinationIds: [] as string[],
  hotelStars: "",
  transportType: "",
  originCity: "",
  tourIds: [] as string[],
  metaTitle: "",
  metaDesc: "",
  keywords: "",
  ogImage: "",
  status: "PUBLISHED",
  order: "0",
  isActive: true,
};

export function CategoriesClient({
  categories,
  destinations,
  tours,
  canCreate,
  canUpdate,
  canDelete,
}: CategoriesClientProps) {
  const [items, setItems] = useState<TourCategoryItem[]>(categories);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<TourCategoryItem | null>(null);
  const [deleting, setDeleting] = useState<TourCategoryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const activeDestinations = useMemo(
    () => destinations.filter((d) => d.type === "CITY" || d.type === "COUNTRY" || d.type === "CONTINENT"),
    [destinations]
  );

  const candidateTours = useMemo(() => {
    if (!form.destinationIds.length) return [];
    return tours.filter((t) => {
      const tourDestIds = (t.destinations?.map((d) => d.id) || []).concat(t.destinationId ? [t.destinationId] : []);
      return form.destinationIds.some((id) => tourDestIds.includes(id));
    });
  }, [tours, form.destinationIds]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (cat: TourCategoryItem) => {
    setEditing(cat);
    setForm({
      title: cat.title,
      slug: cat.slug,
      subtitle: cat.subtitle || "",
      description: cat.description || "",
      image: cat.image || "",
      destinationIds: parseIds(cat.destinationIds),
      hotelStars: cat.hotelStars ? String(cat.hotelStars) : "",
      transportType: cat.transportType || "",
      originCity: cat.originCity || "",
      tourIds: parseIds(cat.tourIds),
      metaTitle: cat.metaTitle || "",
      metaDesc: cat.metaDesc || "",
      keywords: cat.keywords || "",
      ogImage: cat.ogImage || "",
      status: cat.status,
      order: String(cat.order ?? 0),
      isActive: cat.isActive,
    });
    setIsOpen(true);
  };

  const openDelete = (cat: TourCategoryItem) => {
    setDeleting(cat);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        subtitle: form.subtitle || undefined,
        description: form.description || undefined,
        image: form.image || undefined,
        destinationIds: form.destinationIds,
        hotelStars: form.hotelStars ? Number(form.hotelStars) : null,
        transportType: form.transportType || null,
        originCity: form.originCity || null,
        tourIds: form.tourIds,
        metaTitle: form.metaTitle || undefined,
        metaDesc: form.metaDesc || undefined,
        keywords: form.keywords || undefined,
        ogImage: form.ogImage || undefined,
        status: form.status,
        order: Number(form.order || 0),
        isActive: form.isActive,
      };
      try {
        if (editing) {
          const updated = await updateTourCategory(editing.id, data);
          setItems((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        } else {
          const created = await createTourCategory(data);
          setItems((prev) => [created as unknown as TourCategoryItem, ...prev]);
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
        await deleteTourCategory(deleting.id);
        setItems((prev) => prev.filter((p) => p.id !== deleting.id));
        setIsDeleteOpen(false);
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const toggleDestination = (id: string) => {
    setForm((f) => {
      const has = f.destinationIds.includes(id);
      const destinationIds = has ? f.destinationIds.filter((x) => x !== id) : [...f.destinationIds, id];
      // Reset selected tours if destinations change
      return { ...f, destinationIds, tourIds: has ? f.tourIds : [] };
    });
  };

  const toggleTour = (id: string) => {
    setForm((f) => {
      const has = f.tourIds.includes(id);
      return { ...f, tourIds: has ? f.tourIds.filter((x) => x !== id) : [...f.tourIds, id] };
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
            صفحات دسته‌بندی تورها
          </h1>
          <p className="text-sm text-stone-500 mt-1">ساخت صفحات لیست تور با فیلتر مقصد و انتخاب دستی تورها</p>
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
            key: "destinations",
            title: "مقاصد",
            render: (row) => (
              <div className="flex flex-wrap gap-1">
                {parseIds(row.destinationIds)
                  .map((id) => destinations.find((d) => d.id === id)?.name)
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((name) => (
                    <StatusBadge key={name} type="info">
                      {name}
                    </StatusBadge>
                  ))}
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
        onView={(row) => window.open(`/c/${row.slug}`, "_blank")}
        searchKeys={["title", "slug"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
        onSubmit={handleSubmit}
        loading={isPending}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عنوان</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="تور کیش از مشهد"
              />
            </div>
            <div className="space-y-2">
              <Label>اسلاگ</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="kish-from-mashhad"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>زیرعنوان</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="بهترین تورهای کیش با پرواز از مشهد"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Label>نوع حمل‌ونقل</Label>
              <Select value={form.transportType} onValueChange={(v) => setForm({ ...form, transportType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSPORT_TYPES.map((t) => (
                    <SelectItem key={t.value || "all"} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ستاره هتل</Label>
              <Select value={form.hotelStars} onValueChange={(v) => setForm({ ...form, hotelStars: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s} ستاره
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>شهر مبدأ</Label>
              <Input
                value={form.originCity}
                onChange={(e) => setForm({ ...form, originCity: e.target.value })}
                placeholder="مشهد"
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
              <MapPin className="w-4 h-4" />
              مقاصد مورد نظر
            </Label>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {activeDestinations.map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <Checkbox checked={form.destinationIds.includes(d.id)} onCheckedChange={() => toggleDestination(d.id)} />
                    {d.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>توضیحات معرفی</Label>
            <RichTextEditor
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              placeholder="توضیحات صفحه دسته‌بندی..."
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              تورهای انتخابی ({form.tourIds.length})
            </Label>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              {form.destinationIds.length === 0 ? (
                <p className="text-sm text-stone-500">ابتدا مقاصد را انتخاب کنید تا تورها نمایش داده شوند.</p>
              ) : candidateTours.length === 0 ? (
                <p className="text-sm text-stone-500">توری برای مقاصد انتخاب‌شده یافت نشد.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {candidateTours.map((t) => (
                    <label key={t.id} className="flex items-start gap-2 text-sm text-stone-700 cursor-pointer p-2 rounded-lg hover:bg-stone-50 border border-stone-100">
                      <Checkbox checked={form.tourIds.includes(t.id)} onCheckedChange={() => toggleTour(t.id)} />
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-stone-500">{t.destinations?.map((d) => d.id).includes(t.destinationId || "") ? "" : destinations.find((d) => d.id === t.destinationId)?.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
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
          <div className="space-y-2">
            <Label>ترتیب</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
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
