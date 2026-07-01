"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StringListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function StringListInput({ value, onChange, label = "لیست", placeholder = "مقدار جدید" }: StringListInputProps) {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    onChange([...value, input.trim()]);
    setInput("");
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
        />
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-100 text-stone-700 text-sm">
            {item}
            <button type="button" onClick={() => removeItem(index)} className="hover:text-red-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
