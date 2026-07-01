"use client";

import { useState } from "react";
import { TourCard, TourCardData } from "@/components/tour/tour-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimilarToursProps {
  tours: TourCardData[];
}

export function SimilarToursCarousel({ tours }: SimilarToursProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;
  const totalPages = Math.ceil(tours.length / itemsPerPage);

  if (!tours.length) return null;

  const visible = tours.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visible.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            aria-label="صفحه قبل"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-stone-500">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            aria-label="صفحه بعد"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
