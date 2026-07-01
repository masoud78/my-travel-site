"use client";

import { useMemo, useState, useTransition, useRef, useCallback } from "react";
import { Upload, Search, Trash2, X, FileText, Music, Video, ImageIcon, FileQuestion, FolderOpen, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import { FormModal } from "@/components/admin/form-modal";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { createMedia, deleteMedia } from "@/lib/admin-actions";
import { toFa, formatDateTime } from "@/lib/jalali";
import { formatBytes, cn } from "@/lib/utils";
import type { MediaLibrary } from "@prisma/client";

const MEDIA_TYPES: { value: string; label: string }[] = [
  { value: "ALL", label: "همه" },
  { value: "IMAGE", label: "تصویر" },
  { value: "VIDEO", label: "ویدیو" },
  { value: "AUDIO", label: "صوت" },
  { value: "FILE", label: "فایل" },
];

const FILE_ICONS: Record<string, React.ReactNode> = {
  IMAGE: <ImageIcon className="w-6 h-6 text-blue-500" />,
  VIDEO: <Video className="w-6 h-6 text-purple-500" />,
  AUDIO: <Music className="w-6 h-6 text-amber-500" />,
  FILE: <FileText className="w-6 h-6 text-stone-500" />,
};

type UploadTab = "file" | "url";

function guessTypeFromMime(mime: string): string {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.startsWith("audio/")) return "AUDIO";
  return "FILE";
}

function guessMimeFromUrl(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "png": return "image/png";
    case "webp": return "image/webp";
    case "avif": return "image/avif";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    case "mp4": return "video/mp4";
    case "webm": return "video/webm";
    case "mp3": return "audio/mpeg";
    case "ogg": return "audio/ogg";
    case "wav": return "audio/wav";
    case "pdf": return "application/pdf";
    default: return "image/jpeg";
  }
}

function typeLabel(type: string): string {
  return MEDIA_TYPES.find((t) => t.value === type)?.label || type;
}

function MediaPreview({ item, className }: { item: MediaLibrary; className?: string }) {
  if (item.type === "IMAGE") {
    return <img src={item.url} alt={item.altText || item.filename} className={className} />;
  }
  if (item.type === "VIDEO") {
    return (
      <video src={item.url} className={className} controls preload="metadata">
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>
    );
  }
  if (item.type === "AUDIO") {
    return <audio src={item.url} controls className="w-full" preload="metadata" />;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-stone-500">
      {FILE_ICONS[item.type] || <FileQuestion className="w-8 h-8" />}
      <span className="text-xs">{item.mimeType}</span>
    </div>
  );
}

