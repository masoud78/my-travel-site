"use client";

import { useState, useTransition } from "react";
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
  updateContactRequest,
  deleteContactRequest,
  type getContactRequests,
} from "@/lib/admin-actions";
import { formatJalali } from "@/lib/utils";

type RequestItem = Awaited<ReturnType<typeof getContactRequests>>[number];

const STATUS_OPTIONS = [
  { value: "NEW", label: "جدید" },
  { value: "IN_PROGRESS", label: "در حال پیگیری" },
  { value: "CONTACTED", label: "تماس گرفته شد" },
  { value: "DONE", label: "انجام شده" },
  { value: "REJECTED", label: "رد شده" },
];

const TYPE_OPTIONS = [
  { value: "CALLBACK", label: "درخواست تماس" },
  { value: "GENERAL", label: "عمومی" },
  { value: "B2B", label: "همکاری" },
  { value: "CUSTOM_TOUR", label: "تور اختصاصی" },
  { value: "JOB", label: "استخدام" },
];

interface RequestsClientProps {
  requests: RequestItem[];
  canUpdate: boolean;
  canDelete: boolean;
}

export function RequestsClient({ requests, canUpdate, canDelete }: RequestsClientProps) {
  const [items, setItems] = useState<RequestItem[]>(requests);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [isPending, startTransition] = useTransition();

  const openView = (req: RequestItem) => {
    setSelected(req);
    setViewOpen(true);
  };

  const openEdit = (req: RequestItem) => {
    setSelected(req);
    setStatus(req.status);
    setNotes(req.notes || "");
    setAssignedTo(req.assignedTo || "");
    setEditOpen(true);
  };

  const openDelete = (req: RequestItem) => {
    setSelected(req);
    setDeleteOpen(true);
  };

  const handleUpdate = () => {
    if (!selected) return;
    startTransition(async () => {
      try {
        const updated = await updateContactRequest(selected.id, {
          status,
          notes,
          assignedTo,
        });
        setItems((prev) =>
          prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
        );
        setEditOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در بروزرسانی");
      }
    });
  };

  const handleDelete = () => {
    if (!selected) return;
    startTransition(async () => {
      try {
        await deleteContactRequest(selected.id);
        setItems((prev) => prev.filter((r) => r.id !== selected.id));
        setDeleteOpen(false);
        setSelected(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const statusType = (status: string) => {
    switch (status) {
      case "DONE":
        return "success";
      case "CONTACTED":
        return "info";
      case "IN_PROGRESS":
        return "warning";
      case "REJECTED":
        return "danger";
      default:
        return "default";
    }
  };

  const statusLabel = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.label || status;

  const typeLabel = (type: string) =>
    TYPE_OPTIONS.find((t) => t.value === type)?.label || type;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">درخواست‌های تماس</h1>

      <DataTable
        data={items}
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: "name",
            title: "نام",
            render: (row) => <span className="font-medium">{row.name}</span>,
          },
          {
            key: "phone",
            title: "موبایل",
            render: (row) => (
              <a href={`tel:${row.phone}`} className="text-primary hover:underline" dir="ltr">
                {row.phone}
              </a>
            ),
          },
          {
            key: "type",
            title: "نوع",
            render: (row) => typeLabel(row.type),
          },
          {
            key: "subject",
            title: "موضوع",
            render: (row) => row.subject || "—",
          },
          {
            key: "status",
            title: "وضعیت",
            render: (row) => (
              <StatusBadge type={statusType(row.status)}>{statusLabel(row.status)}</StatusBadge>
            ),
          },
          {
            key: "assignedTo",
            title: "اختصاص به",
            render: (row) => row.assignedTo || "—",
          },
          {
            key: "createdAt",
            title: "تاریخ",
            render: (row) => formatJalali(row.createdAt),
          },
        ]}
        onView={openView}
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={canDelete ? openDelete : undefined}
        searchKeys={["name", "phone", "email", "subject", "message"]}
      />

      {/* View modal */}
      <FormModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="جزئیات درخواست"
        size="md"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-stone-500">نام</Label>
                <div className="font-medium">{selected.name}</div>
              </div>
              <div>
                <Label className="text-stone-500">موبایل</Label>
                <a href={`tel:${selected.phone}`} className="text-primary" dir="ltr">
                  {selected.phone}
                </a>
              </div>
            </div>
            {selected.email && (
              <div>
                <Label className="text-stone-500">ایمیل</Label>
                <div dir="ltr">{selected.email}</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-stone-500">نوع</Label>
                <div>{typeLabel(selected.type)}</div>
              </div>
              <div>
                <Label className="text-stone-500">موضوع</Label>
                <div>{selected.subject || "—"}</div>
              </div>
            </div>
            <div>
              <Label className="text-stone-500">پیام</Label>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                {selected.message || "—"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-stone-500">وضعیت</Label>
                <div>
                  <StatusBadge type={statusType(selected.status)}>
                    {statusLabel(selected.status)}
                  </StatusBadge>
                </div>
              </div>
              <div>
                <Label className="text-stone-500">اختصاص به</Label>
                <div>{selected.assignedTo || "—"}</div>
              </div>
            </div>
            {selected.notes && (
              <div>
                <Label className="text-stone-500">یادداشت‌ها</Label>
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                  {selected.notes}
                </div>
              </div>
            )}
            {selected.resumeUrl && (
              <div>
                <Label className="text-stone-500">رزومه</Label>
                <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="text-primary">
                  مشاهده رزومه
                </a>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Edit status/notes modal */}
      <FormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="بروزرسانی وضعیت"
        onSubmit={handleUpdate}
        loading={isPending}
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-stone-500">نام</Label>
                <div className="font-medium">{selected.name}</div>
              </div>
              <div>
                <Label className="text-stone-500">موبایل</Label>
                <div dir="ltr">{selected.phone}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
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
              <Label>اختصاص به</Label>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="نام کارشناس"
              />
            </div>
            <div className="space-y-2">
              <Label>یادداشت‌ها</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="یادداشت داخلی درباره این درخواست..."
                rows={5}
              />
            </div>
          </div>
        )}
      </FormModal>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف درخواست"
        description={`آیا از حذف درخواست «${selected?.name || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
