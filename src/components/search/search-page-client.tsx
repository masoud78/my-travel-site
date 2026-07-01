"use client";

import { Suspense, useMemo, useCallback, useState } from "react";
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
import {
  Section,
  SectionHeading,
} from "@/components/common/section";
import { Search, SlidersHorizontal, X, MapPin, Plane } from "lucide-react";

interface SearchPageClientProps {
  initialTours: TourCardData[];
  destinations: { id: string; name: string }[];
  transports: { id: string; name: string }[];
}

const transportTypes = [
  { value: "PLANE", label: "هواپیما" },
  { value: "TRAIN", label: "قطار" },
  { value: "BUS", label: "اتوبوس" },
  { value: "ROAD", label: "زمینی" },
  { value: "MIXED", label: "ترکیبی" },
];

const sortOptions = [
  { value: "relevance", label: "ارتباط بیشتر" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "duration-asc", label: "کوتاه‌ترین" },
  { value: "newest", label: "جدیدترین" },
];

export function SearchPageClient(props: SearchPageClientProps) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageInner {...props} />
    </Suspense>
  );
}

function SearchPageSkeleton() {
  return (
    <>
      <Section className="bg-gradient-to-br from-primary-50 to-accent-50">
        <SectionHeading
          title="جستجوی پیشرفته تور"
          subtitle="با فیلترهای دقیق، تور مورد نظر خود را پیدا کنید"
          align="center"
        />
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-stone-100 rounded-lg" />
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-stone-100 rounded-2xl" />
          ))}
        </div>
      </Section>
    </>
  );
}

function SearchPageInner({ initialTours, transports }: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [transportType, setTransportType] = useState(searchParams.get("transportType") || "");
  const [airline, setAirline] = useState(searchParams.get("airline") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [duration, setDuration] = useState(searchParams.get("duration") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "relevance");

  const filterTours = useCallback(() => {
    let filtered = [...initialTours];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }

    if (destination) {
      filtered = filtered.filter((t) => t.destinationId === destination);
    }

    if (transportType) {
      filtered = filtered.filter((t) => t.transport === transportType);
    }

    if (airline) {
      filtered = filtered.filter((t) => t.transportId === airline);
    }

    if (minPrice) {
      filtered = filtered.filter((t) => t.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((t) => t.price <= Number(maxPrice));
    }

    if (duration) {
      filtered = filtered.filter((t) => t.duration === Number(duration));
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "duration-asc":
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      default:
        // relevance: keep initial ordering
        break;
    }

    return filtered;
  }, [initialTours, query, destination, transportType, airline, minPrice, maxPrice, duration, sort]);

  const results = useMemo(() => filterTours(), [filterTours]);

  function updateUrl() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (destination) params.set("destination", destination);
    if (transportType) params.set("transportType", transportType);
    if (airline) params.set("airline", airline);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (duration) params.set("duration", duration);
    if (sort && sort !== "relevance") params.set("sort", sort);
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    setQuery("");
    setDestination("");
    setTransportType("");
    setAirline("");
    setMinPrice("");
    setMaxPrice("");
    setDuration("");
    setSort("relevance");
    router.push("/search", { scroll: false });
  }

  const hasActiveFilters = query || destination || transportType || airline || minPrice || maxPrice || duration;

  return (
    <>
      <Section className="bg-gradient-to-br from-primary-50 to-accent-50">
        <SectionHeading
          title="جستجوی پیشرفته تور"
          subtitle="با فیلترهای دقیق، تور مورد نظر خود را پیدا کنید"
          align="center"
        />

        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <Label className="mb-1.5 block text-sm">کلیدواژه</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="نام تور یا مقصد..."
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> مقصد
              </Label>
              <DestinationAutocomplete
                value={destination}
                onChange={(id) => setDestination(id)}
                placeholder="انتخاب مقصد"
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-sm flex items-center gap-1">
                <Plane className="w-3.5 h-3.5" /> نوع حمل‌ونقل
              </Label>
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
            </div>

            <div>
              <Label className="mb-1.5 block text-sm">مدت اقامت (شب)</Label>
              <Input
                type="number"
                min={0}
                placeholder="مثلاً ۷"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-sm">مرتب‌سازی</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
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

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {hasActiveFilters && (
              <Button type="button" variant="outline" onClick={clearFilters} className="gap-2 sm:order-1">
                <X className="w-4 h-4" />
                پاک کردن
              </Button>
            )}
            <Button type="button" onClick={updateUrl} className="sm:order-2 sm:mr-auto">
              <SlidersHorizontal className="w-4 h-4 ml-2" />
              جستجو با فیلترها
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-stone-900">
            نتایج جستجو
            <span className="mr-2 text-sm font-normal text-stone-500">({results.length} تور)</span>
          </h2>
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

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-2">توری یافت نشد</h3>
            <p className="text-stone-600 mb-4">با فیلترهای انتخابی توری یافت نشد.</p>
            <Button type="button" onClick={clearFilters} variant="outline">
              پاک کردن فیلترها
            </Button>
          </div>
        )}
      </Section>
    </>
  );
}
