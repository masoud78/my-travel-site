"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, CalendarDays, Clock, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { TemplateSelector, type ServiceTemplate } from "@/components/admin/template-selector";
import type { MediaItem } from "@/components/admin/media-gallery";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  getDestinations,
  getTransports,
  getTourDates,
  createTourDate,
  updateTourDate,
  deleteTourDate,
  getServiceTemplates,
} from "@/lib/admin-actions";
import { formatDateTime } from "@/lib/jalali";
import { toFa, formatPrice , formatNumber} from "@/lib/utils"

type Tour = Awaited<ReturnType<typeof getTours>>[number];
type Destination = Awaited<ReturnType<typeof getDestinations>>[number];
type Transport = Awaited<ReturnType<typeof getTransports>>[number];
type TourDate = Awaited<ReturnType<typeof getTourDates>>[number];

const CATEGORIES = [
  { value: "INTERNAL", label: "داخلی" },
  { value: "TURKEY", label: "ترکیه" },
  { value: "ASIA", label: "آسیا" },
  { value: "EUROPE", label: "اروپا" },
  { value: "SPECIAL", label: "ویژه" },
];

const TRANSPORT_TYPES = [
  { value: "PLANE", label: "هواپیما" },
  { value: "TRAIN", label: "قطار" },
  { value: "BUS", label: "اتوبوس" },
  { value: "ROAD", label: "زمینی" },
  { value: "MIXED", label: "ترکیبی" },
];

const STATUSES = [
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "PUBLISHED", label: "منتشر شده" },
  { value: "INACTIVE", label: "غیرفعال" },
  { value: "RUNNING", label: "در حال برگزاری" },
  { value: "NOT_RUNNING", label: "برگزار نمی‌شود" },
];

const DATE_STATUSES = [
  { value: "AVAILABLE", label: "باز" },
  { value: "FULL", label: "تکمیل ظرفیت" },
  { value: "CANCELLED", label: "لغو شده" },
];

const emptyTourForm = {
  title: "",
  slug: "",
  shortDesc: "",
  description: "",
  category: "INTERNAL",
  duration: "",
  nights: "",
  transportType: "PLANE",
  startPrice: "",
  destinationId: "",
  destinationIds: [] as string[],
  transportId: "",
  originCity: "",
  origins: "",
  images: "",
  thumbnail: "",
  includes: "",
  excludes: "",
  requirements: "",
  cancellation: "",
  isFeatured: false,
  isLastMinute: false,
  status: "DRAFT",
  metaTitle: "",
  metaDesc: "",
  keywords: "",
};

const emptyDateForm = {
  departDate: null as Date | null,
  returnDate: null as Date | null,
  price: "",
  capacity: "",
  remaining: "",
  status: "AVAILABLE",
};

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toLines(arr: string[] | string | null | undefined): string {
  if (!arr) return "";
  const list = Array.isArray(arr) ? arr : parseJsonArray(arr);
  return list.join("\n");
}

