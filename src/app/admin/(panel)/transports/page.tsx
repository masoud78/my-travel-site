"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { StatusBadge } from "@/components/admin/status-badge";
import {
  getTransports,
  createTransport,
  updateTransport,
  deleteTransport,
} from "@/lib/admin-actions";

type Transport = Awaited<ReturnType<typeof getTransports>>[number];

const TRANSPORT_TYPES = [
  { value: "AIRLINE", label: "ایرلاین / هواپیما" },
  { value: "TRAIN", label: "قطار" },
  { value: "BUS", label: "اتوبوس" },
  { value: "OTHER", label: "سایر" },
];

const emptyForm = {
  name: "",
  type: "AIRLINE",
  logo: "",
  isActive: true,
};

export default function AdminTransportsPage() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transport | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Transport | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const data = await getTransports();
      if (!mounted) return;
      setTransports(data);
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

  function openEdit(transport: Transport) {
    setEditing(transport);
    setForm({
      name: transport.name,
      type: transport.type,
      logo: transport.logo || "",
      isActive: transport.isActive,
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        logo: form.logo || undefined,
        isActive: form.isActive,
      };
      if (editing) {
        await updateTransport(editing.id, payload);
      } else {
        await createTransport(payload);
      }
      setModalOpen(false);
      const data = await getTransports();
      setTransports(data);
    } finally {
      setSubmitting(false);
    }
  }

  function confirmDelete(transport: Transport) {
    setDeleting(transport);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await deleteTransport(deleting.id);
      setDeleteOpen(false);
      const data = await getTransports();
      setTransports(data);
    } finally {
      setSubmitting(false);
      setDeleting(null);
    }
  }

  const columns = useMemo(
    () => [
      {
        key: "logo",
        title: "لوگو",
        render: (row: Transport) =>
          row.logo ? (
            <img
              src={row.logo}
              alt={row.name}
              className="w-12 h-12 rounded-lg object-contain border border-stone-200 bg-white p-1"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs">
              بدون لوگو
            </div>
          ),
      },
      { key: "name", title: "نام شرکت" },
      {
        key: "type",
        title: "نوع",
        render: (row: Transport) =>
          TRANSPORT_TYPES.find((t) => t.value === row.type)?.label || row.type,
      },
      {
        key: "isActive",
        title: "وضعیت",
        render: (row: Transport) =>
          row.isActive ? (
            <StatusBadge type="success">فعال</StatusBadge>
          ) : (
            <StatusBadge type="danger">غیرفعال</StatusBadge>
          ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">مدیریت حمل‌ونقل</h1>
          <p className="text-sm text-stone-500 mt-1">ایرلاین‌ها، قطارها و اتوبوس‌های همکار</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          حمل‌ونقل جدید
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          <Clock className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
          در حال بارگذاری...
        </div>
      ) : (
        <DataTable
          data={transports}
          columns={columns}
          keyExtractor={(row) => row.id}
          onEdit={openEdit}
          onDelete={confirmDelete}
          searchKeys={["name", "type"]}
        />
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "ویرایش حمل‌ونقل" : "حمل‌ونقل جدید"}
        onSubmit={handleSubmit}
        loading={submitting}
        size="md"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>نام شرکت</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="مثلاً ایران ایر"
            />
          </div>

          <div className="space-y-2">
            <Label>نوع</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
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
            <Label>لوگو</Label>
            <ImagePicker
              value={form.logo}
              onChange={(v) => setForm((f) => ({ ...f, logo: v }))}
              label=""
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
            />
            فعال
          </label>
        </div>
      </FormModal>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف حمل‌ونقل"
        description={`آیا از حذف «${deleting?.name}» مطمئن هستید؟`}
        loading={submitting}
      />
    </div>
  );
}
