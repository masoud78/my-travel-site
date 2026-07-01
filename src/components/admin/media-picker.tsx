"use client";

import { useState } from "react";
import { Search, Upload, X, ImageIcon, FolderOpen, Music, Video, FileText, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MediaLibrary } from "@prisma/client";

const MEDIA_TYPES: { value: string; label: string }[] = [
  { value: "ALL", label: "همه" },
  { value: "IMAGE", label: "تصویر" },
  { value: "VIDEO", label: "ویدیو" },
  { value: "AUDIO", label: "صوت" },
  { value: "FILE", label: "فایل" },
];

const FILE_ICONS: Record<string, React.ReactNode> = {
  IMAGE: <ImageIcon className="w-8 h-8 text-blue-500" />,
  VIDEO: <Video className="w-8 h-8 text-purple-500" />,
  AUDIO: <Music className="w-8 h-8 text-amber-500" />,
  FILE: <FileText className="w-8 h-8 text-stone-500" />,
};

interface MediaPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  media?: MediaLibrary[];
  acceptTypes?: ("IMAGE" | "VIDEO" | "AUDIO" | "FILE")[];
}

function typeLabel(type: string): string {
  return MEDIA_TYPES.find((t) => t.value === type)?.label || type;
}

function MediaThumb({ item }: { item: MediaLibrary }) {
  if (item.type === "IMAGE") {
    return <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-2">
      {FILE_ICONS[item.type] || <FileQuestion className="w-8 h-8" />}
      <span className="text-[10px] mt-1 text-center leading-tight">{typeLabel(item.type)}</span>
    </div>
  );
}

export function MediaPicker({
  value,
  onChange,
  label = "رسانه",
  placeholder = "/images/placeholder.jpg",
  media = [],
  acceptTypes,
}: MediaPickerProps) {
  const [preview, setPreview] = useState(value || "");
  const [tab, setTab] = useState("url");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const handleChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const filtered = media.filter((m) => {
    const matchesSearch = !search || m.filename.toLowerCase().includes(search.toLowerCase()) || (m.originalName && m.originalName.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "ALL" || m.type === typeFilter;
    const matchesAccept = !acceptTypes || acceptTypes.length === 0 || acceptTypes.includes(m.type as "IMAGE" | "VIDEO" | "AUDIO" | "FILE");
    return matchesSearch && matchesType && matchesAccept;
  });

  const isImagePreview = preview.match(/\.(jpeg|jpg|png|webp|avif|gif|svg)(\?.*)?$/i);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 rounded-xl border border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            isImagePreview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-500 p-2">
                <FileText className="w-8 h-8" />
                <span className="text-[10px] mt-1 text-center leading-tight">URL</span>
              </div>
            )
          ) : (
            <ImageIcon className="w-8 h-8 text-stone-300" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">آدرس URL</TabsTrigger>
              <TabsTrigger value="gallery">انتخاب از رسانه</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-2 mt-2">
              <Input
                value={preview}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                dir="ltr"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = prompt("آدرس رسانه را وارد کنید:", preview || placeholder);
                  if (url) handleChange(url);
                }}
              >
                <Upload className="w-4 h-4 ml-2" />
                وارد کردن URL
              </Button>
            </TabsContent>
            <TabsContent value="gallery" className="mt-2">
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50">
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="جستجو در رسانه..."
                      className="pr-9"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="نوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIA_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {media.length === 0 ? (
                  <div className="text-center py-6 text-stone-500 text-sm">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    رسانه‌ای موجود نیست. ابتدا از منوی «رسانه» آپلود کنید.
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-6 text-stone-500 text-sm">موردی یافت نشد</div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                    {filtered.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleChange(m.url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          preview === m.url ? "border-primary ring-2 ring-primary/20" : "border-stone-200 hover:border-primary/50"
                        }`}
                        title={m.originalName || m.filename}
                      >
                        <MediaThumb item={m} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          {preview && (
            <Button type="button" variant="ghost" size="sm" onClick={() => handleChange("")} className="text-red-600 hover:text-red-700">
              <X className="w-4 h-4 ml-2" />
              حذف
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
