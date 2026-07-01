"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { TemplateSelector, type ServiceTemplate } from "@/components/admin/template-selector";
import { getHotels, createHotel, updateHotel, deleteHotel, getServiceTemplates } from "@/lib/admin-actions";
import { formatNumber } from "@/lib/utils";

type Hotel = Awaited<ReturnType<typeof getHotels>>[number];

const emptyForm = {
  name: "",
  nameEn: "",
  stars: "5",
  address: "",
  description: "",
  images: "",
  amenities: "",
  city: "",
  country: "",
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

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Hotel | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const [data, templates] = await Promise.all([getHotels(), getServiceTemplates()]);
      if (!mounted) return;
      setHotels(data);
      setServiceTemplates(templates);
      setLoading(false);
    }
    init();
    return () => { mounted = false; };
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(hotel: Hotel) {
    setEditing(hotel);
    setForm({
      name: hotel.name,
      nameEn: hotel.nameEn || "",
      stars: String(hotel.stars ?? 5),
      address: hotel.address || "",
      description: hotel.description || "",
      images: toLines(hotel.images),
      amenities: toLines(hotel.amenities),
      city: hotel.city || "",
      country: hotel.country || "",
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        nameEn: form.nameEn || undefined,
        stars: Number(form.stars) || 0,
        address: form.address || undefined,
        description: form.description || undefined,
        images: toArray(form.images),
        amenities: toArray(form.amenities),
        city: form.city || undefined,
        country: form.country || undefined,
      };
      if (editing) {
        await updateHotel(editing.id, payload);
      } else {
        await createHotel(payload);
      }
      setModalOpen(false);
      const data = await getHotels();
      setHotels(data);
    } finally {
      setSubmitting(false);
    }
  }

  function confirmDelete(hotel: Hotel) {
    setDeleting(hotel);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await deleteHotel(deleting.id);
      setDeleteOpen(false);
      const data = await getHotels();
      setHotels(data);
    } finally {
      setSubmitting(false);
      setDeleting(null);
    }
  }

  const columns = useMemo(
    () => [
      {
        key: "name",
        title: "نام هتل",
        render: (row: Hotel) => (
          <div>
            <div className="font-medium text-stone-900">{row.name}</div>
            {row.nameEn && (
              <div dir="ltr" className="text-xs text-stone-500">
                {row.nameEn}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "stars",
        title: "ستاره",
        render: (row: Hotel) => (
          <div className="flex items-center gap-1 text-amber-500">
            <span className="num-en font-medium">{row.stars}</span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        ),
      },
      { key: "city", title: "شهر" },
      { key: "country", title: "کشور" },
      {
        key: "address",
        title: "آدرس",
        render: (row: Hotel) => (
          <span className="text-stone-600 line-clamp-1">{row.address || "—"}</span>
        ),
      },
      {
        key: "amenities",
        title: "امکانات",
        render: (row: Hotel) => {
          const list = parseJsonArray(row.amenities);
          if (!list.length) return <span className="text-stone-400">—</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {list.slice(0, 3).map((item) => (
                <StatusBadge key={item} type="info">
                  {item}
                </StatusBadge>
              ))}
              {list.length > 3 && (
                <span className="text-xs text-stone-500">+{list.length - 3}</span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">مدیریت هتل‌ها</h1>
          <p className="text-sm text-stone-500 mt-1">ثبت و ویرایش هتل‌های همکار</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          هتل جدید
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          <Clock className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
          در حال بارگذاری...
        </div>
      ) : (
        <DataTable
          data={hotels}
          columns={columns}
          keyExtractor={(row) => row.id}
          onEdit={openEdit}
          onDelete={confirmDelete}
          searchKeys={["name", "nameEn", "city", "country"]}
        />
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "ویرایش هتل" : "هتل جدید"}
        onSubmit={handleSubmit}
        loading={submitting}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>نام هتل</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="هتل ریکسوس آنتالیا"
            />
          </div>

          <div className="space-y-2">
            <Label>نام انگلیسی</Label>
            <Input
              dir="ltr"
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              placeholder="Rixos Hotel"
            />
          </div>

          <div className="space-y-2">
            <Label>ستاره</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.stars}
              onChange={(e) => setForm((f) => ({ ...f, stars: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>شهر</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="آنتالیا"
            />
          </div>

          <div className="space-y-2">
            <Label>کشور</Label>
            <Input
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              placeholder="ترکیه"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>آدرس</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="آدرس کامل هتل"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>توضیحات</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="توضیحات هتل، موقعیت، خدمات..."
              rows={4}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>تصاویر هتل (آدرس‌ها را در خطوط جداگانه وارد کنید)</Label>
            <Textarea
              dir="ltr"
              value={form.images}
              onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
              placeholder="/images/hotel-1.jpg&#10;/images/hotel-2.jpg"
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>امکانات (هر خط یکی)</Label>
            <Textarea
              value={form.amenities}
              onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
              placeholder="Wi-Fi رایگان&#10;استخر&#10;صبحانه"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف هتل"
        description={`آیا از حذف «${deleting?.name}» مطمئن هستید؟`}
        loading={submitting}
      />
    </div>
  );
}
