"use client";

import { useState, useTransition } from "react";
import { Save, Trash2, Menu, Smartphone, PanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagePicker } from "@/components/admin/image-picker";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { upsertMenuSetting, deleteMenuSetting, type MenuSettingInput } from "@/lib/admin-actions";
import type { MenuSetting } from "@prisma/client";

type MenuSettingItem = MenuSetting;

const LOCATIONS = [
  { value: "HEADER", label: "هدر", icon: PanelTop },
  { value: "FOOTER", label: "فوتر", icon: Menu },
  { value: "MOBILE", label: "موبایل", icon: Smartphone },
];

const emptyForm: MenuSettingInput = {
  location: "HEADER",
  logo: "",
  title: "",
  subtitle: "",
  isActive: true,
};

interface MenuSettingsClientProps {
  settings: MenuSettingItem[];
  canUpdate: boolean;
  canDelete: boolean;
}

export function MenuSettingsClient({ settings, canUpdate, canDelete }: MenuSettingsClientProps) {
  const [items, setItems] = useState<MenuSettingItem[]>(settings);
  const [selectedLocation, setSelectedLocation] = useState<string>("HEADER");
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const current = items.find((s) => s.location === selectedLocation);
  const [form, setForm] = useState<MenuSettingInput>({
    location: selectedLocation,
    logo: current?.logo || "",
    title: current?.title || "",
    subtitle: current?.subtitle || "",
    isActive: current?.isActive ?? true,
  });

  const selectLocation = (loc: string) => {
    setSelectedLocation(loc);
    const found = items.find((s) => s.location === loc);
    setForm({
      location: loc,
      logo: found?.logo || "",
      title: found?.title || "",
      subtitle: found?.subtitle || "",
      isActive: found?.isActive ?? true,
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const saved = await upsertMenuSetting({
          ...form,
          location: selectedLocation,
          logo: form.logo?.trim() || undefined,
          title: form.title?.trim() || undefined,
          subtitle: form.subtitle?.trim() || undefined,
        });
        setItems((prev) => {
          const filtered = prev.filter((s) => s.location !== saved.location);
          return [...filtered, saved];
        });
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در ذخیره‌سازی");
      }
    });
  };

  const handleDelete = () => {
    if (!current) return;
    startTransition(async () => {
      try {
        await deleteMenuSetting(current.id);
        setItems((prev) => prev.filter((s) => s.id !== current.id));
        setForm({ ...emptyForm, location: selectedLocation });
        setDeleteOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">تنظیمات منوها</h1>
          <p className="text-sm text-stone-500 mt-1">لوگو، عنوان و زیرعنوان هدر، فوتر و موبایل</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {LOCATIONS.map((loc) => {
            const Icon = loc.icon;
            const item = items.find((s) => s.location === loc.value);
            const active = selectedLocation === loc.value;
            return (
              <button
                key={loc.value}
                onClick={() => selectLocation(loc.value)}
                className={`w-full flex items-center justify-between rounded-xl border p-4 transition-all text-right ${
                  active
                    ? "border-primary bg-primary-50 shadow-sm"
                    : "border-stone-200 bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      active ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">{loc.label}</div>
                    <div className="text-xs text-stone-500">
                      {item?.title || "بدون عنوان"}
                    </div>
                  </div>
                </div>
                {item ? (
                  item.isActive ? (
                    <StatusBadge type="success">فعال</StatusBadge>
                  ) : (
                    <StatusBadge type="danger">غیرفعال</StatusBadge>
                  )
                ) : (
                  <StatusBadge type="default">تنظیم نشده</StatusBadge>
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-900">
              {LOCATIONS.find((l) => l.value === selectedLocation)?.label}
            </h2>
            {current && canDelete && (
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف تنظیمات
              </Button>
            )}
          </div>

          <div className="space-y-5">
            <ImagePicker
              label="لوگو"
              value={form.logo || ""}
              onChange={(v) => setForm({ ...form, logo: v })}
              placeholder="/images/logo.png"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عنوان</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ریوان سفر"
                />
              </div>
              <div className="space-y-2">
                <Label>زیرعنوان</Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="همسفر روان شما"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 bg-stone-50/50">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              />
              <div>
                <Label className="cursor-pointer">تنظیمات فعال باشد</Label>
                <p className="text-xs text-stone-500">تنظیمات غیرفعال در سایت اعمال نمی‌شود.</p>
              </div>
            </div>

            {canUpdate && (
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave} disabled={isPending}>
                  <Save className="w-4 h-4 ml-2" />
                  {isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="حذف تنظیمات منو"
        description={`آیا از حذف تنظیمات ${LOCATIONS.find((l) => l.value === selectedLocation)?.label} مطمئن هستید؟`}
        loading={isPending}
      />
    </div>
  );
}