function toArray(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toInputDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getStatusType(status: string): "default" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "PUBLISHED":
    case "AVAILABLE":
      return "success";
    case "RUNNING":
      return "info";
    case "INACTIVE":
    case "FULL":
      return "warning";
    case "NOT_RUNNING":
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

function getStatusLabel(status: string): string {
  const found = STATUSES.find((s) => s.value === status);
  const dateFound = DATE_STATUSES.find((s) => s.value === status);
  return found?.label || dateFound?.label || status;
}

export default function ToursClient({
  initialTours,
  initialDestinations,
  initialTransports,
  serviceTemplates = [],
  create,
}: {
  initialTours: Tour[];
  initialDestinations: Destination[];
  initialTransports: Transport[];
  serviceTemplates?: ServiceTemplate[];
  create?: boolean;
}) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [transports, setTransports] = useState<Transport[]>(initialTransports);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [form, setForm] = useState(emptyTourForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Tour | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [destinationFilter, setDestinationFilter] = useState<string>("ALL");
  const [transportFilter, setTransportFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "startPrice" | "duration">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [datesOpen, setDatesOpen] = useState(false);
  const [dateTour, setDateTour] = useState<Tour | null>(null);
  const [dates, setDates] = useState<TourDate[]>([]);
  const [dateForm, setDateForm] = useState(emptyDateForm);
  const [editingDate, setEditingDate] = useState<TourDate | null>(null);
  const [dateSubmitting, setDateSubmitting] = useState(false);
  const [dateDeleteOpen, setDateDeleteOpen] = useState(false);
  const [deletingDate, setDeletingDate] = useState<TourDate | null>(null);

  useEffect(() => {
    if (create) {
      openCreate();
    }
  }, [create]);

  function openCreate() {
    setEditing(null);
    setForm(emptyTourForm);
    setModalOpen(true);
  }

  function openEdit(tour: Tour) {
    setEditing(tour);
    setForm({
      title: tour.title,
      slug: tour.slug,
      shortDesc: tour.shortDesc || "",
      description: tour.description || "",
      category: tour.category,
      duration: String(tour.duration),
      nights: String(tour.nights ?? 0),
      transportType: tour.transportType,
      startPrice: String(tour.startPrice),
      destinationId: tour.destinationId || "",
      destinationIds: (tour.destinations || []).map((d) => d.id),
      transportId: tour.transportId || "",
      originCity: tour.originCity || "",
      origins: toLines(tour.origins),
      images: toLines(tour.images),
      thumbnail: tour.thumbnail || "",
      includes: toLines(tour.includes),
      excludes: toLines(tour.excludes),
      requirements: toLines(tour.requirements),
      cancellation: tour.cancellation || "",
      isFeatured: tour.isFeatured,
      isLastMinute: tour.isLastMinute,
      status: tour.status,
      metaTitle: tour.metaTitle || "",
      metaDesc: tour.metaDesc || "",
      keywords: tour.keywords || "",
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        shortDesc: form.shortDesc || undefined,
        description: form.description || undefined,
        category: form.category,
        duration: Number(form.duration) || 0,
        nights: Number(form.nights) || 0,
        transportType: form.transportType,
        startPrice: Number(form.startPrice) || 0,
        destinationId: form.destinationId || null,
        destinationIds: form.destinationIds.length ? form.destinationIds : (form.destinationId ? [form.destinationId] : []),
        transportId: form.transportId || null,
        originCity: form.originCity || undefined,
        origins: toArray(form.origins),
        images: toArray(form.images),
        thumbnail: form.thumbnail || undefined,
        includes: toArray(form.includes),
        excludes: toArray(form.excludes),
        requirements: toArray(form.requirements),
        cancellation: form.cancellation || undefined,
        isFeatured: form.isFeatured,
        isLastMinute: form.isLastMinute,
        status: form.status,
        metaTitle: form.metaTitle || undefined,
        metaDesc: form.metaDesc || undefined,
        keywords: form.keywords || undefined,
      };
      if (editing) {
        await updateTour(editing.id, payload);
      } else {
        await createTour(payload);
      }
      setModalOpen(false);
      const [t, d, tr] = await Promise.all([getTours(), getDestinations(), getTransports()]);
      setTours(t);
      setDestinations(d);
      setTransports(tr);
    } finally {
      setSubmitting(false);
    }
  }

  function confirmDelete(tour: Tour) {
    setDeleting(tour);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await deleteTour(deleting.id);
      setDeleteOpen(false);
      const [t, d, tr] = await Promise.all([getTours(), getDestinations(), getTransports()]);
      setTours(t);
      setDestinations(d);
      setTransports(tr);
    } finally {
      setSubmitting(false);
      setDeleting(null);
    }
  }

  async function openDates(tour: Tour) {
    setDateTour(tour);
    setDatesOpen(true);
    setEditingDate(null);
    setDateForm(emptyDateForm);
    const list = await getTourDates(tour.id);
    setDates(list);
  }

  function openEditDate(date: TourDate) {
    setEditingDate(date);
    setDateForm({
      departDate: toInputDate(date.departDate),
      returnDate: toInputDate(date.returnDate),
      price: String(date.price),
      capacity: String(date.capacity),
      remaining: String(date.remaining),
      status: date.status,
    });
  }

  function resetDateForm() {
    setEditingDate(null);
    setDateForm(emptyDateForm);
  }

  async function handleDateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dateTour) return;
    setDateSubmitting(true);
    try {
      const payload = {
        tourId: dateTour.id,
        departDate: new Date(dateForm.departDate),
        returnDate: new Date(dateForm.returnDate),
        price: Number(dateForm.price) || 0,
        capacity: Number(dateForm.capacity) || 0,
        remaining: Number(dateForm.remaining) || Number(dateForm.capacity) || 0,
        status: dateForm.status,
      };
      if (editingDate) {
        await updateTourDate(editingDate.id, payload);
      } else {
        await createTourDate(payload);
      }
      resetDateForm();
      const list = await getTourDates(dateTour.id);
      setDates(list);
      const [t, d, tr] = await Promise.all([getTours(), getDestinations(), getTransports()]);
      setTours(t);
      setDestinations(d);
      setTransports(tr);
    } finally {
      setDateSubmitting(false);
    }
  }

  function confirmDeleteDate(date: TourDate) {
    setDeletingDate(date);
    setDateDeleteOpen(true);
  }

  async function handleDeleteDate() {
    if (!deletingDate || !dateTour) return;
    setDateSubmitting(true);
    try {
      await deleteTourDate(deletingDate.id);
      setDateDeleteOpen(false);
      const list = await getTourDates(dateTour.id);
      setDates(list);
      const [t, d, tr] = await Promise.all([getTours(), getDestinations(), getTransports()]);
      setTours(t);
      setDestinations(d);
      setTransports(tr);
    } finally {
      setDateSubmitting(false);
      setDeletingDate(null);
    }
  }

  const filteredTours = useMemo(() => {
    let rows = [...tours];
    if (statusFilter !== "ALL") rows = rows.filter((t) => t.status === statusFilter);
    if (destinationFilter !== "ALL") rows = rows.filter((t) => t.destinationId === destinationFilter);
    if (transportFilter !== "ALL") rows = rows.filter((t) => t.transportId === transportFilter);
    rows.sort((a, b) => {
      let av: number | string = a[sortBy] as unknown as number | string;
      let bv: number | string = b[sortBy] as unknown as number | string;
      if (sortBy === "createdAt") {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      }
      if (typeof av === "number" && typeof bv === "number") {
        return sortOrder === "asc" ? av - bv : bv - av;
      }
      return sortOrder === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [tours, statusFilter, destinationFilter, transportFilter, sortBy, sortOrder]);

  const activeDestinations = useMemo(
    () => destinations.filter((d) => d.isActive !== false),
    [destinations]
  );

  const destinationOptions = useMemo(() => {
    const roots = activeDestinations.filter((d) => !d.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const children = activeDestinations.filter((d) => d.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return roots.map((root) => ({
      ...root,
      children: children.filter((c) => c.parentId === root.id),
    }));
  }, [activeDestinations]);

  const activeTransports = useMemo(
    () => transports.filter((t) => t.isActive !== false),
    [transports]
  );

  const columns = useMemo(
    () => [
      {
        key: "thumbnail",
        title: "تصویر",
        render: (row: Tour) =>
          row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.title}
              className="w-12 h-12 rounded-lg object-cover border border-stone-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs">
              بدون تصویر
            </div>
          ),
      },
      { key: "title", title: "عنوان تور" },
      {
        key: "destination",
        title: "مقصد",
        render: (row: Tour) => row.destination?.name || "—",
      },
      {
        key: "transport",
        title: "حمل‌ونقل",
        render: (row: Tour) => row.transport?.name || "—",
      },
      {
        key: "duration",
        title: "مدت",
        render: (row: Tour) => `${row.duration} روز / ${row.nights} شب`,
      },
      {
        key: "startPrice",
        title: "شروع قیمت",
        render: (row: Tour) => (
          <span className="num-en">{Number(row.startPrice).toLocaleString("fa-IR")} تومان</span>
        ),
      },
      {
        key: "status",
        title: "وضعیت",
        render: (row: Tour) => (
          <StatusBadge type={getStatusType(row.status)}>{getStatusLabel(row.status)}</StatusBadge>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">مدیریت تورها</h1>
          <p className="text-sm text-stone-500 mt-1">ثبت، ویرایش و مدیریت تاریخ‌های تورها</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          تور جدید
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          <Clock className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
          در حال بارگذاری...
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">همه وضعیت‌ها</SelectItem>
                <SelectItem value="PUBLISHED">منتشر شده</SelectItem>
                <SelectItem value="DRAFT">پیش‌نویس</SelectItem>
                <SelectItem value="ARCHIVED">بایگانی</SelectItem>
              </SelectContent>
            </Select>
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="مقصد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">همه مقاصد</SelectItem>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={transportFilter} onValueChange={setTransportFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="حمل‌ونقل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">همه حمل‌ونقل‌ها</SelectItem>
                {transports.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">تاریخ ایجاد</SelectItem>
                <SelectItem value="startPrice">قیمت</SelectItem>
                <SelectItem value="duration">مدت</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}>
              {sortOrder === "asc" ? "صعودی ↑" : "نزولی ↓"}
            </Button>
          </div>
          <DataTable
            data={filteredTours}
            columns={columns}
            keyExtractor={(row) => row.id}
            onEdit={openEdit}
            onDelete={confirmDelete}
            searchKeys={["title", "slug", "originCity"]}
            actions={(row) => (
              <Button variant="ghost" size="icon" onClick={() => openDates(row)} title="تاریخ‌های تور">
                <CalendarDays className="w-4 h-4 text-teal-600" />
              </Button>
            )}
          />
        </>
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "ویرایش تور" : "تور جدید"}
        onSubmit={handleSubmit}
        loading={submitting}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-2 lg:col-span-2">
            <Label>عنوان تور</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="مثلاً تور آنتالیا ۷ شب"
            />
          </div>
          <div className="space-y-2">
            <Label>اسلاگ</Label>
            <Input
              dir="ltr"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="antalya-7nights"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <Label>توضیح کوتاه</Label>
            <Input
              value={form.shortDesc}
              onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
              placeholder="یک جمله جذاب برای کارت تور"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <RichTextEditor
              label="توضیحات کامل"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="جزئیات تور، خدمات، برنامه سفر..."
            />
          </div>

          <div className="space-y-2">
            <Label>دسته‌بندی</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>نوع حمل‌ونقل</Label>
            <Select
              value={form.transportType}
              onValueChange={(v) => setForm((f) => ({ ...f, transportType: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>وضعیت</Label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>مدت (روز)</Label>
            <Input
              type="number"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>شب اقامت</Label>
            <Input
              type="number"
              value={form.nights}
              onChange={(e) => setForm((f) => ({ ...f, nights: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>شروع قیمت (تومان)</Label>
            <Input
              type="number"
              value={form.startPrice}
              onChange={(e) => setForm((f) => ({ ...f, startPrice: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              مقصدها
            </Label>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {destinationOptions.map((root) => (
                  <div key={root.id} className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-800 cursor-pointer">
                      <Checkbox
                        checked={form.destinationIds.includes(root.id)}
                        onCheckedChange={() =>
                          setForm((f) => ({
                            ...f,
                            destinationIds: f.destinationIds.includes(root.id)
                              ? f.destinationIds.filter((x) => x !== root.id)
                              : [...f.destinationIds, root.id],
                          }))
                        }
                      />
                      {root.name}
                    </label>
                    {root.children.map((child) => (
                      <label key={child.id} className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer pr-6">
                        <Checkbox
                          checked={form.destinationIds.includes(child.id)}
                          onCheckedChange={() =>
                            setForm((f) => ({
                              ...f,
                              destinationIds: f.destinationIds.includes(child.id)
                                ? f.destinationIds.filter((x) => x !== child.id)
                                : [...f.destinationIds, child.id],
                            }))
                          }
                        />
                        {root.name} → {child.name}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>شرکت حمل‌ونقل</Label>
            <Select
              value={form.transportId || "none"}
              onValueChange={(v) => setForm((f) => ({ ...f, transportId: v === "none" ? "" : v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب حمل‌ونقل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون حمل‌ونقل</SelectItem>
                {activeTransports.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>شهر مبدأ</Label>
            <Input
              value={form.originCity}
              onChange={(e) => setForm((f) => ({ ...f, originCity: e.target.value }))}
              placeholder="تهران"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <Label>تصویر شاخص</Label>
            <ImagePicker
              value={form.thumbnail}
              onChange={(v) => setForm((f) => ({ ...f, thumbnail: v }))}
              label=""
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <Label>گالری تصاویر (آدرس‌ها را در خطوط جداگانه وارد کنید)</Label>
            <Textarea
              dir="ltr"
              value={form.images}
              onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
              placeholder="/images/tour-1.jpg&#10;/images/tour-2.jpg"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <TemplateSelector
              type="ORIGIN"
              label="شهرهای مبدأ"
              templates={serviceTemplates}
              value={form.origins}
              onChange={(v) => setForm((f) => ({ ...f, origins: v }))}
              placeholder="تهران"
            />
          </div>

          <div className="space-y-2">
            <TemplateSelector
              type="INCLUDE"
              label="خدمات شامل"
              templates={serviceTemplates}
              value={form.includes}
              onChange={(v) => setForm((f) => ({ ...f, includes: v }))}
              placeholder="بلیط رفت و برگشت"
            />
          </div>

          <div className="space-y-2">
            <TemplateSelector
              type="EXCLUDE"
              label="خدمات غیرشامل"
              templates={serviceTemplates}
              value={form.excludes}
              onChange={(v) => setForm((f) => ({ ...f, excludes: v }))}
              placeholder="ویزا"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <TemplateSelector
              type="REQUIREMENT"
              label="مدارک لازم"
              templates={serviceTemplates}
              value={form.requirements}
              onChange={(v) => setForm((f) => ({ ...f, requirements: v }))}
              placeholder="پاسپورت با ۶ ماه اعتبار"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <TemplateSelector
              type="CANCELLATION"
              label="شرایط کنسلی"
              templates={serviceTemplates}
              value={form.cancellation}
              onChange={(v) => setForm((f) => ({ ...f, cancellation: v }))}
              placeholder="توضیح کوتاه شرایط کنسلی"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                />
                تور ویژه
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isLastMinute}
                  onChange={(e) => setForm((f) => ({ ...f, isLastMinute: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                />
                آفر لحظه آخری
              </label>
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label>عنوان سئو</Label>
            <Input
              value={form.metaTitle}
              onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label>توضیحات متا</Label>
            <Textarea
              value={form.metaDesc}
              onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>کلمات کلیدی</Label>
            <Input
              value={form.keywords}
              onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
              placeholder="با کاما جدا کنید"
            />
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف تور"
        description={`آیا از حذف «${deleting?.title}» مطمئن هستید؟ تمام تاریخ‌های مرتبط نیز حذف می‌شوند.`}
        loading={submitting}
      />

      <FormModal
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
        title={`تاریخ‌های تور: ${dateTour?.title}`}
        size="lg"
      >
        <div className="space-y-6">
          <form onSubmit={handleDateSubmit} className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900">
                {editingDate ? "ویرایش تاریخ" : "افزودن تاریخ جدید"}
              </h3>
              {editingDate && (
                <Button type="button" variant="ghost" size="sm" onClick={resetDateForm}>
                  انصراف
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>تاریخ حرکت</Label>
                <Input
                  type="datetime-local"
                  dir="ltr"
                  value={dateForm.departDate}
                  onChange={(e) => setDateForm((f) => ({ ...f, departDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>تاریخ برگشت</Label>
                <Input
                  type="datetime-local"
                  dir="ltr"
                  value={dateForm.returnDate}
                  onChange={(e) => setDateForm((f) => ({ ...f, returnDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>قیمت (تومان)</Label>
                <Input
                  type="number"
                  value={dateForm.price}
                  onChange={(e) => setDateForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>ظرفیت</Label>
                <Input
                  type="number"
                  value={dateForm.capacity}
                  onChange={(e) => setDateForm((f) => ({ ...f, capacity: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>مانده ظرفیت</Label>
                <Input
                  type="number"
                  value={dateForm.remaining}
                  onChange={(e) => setDateForm((f) => ({ ...f, remaining: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>وضعیت تاریخ</Label>
                <Select
                  value={dateForm.status}
                  onValueChange={(v) => setDateForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={dateSubmitting}>
                {editingDate ? "بروزرسانی تاریخ" : "افزودن تاریخ"}
              </Button>
            </div>
          </form>

          <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">تاریخ حرکت</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">تاریخ برگشت</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">قیمت</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">ظرفیت</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">وضعیت</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {dates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                      تاریخی ثبت نشده است
                    </td>
                  </tr>
                )}
                {dates.map((date) => (
                  <tr key={date.id} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 num-en">
                      {new Date(date.departDate).toLocaleString("fa-IR")}
                    </td>
                    <td className="px-4 py-3 num-en">
                      {new Date(date.returnDate).toLocaleString("fa-IR")}
                    </td>
                    <td className="px-4 py-3 num-en">
                      {Number(date.price).toLocaleString("fa-IR")}
                    </td>
                    <td className="px-4 py-3 num-en">
                      {date.remaining}/{date.capacity}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type={getStatusType(date.status)}>{getStatusLabel(date.status)}</StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDate(date)}>
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDeleteDate(date)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={dateDeleteOpen}
        onClose={() => setDateDeleteOpen(false)}
        onConfirm={handleDeleteDate}
        title="حذف تاریخ تور"
        description="آیا از حذف این تاریخ مطمئن هستید؟"
        loading={dateSubmitting}
      />
    </div>
  );
}
