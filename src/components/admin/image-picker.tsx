"use client";

import { useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImagePicker({ value, onChange, label = "تصویر", placeholder = "/images/placeholder.jpg" }: ImagePickerProps) {
  const [preview, setPreview] = useState(value || "");

  const handleChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 rounded-xl border border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-stone-300" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            value={preview}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            dir="ltr"
          />
          <div className="flex gap-2">
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
              انتخاب از URL
            </Button>
            {preview && (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleChange("")}>
                <X className="w-4 h-4 ml-2" />
                حذف
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
