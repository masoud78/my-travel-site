"use client";

import { useState, useTransition } from "react";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { createJob, updateJob, deleteJob, type getJobs } from "@/lib/admin-actions";
import { formatJalali, slugify } from "@/lib/utils";

type JobItem = Awaited<ReturnType<typeof getJobs>>[number];

const TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "تمام‌وقت" },
  { value: "PART_TIME", label: "پاره‌وقت" },
  { value: "REMOTE", label: "دورکاری" },
  { value: "INTERN", label: "کارآموزی" },
];

interface JobsTabProps {
  jobs: JobItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const emptyForm = {
  title: "",
  slug: "",
  type: "FULL_TIME",
  city: "",
  department: "",
  description: "",
  requirements: "",
  benefits: "",
  isActive: true,
};

export function JobsTab({ jobs, canCreate, canUpdate, canDelete }: JobsTabProps) {
  const [items, setItems] = useState<JobItem[]>(jobs);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<JobItem | null>(null);
  const [deleting, setDeleting] = useState<JobItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (job: JobItem) => {
    setEditing(job);
    setForm({
      title: job.title,
      slug: job.slug,
      type: job.type,
      city: job.city || "",
      department: job.department || "",
      description: job.description,
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      isActive: job.isActive,
    });
    setIsOpen(true);
  };

  const openDelete = (job: JobItem) => {
    setDeleting(job);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        type: form.type,
        city: form.city,
        department: form.department,
        description: form.description,
        requirements: form.requirements,
        benefits: form.benefits,
        isActive: form.isActive,
      };
      try {
        if (editing) {
          const updated = await updateJob(editing.id, data);
          setItems((prev) =>
            prev.map((j) => (j.id === updated.id ? { ...j, ...updated } : j))
          );
        } else {
          const created = await createJob(data);
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
        await deleteJob(deleting.id);
        setItems((prev) => prev.filter((j) => j.id !== deleting.id));
        setIsDeleteOpen(false);
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const typeLabel = (type: string) =>
    TYPE_OPTIONS.find((t) => t.value === type)?.label || type;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          فرصت‌های شغلی
        </h2>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 ml-2" />
            موقعیت شغلی جدید
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
            render: (row) => <span className="font-medium">{row.title}</span>,
          },
          { key: "type", title: "نوع", render: (row) => typeLabel(row.type) },
          { key: "department", title: "دپارتمان", render: (row) => row.department || "—" },
          { key: "city", title: "شهر", render: (row) => row.city || "—" },
          {
            key: "isActive",
            title: "وضعیت",
            render: (row) => (
              <StatusBadge type={row.isActive ? "success" : "default"}>
                {row.isActive ? "فعال" : "غیرفعال"}
              </StatusBadge>
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
        searchKeys={["title", "department", "city"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش موقعیت شغلی" : "موقعیت شغلی جدید"}
        onSubmit={handleSubmit}
        loading={isPending}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عنوان شغل</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مشاور فروش تور"
              />
            </div>
            <div className="space-y-2">
              <Label>اسلاگ</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="sales-consultant"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>نوع همکاری</Label>
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
              <Label>دپارتمان</Label>
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="فروش"
              />
            </div>
            <div className="space-y-2">
              <Label>شهر</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="تهران"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>شرح موقعیت شغلی</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="توضیحات کامل موقعیت شغلی"
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label>شرایط و نیازمندی‌ها</Label>
            <Textarea
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              placeholder="شرایط، مهارت‌ها و مدارک مورد نیاز"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>مزایا</Label>
            <Textarea
              value={form.benefits}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              placeholder="مزایا و حقوق"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-3 py-2">
            <Switch
              id="job-active"
              checked={form.isActive}
              onCheckedChange={(v) => setForm({ ...form, isActive: v })}
            />
            <Label htmlFor="job-active" className="cursor-pointer">
              فعال
            </Label>
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف موقعیت شغلی"
        description={`آیا از حذف «${deleting?.title || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
