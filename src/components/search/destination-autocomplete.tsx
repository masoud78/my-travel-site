"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  type: string;
}

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string, destination?: Destination) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function DestinationAutocomplete({
  value,
  onChange,
  placeholder = "مقصد مورد نظر را جستجو کنید",
  label,
  className,
}: DestinationAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlledUpdate = useRef(false);

  useEffect(() => {
    if (value !== query && !isControlledUpdate.current) {
      isControlledUpdate.current = true;
      setQuery(value || "");
      setTimeout(() => {
        isControlledUpdate.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchDestinations() {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search/destinations?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setSuggestions(data.destinations || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(fetchDestinations, 250);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = useCallback(
    (dest: Destination) => {
      setQuery(dest.name);
      setOpen(false);
      onChange(dest.id, dest);
    },
    [onChange]
  );

  const clear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && <Label className="mb-1.5 block">{label}</Label>}
      <div className="relative">
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange("");
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pr-10 pl-9"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            aria-label="پاک کردن"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {loading && (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 animate-spin" />
        )}
      </div>
      {open && (suggestions.length > 0 || (query && !loading)) && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-stone-200 bg-white shadow-lg max-h-60 overflow-auto">
          {suggestions.map((dest) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => select(dest)}
              className="w-full text-right px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between transition-colors"
            >
              <span className="text-sm text-stone-900">{dest.name}</span>
              {dest.nameEn && (
                <span className="text-xs text-stone-400" dir="ltr">
                  {dest.nameEn}
                </span>
              )}
            </button>
          ))}
          {query && !loading && suggestions.length === 0 && (
            <div className="px-4 py-3 text-sm text-stone-500">مقصدی یافت نشد</div>
          )}
        </div>
      )}
    </div>
  );
}
