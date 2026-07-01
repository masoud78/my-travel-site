"use client";

import { useState } from "react";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<T> {
  data: T[];
  columns: { key: keyof T | string; title: string; render?: (row: T) => React.ReactNode }[];
  keyExtractor: (row: T) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onEdit,
  onDelete,
  onView,
  searchable = true,
  searchKeys = [],
  actions,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = searchable && query
    ? data.filter((row) =>
        searchKeys.some((k) => {
          const value = row[k];
          return value != null && String(value).toLowerCase().includes(query.toLowerCase());
        })
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="جستجو..."
            className="pr-10"
          />
        </div>
      )}
      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-4 py-3 text-right font-semibold text-stone-700">
                    {col.title}
                  </th>
                ))}
                {(onEdit || onDelete || onView || actions) && (
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">عملیات</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginated.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-stone-50/60 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-stone-700">
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key as string] ?? "-")}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView || actions) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {onView && (
                          <Button variant="ghost" size="icon" onClick={() => onView(row)}>
                            <Eye className="w-4 h-4 text-stone-500" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="icon" onClick={() => onDelete(row)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                        {actions?.(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-stone-400">
                    رکوردی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200">
            <span className="text-sm text-stone-500">صفحه {page} از {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
