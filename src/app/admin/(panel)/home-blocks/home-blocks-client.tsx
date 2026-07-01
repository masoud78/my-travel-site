"use client";

import { useState, useTransition } from "react";
import { Plus, LayoutGrid, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  createHomeBlock,
  updateHomeBlock,
  deleteHomeBlock,
  type HomeBlockInput,
} from "@/lib/admin-actions";
import type { HomeBlock } from "@prisma/client";

type HomeBlockItem = HomeBlock;

const LAYOUT_OPTIONS = [
  { value: "GRID_3", label: "گرید ۳ ستونه" },
  { value: "GRID_4", label: "گرید ۴ ستونه" },
  { value: "LIST", label: "لیست" },
  { value: "CAROUSEL", label: "کاروسل" },
  { value: "HERO_CARDS", label: "کارت‌های بزرگ" },
];

const FILTER_OPTIONS = [
  { value: "CATEGORY", label: "دسته‌بندی" },
  { value: "FEATURED", label: "تورهای ویژه" },
  { value: "LAST_MINUTE", label: "آخرین فرصت" },
  { value: "DESTINATION", label: "مقصد" },
  { value: "CUSTOM", label: "دستی (آی‌دی تورها)" },
];

const emptyForm: HomeBlockInput = {
  title: "",
  subtitle: "",
  layout: "GRID_3",
  filterType: "CATEGORY",
  filterValue: "",
  order: 0,
  isActive: true,
};

interface HomeBlocksClientProps {
  blocks: HomeBlockItem[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function HomeBlocksClient({ blocks, canCreate, canUpdate, canDelete }: HomeBlocksClientProps) {
  const [items, setItems] = useState<HomeBlockItem[]>(blocks);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<HomeBlockItem | null>(null);
  const [deleting, setDeleting] = useState<HomeBlockItem | null>(null);
  const [form, setForm] = useState<HomeBlockInput>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (block: HomeBlockItem) => {
    setEditing(block);
    setForm({
      title: block.title,
      subtitle: block.subtitle || "",
      layout: block.layout,
      filterType: block.filterType,
      filterValue: block.filterValue || "",
      order: block.order,
      isActive: block.isActive,
    });
    setIsOpen(true);
  };

  const openDelete = (block: HomeBlockItem) => {
    setDeleting(block);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        ...form,
        order: Number(form.order ?? 0),
        filterValue: form.filterValue?.trim() || undefined,
      };
      try {
        if (editing) {
          await updateHomeBlock(editing.id, data);
          setItems((prev) =>
            prev.map((b) =>
              b.id === editing.id
                ? { ...b, ...data, id: b.id, createdAt: b.createdAt, updatedAt: new Date() }
                : b
            )
          );
        } else {
          const created = await createHomeBlock(data);
          setItems((prev) => [...prev, created]);
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
        await deleteHomeBlock(deleting.id);
        setItems((prev) => prev.filter((b) => b.id !== deleting.id));
        setIsDeleteOpen(false);
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const layoutLabel = (v: string) => LAYOUT_OPTIONS.find((l) => l.value === v)?.label || v;
  const filterLabel = (v: string) => FILTER_OPTIONS.find((f) => f.value === v)?.label || v;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            بلوک‌های صفحه اصلی
          </h1>
          <p className="text-sm text-stone-500 mt-1">مدیریت بخش‌های داینامیک تور در صفحه نخست</p>
        </div>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 ml-2" />
            بلوک جدید
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
              <div>
                <div className="font-medium text-stone-900">{row.title}</div>
                {row.subtitle && <div className="text-xs text-stone-500">{row.subtitle}</div>}
              </div>
            ),
          },
          {
            key: "layout",
            title: "چیدمان",
            render: (row) => (
              <span className="inline-flex items-center gap-1 text-stone-600">
                <LayoutGrid className="w-3.5 h-3.5" />
                {layoutLabel(row.layout)}
              </span>
            ),
          },
          {
            key: "filterType",
            title: "فیلتر",
            render: (row) => (
              <div>
                <div>{filterLabel(row.filterType)}</div>
                {row.filterValue && (
                  <div dir="ltr" className="text-xs text-stone-500 truncate max-w-[140px]">
                    {row.filterValue}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "order",
            title: "ترتیب",
            render: (row) => <span className="num-en">{row.order}</span>,
          },
          {
            key: "isActive",
            title: "وضعیت",
            render: (row) =>
              row.isActive ? (
                <StatusBadge type="success">فعال</StatusBadge>
              ) : (
                <StatusBadge type="danger">غیرفعال</StatusBadge>
              ),
          },
        ]}
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={canDelete ? openDelete : undefined}
        searchKeys={["title", "subtitle", "filterValue"]}
      />

      <FormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "ویرایش بلوک" : "بلوک جدید"}
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
                placeholder="تورهای ویژه نوروز"
              />
            </div>
            <div className="space-y-2">
              <Label>زیرعنوان</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="پیشنهادهای محدود این هفته"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>چیدمان</Label>
              <Select
                value={form.layout}
                onValueChange={(v) => setForm({ ...form, layout: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نوع فیلتر</Label>
              <Select
                value={form.filterType}
                onValueChange={(v) => setForm({ ...form, filterType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
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
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>مقدار فیلتر</Label>
            <Input
              value={form.filterValue}
              onChange={(e) => setForm({ ...form, filterValue: e.target.value })}
              placeholder={
                form.filterType === "CUSTOM"
                  ? '["id1","id2"]'
                  : form.filterType === "DESTINATION"
                  ? "antalya"
                  : "turkey"
              }
              dir="ltr"
            />
            <p className="text-xs text-stone-500">
              برای دستی، آرایه‌ای از آی‌دی تورها وارد کنید. برای دسته‌بندی/مقصد، اسلاگ مربوطه.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 bg-stone-50/50">
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => setForm({ ...form, isActive: v })}
            />
            <div>
              <Label className="cursor-pointer">بلوک فعال باشد</Label>
              <p className="text-xs text-stone-500">بلوک‌های غیرفعال در صفحه اصلی نمایش داده نمی‌شوند.</p>
            </div>
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف بلوک"
        description={`آیا از حذف «${deleting?.title || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
