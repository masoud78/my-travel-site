"use client";

import { useState } from "react";
import { Search, Upload, X, ImageIcon, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaItem } from "./media-gallery";

interface MediaPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  media?: MediaItem[];
}

export function MediaPicker({ value, onChange, label = "تصویر", placeholder = "/images/placeholder.jpg", media = [] }: MediaPickerProps) {
  const [preview, setPreview] = useState(value || "");
  const [tab, setTab] = useState("url");
  const [search, setSearch] = useState("");

  const handleChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const filtered = media.filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 rounded-xl border border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
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
                  const url = prompt("آدرس تصویر را وارد کنید:", preview || placeholder);
                  if (url) handleChange(url);
                }}
              >
                <Upload className="w-4 h-4 ml-2" />
                وارد کردن URL
              </Button>
            </TabsContent>
            <TabsContent value="gallery" className="mt-2">
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50">
                <div className="relative mb-3">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در رسانه..."
                    className="pr-9"
                  />
                </div>
                {media.length === 0 ? (
                  <div className="text-center py-6 text-stone-500 text-sm">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    رسانه‌ای موجود نیست. ابتدا از منوی «رسانه» آپلود کنید.
                  </div>
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
                      >
                        <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
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
              حذف تصویر
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