export function MediaClient({ data, canManage }: { data: MediaLibrary[]; canManage: boolean }) {
  const [items, setItems] = useState<MediaLibrary[]>(data);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<MediaLibrary | null>(null);
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [uploadTab, setUploadTab] = useState<UploadTab>("file");
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort() as string[],
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.filename.toLowerCase().includes(query.toLowerCase()) ||
        (item.originalName && item.originalName.toLowerCase().includes(query.toLowerCase())) ||
        (item.altText && item.altText.toLowerCase().includes(query.toLowerCase())) ||
        item.mimeType.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [items, query, typeFilter, categoryFilter]);

  const resetModal = useCallback(() => {
    setFiles([]);
    setUrl("");
    setAltText("");
    setCategory("");
    setUploadTab("file");
    setOpen(false);
  }, []);

  const handleFileSelect = (selected: FileList | null) => {
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const uploadFile = async (file: File): Promise<MediaLibrary> => {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "خطا در آپلود فایل");
    return json.media as MediaLibrary;
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (uploadTab === "file") {
          if (files.length === 0) {
            alert("فایلی انتخاب نشده است");
            return;
          }
          const created = await Promise.all(files.map((f) => uploadFile(f)));
          setItems((prev) => [...created, ...prev]);
        } else {
          if (!url.trim()) {
            alert("آدرس URL را وارد کنید");
            return;
          }
          const mimeType = guessMimeFromUrl(url);
          const type = guessTypeFromMime(mimeType);
          const filename = url.split("/").pop()?.split("?")[0] || "external";
          const created = await createMedia({
            filename,
            originalName: filename,
            mimeType,
            type,
            category: category || undefined,
            size: 0,
            url: url.trim(),
            altText: altText || filename,
          });
          setItems((prev) => [created, ...prev]);
        }
        resetModal();
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در آپلود رسانه");
      }
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      try {
        await deleteMedia(deleting.id);
        setItems((prev) => prev.filter((i) => i.id !== deleting.id));
        setDeleting(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "خطا در حذف");
      }
    });
  };

  const copyUrl = async (u: string) => {
    try {
      await navigator.clipboard.writeText(u);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">مدیریت رسانه</h1>
          <p className="text-sm text-stone-500 mt-1">آپلود فایل، مدیریت URL و فیلتر گالری</p>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              resetModal();
              setOpen(true);
            }}
          >
            <Upload className="w-4 h-4 ml-2" />
            افزودن رسانه
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو بر اساس نام فایل، نام اصلی یا alt..."
            className="pr-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-40">
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه دسته‌ها</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-stone-500">
          <FolderOpen className="w-10 h-10 mx-auto mb-3 text-stone-300" />
          <p>رسانه‌ای یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square bg-stone-100 flex items-center justify-center overflow-hidden">
                {item.type === "IMAGE" ? (
                  <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover" />
                ) : item.type === "VIDEO" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted preload="metadata" />
                ) : (
                  <div className="flex flex-col items-center text-stone-500">
                    {FILE_ICONS[item.type] || <FileQuestion className="w-10 h-10" />}
                    <span className="text-xs mt-2">{typeLabel(item.type)}</span>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-xs font-medium text-stone-700 truncate" title={item.originalName || item.filename}>
                  {item.originalName || item.filename}
                </p>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{typeLabel(item.type)}</span>
                  <span>{formatBytes(item.size)}</span>
                </div>
                {item.category && <span className="inline-block text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{item.category}</span>}
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="w-7 h-7 bg-white/90"
                  onClick={() => copyUrl(item.url)}
                  title="کپی URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <a href={item.url} target="_blank" rel="noreferrer">
                  <Button type="button" size="icon" variant="secondary" className="w-7 h-7 bg-white/90" title="مشاهده">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
                {canManage && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="w-7 h-7 bg-white/90 text-red-600 hover:text-red-700"
                    onClick={() => setDeleting(item)}
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        data={filtered}
        keyExtractor={(row) => row.id}
        searchKeys={[]}
        searchable={false}
        columns={[
          {
            key: "preview",
            title: "پیش‌نمایش",
            render: (row) =>
              row.type === "IMAGE" ? (
                <img src={row.url} alt={row.altText || ""} className="w-16 h-10 object-cover rounded border border-stone-200" />
              ) : (
                <div className="w-16 h-10 rounded border border-stone-200 bg-stone-50 flex items-center justify-center">
                  {FILE_ICONS[row.type] || <FileQuestion className="w-4 h-4 text-stone-400" />}
                </div>
              ),
          },
          { key: "filename", title: "نام فایل" },
          {
            key: "type",
            title: "نوع",
            render: (row) => typeLabel(row.type),
          },
          {
            key: "category",
            title: "دسته‌بندی",
            render: (row) => row.category || "—",
          },
          {
            key: "size",
            title: "حجم",
            render: (row) => formatBytes(row.size),
          },
          {
            key: "createdAt",
            title: "تاریخ آپلود",
            render: (row) => formatDateTime(row.createdAt),
          },
        ]}
        onDelete={canManage ? setDeleting : undefined}
        actions={(row) => (
          <Button variant="ghost" size="icon" onClick={() => copyUrl(row.url)} title="کپی URL">
            <Copy className="w-4 h-4 text-stone-500" />
          </Button>
        )}
      />

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="افزودن رسانه"
        onSubmit={handleSubmit}
        loading={isPending}
      >
        <div className="space-y-4">
          <Tabs value={uploadTab} onValueChange={(v) => setUploadTab(v as UploadTab)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">آپلود فایل</TabsTrigger>
              <TabsTrigger value="url">آدرس URL</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={cn(
                "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-stone-300 bg-stone-50 hover:border-primary/50"
              )}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                <p className="text-sm font-medium text-stone-700">فایل‌ها را اینجا رها کنید یا کلیک کنید</p>
                <p className="text-xs text-stone-500 mt-1">حداکثر ۵۰ مگابایت برای هر فایل</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>

              {files.length > 0 && (
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-stone-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-stone-400 shrink-0" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-stone-500 shrink-0">({formatBytes(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <Label>آدرس فایل (URL)</Label>
                <Input
                  dir="ltr"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              {url && (
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-3">
                  <span className="text-xs text-stone-500 block mb-2">پیش‌نمایش</span>
                  <MediaPreview
                    item={{
                      id: "preview",
                      filename: "preview",
                      originalName: "preview",
                      mimeType: guessMimeFromUrl(url),
                      type: guessTypeFromMime(guessMimeFromUrl(url)),
                      category: null,
                      size: 0,
                      url,
                      altText: null,
                      width: null,
                      height: null,
                      uploadedBy: null,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    }}
                    className="max-h-40 w-full rounded-lg object-contain"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>دسته‌بندی (اختیاری)</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="مثلاً گالری، اسلایدر" />
            </div>
            <div>
              <Label>متن جایگزین (ALT)</Label>
              <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="توضیح کوتاه" />
            </div>
          </div>
        </div>
      </FormModal>

      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="حذف رسانه"
        description={`آیا از حذف «${deleting?.filename || ""}» اطمینان دارید؟`}
        loading={isPending}
      />
    </div>
  );
}
