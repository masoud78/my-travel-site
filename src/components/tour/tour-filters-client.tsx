"use client";

import { Suspense } from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TourCard, TourCardData } from "@/components/tour/tour-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DestinationAutocomplete } from "@/components/search/destination-autocomplete";
import { SectionHeading } from "@/components/common/section";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DestinationOption {
  id: string;
  name: string;
}

interface TransportOption {
  id: string;
  name: string;
  type: string;
}

interface TourFiltersClientProps {
  tours: TourCardData[];
  destinations: DestinationOption[];
  transports: TransportOption[];
  category?: string;
  title?: string;
  subtitle?: string;
  basePath?: string;
  hideCategoryFilter?: boolean;
}

const transportTypes = [
  { value: "PLANE", label: "هواپیما" },
  { value: "TRAIN", label: "قطار" },
  { value: "BUS", label: "اتوبوس" },
  { value: "ROAD", label: "زمینی" },
  { value: "MIXED", label: "ترکیبی" },
];

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "duration-asc", label: "کوتاه‌ترین" },
  { value: "duration-desc", label: "بلندترین" },
];

export function TourFiltersClient(props: TourFiltersClientProps) {
  return (
    <Suspense fallback={<TourFiltersSkeleton {...props} />}>
      <TourFiltersInner {...props} />
    </Suspense>
  );
}

function TourFiltersSkeleton({ title, subtitle }: TourFiltersClientProps) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="h-10 bg-stone-100 rounded-lg flex-1" />
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-stone-100 rounded-lg" />
            <div className="h-10 w-24 bg-stone-100 rounded-lg" />
          </div>
        </div>
      </div>
      <SectionHeading title={title ?? "تورهای ریوان سفر"} subtitle={subtitle} className="mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-stone-100 rounded-2xl" />
        ))}
      </div>
    </>
  );
}

function TourFiltersInner({
  tours,
  transports,
  category,
  title = "تورهای ریوان سفر",
  subtitle,
  basePath = "/tours",
}: TourFiltersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [transportType, setTransportType] = useState(searchParams.get("transportType") || "");
  const [airline, setAirline] = useState(searchParams.get("airline") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minDuration, setMinDuration] = useState(searchParams.get("minDuration") || "");
  const [maxDuration, setMaxDuration] = useState(searchParams.get("maxDuration") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...tours];

    if (category) {
      result = result.filter((t) => t.category === category);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }

    if (destination) {
      result = result.filter((t) => t.destinationId === destination);
    }

    if (transportType) {
      result = result.filter((t) => t.transport === transportType);
    }

    if (airline) {
      result = result.filter((t) => t.transportId === airline);
    }

    if (minPrice) {
      result = result.filter((t) => t.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((t) => t.price <= Number(maxPrice));
    }

    if (minDuration) {
      result = result.filter((t) => t.duration >= Number(minDuration));
    }
    if (maxDuration) {
      result = result.filter((t) => t.duration <= Number(maxDuration));
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "duration-asc":
        result.sort((a, b) => a.duration - b.duration);
        break;
      case "duration-desc":
        result.sort((a, b) => b.duration - a.duration);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
    }

    return result;
  }, [tours, category, query, destination, transportType, airline, minPrice, maxPrice, minDuration, maxDuration, sort]);

  const hasActiveFilters =
    query || destination || transportType || airline || minPrice || maxPrice || minDuration || maxDuration;

  function clearFilters() {
    setQuery("");
    setDestination("");
    setTransportType("");
    setAirline("");
    setMinPrice("");
    setMaxPrice("");
    setMinDuration("");
    setMaxDuration("");
    setSort("newest");
    router.push(basePath, { scroll: false });
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (destination) params.set("destination", destination);
    if (transportType) params.set("transportType", transportType);
    if (airline) params.set("airline", airline);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minDuration) params.set("minDuration", minDuration);
    if (maxDuration) params.set("maxDuration", maxDuration);
    if (sort && sort !== "newest") params.set("sort", sort);
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }

  const priceRange = useMemo(() => {
    if (!tours.length) return { min: 0, max: 0 };
    const prices = tours.map((t) => t.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [tours]);

  return (
    <>
      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در نام تور یا مقصد..."
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setShowFilters((s) => !s)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              فیلترها
              {hasActiveFilters && (
                <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {[query, destination, transportType, airline, minPrice, maxPrice, minDuration, maxDuration].filter(
                    Boolean
                  ).length}
                </span>
              )}
            </Button>
            <Button type="button" onClick={applyFilters}>
              جستجو
            </Button>
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
            <div>
              <Label className="mb-1.5 block text-sm">مقصد</Label>
              <DestinationAutocomplete
                value={destination}
                onChange={(id) => setDestination(id)}
                placeholder="انتخاب مقصد"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">نوع حمل‌ونقل</Label>
              <Select value={transportType} onValueChange={setTransportType}>
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {transportTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">ایرلاین / ترانسفر</Label>
              <Select value={airline} onValueChange={setAirline}>
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {transports.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">محدوده قیمت (تومان)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="از"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-stone-400">-</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="تا"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              {priceRange.max > 0 && (
                <div className="text-xs text-stone-400 mt-1">
                  بازه: {formatPrice(priceRange.min)} تا {formatPrice(priceRange.max)}
                </div>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">مدت اقامت (شب)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="از"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                />
                <span className="text-stone-400">-</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="تا"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
              <Button type="button" variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                پاک کردن
              </Button>
              <Button type="button" onClick={applyFilters} className="flex-1">
                اعمال فیلترها
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <SectionHeading title={title} subtitle={subtitle} className="mb-0" />
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">{filtered.length} تور یافت شد</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900 mb-2">توری یافت نشد</h3>
          <p className="text-stone-600 mb-4">با فیلترهای انتخابی توری یافت نشد. فیلترها را کمتر کنید یا جستجو را تغییر دهید.</p>
          <Button type="button" onClick={clearFilters} variant="outline">
            پاک کردن فیلترها
          </Button>
        </div>
      )}
    </>
  );
}
