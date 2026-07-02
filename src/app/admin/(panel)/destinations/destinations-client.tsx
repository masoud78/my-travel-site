"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "@/lib/admin-actions";
import { formatNumber, slugify } from "@/lib/utils";

type Destination = Awaited<ReturnType<typeof getDestinations>>[number];

const DESTINATION_TYPES = [
  { value: "CONTINENT", label: "قاره" },
  { value: "COUNTRY", label: "کشور" },
  { value: "CITY", label: "شهر" },
];

const ALLOWED_PARENT: Record<string, string[]> = {
  CONTINENT: [],
  COUNTRY: ["CONTINENT"],
  CITY: ["COUNTRY"],
};

const emptyForm = {
  name: "",
  nameEn: "",
  slug: "",
  type: "CITY",
  parentId: "",
  description: "",
  image: "",
  metaTitle: "",
  metaDesc: "",
  order: "0",
  isActive: true,
};

export default function AdminDestinationsClient({
  initialDestinations,
  canCreate,
  canUpdate,
  canDelete,
}: {
  initialDestinations: Destination[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}) {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Destination | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function init() {
      const data = await getDestinations();
      if (!mounted) return;
      setDestinations(data);
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

  function openEdit(destination: Destination) {
    setEditing(destination);
    setForm({
      name: destination.name,
      nameEn: destination.nameEn || "",
      slug: destination.slug,
      type: destination.type,
      parentId: destination.parentId || "",
      description: destination.description || "",
      image: destination.image || "",
      metaTitle: destination.metaTitle || "",
      metaDesc: destination.metaDesc || "",
      order: String(destination.order ?? 0),
      isActive: destination.isActive,
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        nameEn: form.nameEn || undefined,
        slug: form.slug || slugify(form.name),
        type: form.type,
        parentId: form.parentId || null,
        description: form.description || undefined,
        image: form.image || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDesc: form.metaDesc || undefined,
        order: Number(form.order) || 0,
        isActive: form.isActive,
      };
      if (editing) {
        await updateDestination(editing.id, payload);
      } else {
        await createDestination(payload);
      }
      setModalOpen(false);
      const data = await getDestinations();
      setDestinations(data);
    } finally {
      setSubmitting(false);
    }
  }

  function confirmDelete(destination: Destination) {
    setDeleting(destination);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await deleteDestination(deleting.id);
      setDeleteOpen(false);
      const data = await getDestinations();
      setDestinations(data);
    } finally {
      setSubmitting(false);
      setDeleting(null);
    }
  }

  const eligibleParents = useMemo(
    () => destinations.filter((d) => (!editing || d.id !== editing.id) && ALLOWED_PARENT[form.type]?.includes(d.type)),
    [destinations, editing, form.type]
  );

  const roots = useMemo(
    () => destinations.filter((d) => !d.parentId).sort((a, b) => (b.order ?? 0) - (a.order ?? 0)),
    [destinations]
  );

  const filteredRows = useMemo(() => {
    let rows = destinations;
    if (typeFilter !== "ALL") rows = rows.filter((d) => d.type === typeFilter);
    if (activeFilter !== "ALL") rows = rows.filter((d) => (activeFilter === "ACTIVE" ? d.isActive : !d.isActive));
    const q = search.trim().toLowerCase();
    if (q) rows = rows.filter((d) => d.name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q) || (d.nameEn || "").toLowerCase().includes(q));
    return rows;
  }, [destinations, typeFilter, activeFilter, search]);

  const treeRows = useMemo(() => {
    const map = new Map<string, Destination & { children: Destination[] }>();
    filteredRows.forEach((d) => map.set(d.id, { ...d, children: [] }));
    const result: (Destination & { level?: number; children?: Destination[] })[] = [];
    filteredRows
      .filter((d) => !d.parentId || !map.has(d.parentId))
      .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
      .forEach((root) => {
        result.push({ ...root, level: 0 });
        filteredRows
          .filter((d) => d.parentId === root.id)
          .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
          .forEach((child) => {
            result.push({ ...child, level: 1 });
          });
      });
    return result;
  }, [filteredRows]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        title: "نام",
        render: (row: Destination & { level?: number }) => (
          <div className={`flex items-center gap-3 ${row.level === 1 ? "pr-6" : ""}`}>
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-10 h-10 rounded-lg object-cover border border-stone-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs">
                —
              </div>
            )}
            <div>
              <div className="font-medium text-stone-900">{row.name}</div>
              {row.nameEn && <div dir="ltr" className="text-xs text-stone-500">{row.nameEn}</div>}
            </div>
          </div>
        ),
      },
      {
        key: "slug",
        title: "اسلاگ",
        render: (row: Destination) => (
          <span dir="ltr" className="text-stone-600">{row.slug}</span>
        ),
      },
      {
        key: "type",
        title: "نوع",
        render: (row: Destination) =>
          DESTINATION_TYPES.find((t) => t.value === row.type)?.label || row.type,
      },
      {
        key: "parent",
        title: "والد",
        render: (row: Destination) => row.parent?.name || "—",
      },
      {
        key: "order",
        title: "ترتیب",
        render: (row: Destination) => <span>{formatNumber(row.order ?? 0)}</span>,
      },
      {
        key: "isActive",
        title: "وضعیت",
        render: (row: Destination) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.isActive}
              onCheckedChange={async (checked) => {
                await updateDestination(row.id, { isActive: checked });
                const data = await getDestinations();
                setDestinations(data);
              }}
              aria-label={row.isActive ? "فعال" : "غیرفعال"}
            />
            <span className={`text-xs ${row.isActive ? "text-emerald-600" : "text-stone-400"}`}>
              {row.isActive ? "فعال" : "غیرفعال"}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">مدیریت مقصدها</h1>
          <p className="text-sm text-stone-500 mt-1">سلسله‌مراتب مقصدها با جستجو و فیلتر</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          مقصد جدید
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در نام، اسلاگ، نام انگلیسی..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="نوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">همه انواع</SelectItem>
              {DESTINATION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">همه وضعیت‌ها</SelectItem>
              <SelectItem value="ACTIVE">فعال</SelectItem>
              <SelectItem value="INACTIVE">غیرفعال</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => { setTypeFilter("ALL"); setActiveFilter("ALL"); setSearch(""); }}>
            <Filter className="w-4 h-4 ml-1" />
            پاک کردن
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-4 py-3 text-right font-semibold text-stone-700">
                    {col.title}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold text-stone-700">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {treeRows.length > 0 ? (
                treeRows.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/60 transition-colors">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-stone-700">
                        {col.render ? col.render(row) : String(row[col.key as keyof typeof row] ?? "-")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(row)} title="ویرایش">
                          <Pencil className="w-4 h-4 text-stone-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(row)} title="حذف">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-stone-400">
                    رکوردی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          <Clock className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
          در حال بارگذاری...
        </div>
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "ویرایش مقصد" : "مقصد جدید"}
        onSubmit={handleSubmit}
        loading={submitting}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>نام مقصد</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="آنتالیا"
            />
          </div>

          <div className="space-y-2">
            <Label>نام انگلیسی</Label>
            <Input
              dir="ltr"
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              placeholder="Antalya"
            />
          </div>

          <div className="space-y-2">
            <Label>اسلاگ</Label>
            <Input
              dir="ltr"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="antalya"
            />
          </div>

          <div className="space-y-2">
            <Label>نوع</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DESTINATION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>والد</Label>
            <Select
              value={form.parentId || "none"}
              onValueChange={(v) => setForm((f) => ({ ...f, parentId: v === "none" ? "" : v }))}
              disabled={ALLOWED_PARENT[form.type]?.length === 0}
            >
              <SelectTrigger><SelectValue placeholder={ALLOWED_PARENT[form.type]?.length === 0 ? "بدون والد" : "انتخاب والد"} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون والد</SelectItem>
                {eligibleParents.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({DESTINATION_TYPES.find((t) => t.value === d.type)?.label || d.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {ALLOWED_PARENT[form.type]?.length > 0 && (
              <p className="text-xs text-stone-500">
                برای {DESTINATION_TYPES.find((t) => t.value === form.type)?.label} باید یکی از {ALLOWED_PARENT[form.type].map((t) => DESTINATION_TYPES.find((dt) => dt.value === t)?.label).join(" / ")} انتخاب شود.
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <RichTextEditor
              label="توضیحات"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="توضیحات سئو‌محور درباره مقصد"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>تصویر مقصد</Label>
            <ImagePicker
              value={form.image}
              onChange={(v) => setForm((f) => ({ ...f, image: v }))}
              label=""
            />
          </div>

          <div className="space-y-2">
            <Label>عنوان سئو</Label>
            <Input
              value={form.metaTitle}
              onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>توضیحات متا</Label>
            <Input
              value={form.metaDesc}
              onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>ترتیب</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </div>

          <div className="space-y-2 flex items-center gap-3">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
            <Label>فعال</Label>
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف مقصد"
        description={`آیا از حذف «${deleting?.name}» مطمئن هستید؟ تورهای متصل ممکن است تحت تأثیر قرار گیرند.`}
        loading={submitting}
      />
    </div>
  );
}
