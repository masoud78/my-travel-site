"use client";

import { useState, useMemo } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ServiceTemplate {
  id: string;
  type: string;
  label: string;
}

interface TemplateSelectorProps {
  type: "INCLUDE" | "EXCLUDE" | "REQUIREMENT" | "AMENITY" | "ORIGIN" | "CANCELLATION";
  label: string;
  templates: ServiceTemplate[];
  value: string; // newline-separated
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TemplateSelector({
  type,
  label,
  templates,
  value,
  onChange,
  placeholder,
}: TemplateSelectorProps) {
  const [custom, setCustom] = useState("");

  const selected = useMemo(() => {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }, [value]);

  const available = useMemo(
    () => templates.filter((t) => t.type === type && !selected.includes(t.label)),
    [templates, type, selected]
  );

  const add = (item: string) => {
    if (!item.trim()) return;
    if (selected.includes(item.trim())) return;
    onChange([...selected, item.trim()].join("\n"));
  };

  const remove = (item: string) => {
    onChange(selected.filter((s) => s !== item).join("\n"));
  };

  const addCustom = () => {
    if (!custom.trim()) return;
    add(custom.trim());
    setCustom("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-200 text-sm"
            >
              <GripVertical className="w-3 h-3 text-primary-300" />
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                className="mr-1 p-0.5 hover:bg-primary-100 rounded"
                aria-label={`حذف ${item}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {available.map((t) => (
          <Button
            key={t.id}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => add(t.label)}
            className="text-xs"
          >
            <Plus className="w-3 h-3 ml-1" />
            {t.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={placeholder || "مورد دلخواه را تایپ کنید و Enter بزنید"}
          className="text-sm"
        />
        <Button type="button" variant="secondary" size="sm" onClick={addCustom}>
          افزودن
        </Button>
      </div>
    </div>
  );
}
