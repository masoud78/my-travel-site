"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

interface DestinationOption {
  id: string;
  name: string;
  slug: string;
  type: string;
}

interface JalaliDateValue {
  year: number;
  month: number;
  day: number;
}

const jalaliMonthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

function toPersianDigits(input: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (d) => persianDigits[+d]);
}

export function HeroSearchWidget({
  destinations,
}: {
  destinations: DestinationOption[];
}) {
  const [selectedDest, setSelectedDest] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<JalaliDateValue | null>(null);
  const [destOpen, setDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = destSearch
    ? destinations.filter((d) => d.name.includes(destSearch))
    : destinations;

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (selectedDest) params.set("destination", selectedDest);
    if (selectedDate) params.set("date", `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`);
    return params.toString() ? `/tours?${params.toString()}` : "/tours";
  };

  const selectedDestName = destinations.find((d) => d.slug === selectedDest)?.name || "";
  const formattedDate = selectedDate
    ? `${toPersianDigits(selectedDate.day)} ${jalaliMonthNames[selectedDate.month - 1]} ${toPersianDigits(selectedDate.year)}`
    : "";

  return (
    <div className="relative z-30 mx-3 sm:mx-6 lg:mx-auto lg:max-w-4xl">
      <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/10 border border-stone-100 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2.5 sm:gap-3 items-center">
          {/* Destination dropdown */}
          <div className="relative text-right" ref={dropdownRef}>
            <label className="text-[11px] font-bold text-stone-500 flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-primary-600" />
              مقصد
            </label>
            <button
              type="button"
              onClick={() => setDestOpen(!destOpen)}
              className="w-full h-10 rounded-lg border border-stone-200 bg-stone-50 hover:bg-white hover:border-primary-300 transition-all px-3 flex items-center justify-between text-right"
            >
              <span className={selectedDestName ? "text-stone-800 font-medium text-sm" : "text-stone-400 text-sm"}>
                {selectedDestName || "انتخاب مقصد"}
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${destOpen ? "rotate-180" : ""}`} />
            </button>
            {destOpen && (
              <div className="absolute top-full mt-1 right-0 left-0 sm:w-64 bg-white rounded-xl shadow-2xl border border-stone-100 z-50 max-h-[240px] overflow-hidden flex flex-col">
                <div className="bg-white border-b border-stone-100 p-2 sticky top-0 z-10">
                  <input
                    type="text"
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    placeholder="جستجوی مقصد..."
                    className="w-full h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-primary focus:bg-white"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1">
                  {filtered.length === 0 && (
                    <div className="p-3 text-sm text-stone-400 text-center">مقصدی یافت نشد</div>
                  )}
                  {filtered.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDest(d.slug);
                        setDestOpen(false);
                        setDestSearch("");
                      }}
                      className={`w-full text-right px-3 py-2 text-sm hover:bg-primary-50 transition-colors flex items-center justify-between border-b border-stone-50 last:border-0 ${
                        selectedDest === d.slug ? "bg-primary-50 text-primary font-bold" : "text-stone-700"
                      }`}
                    >
                      <span>{d.name}</span>
                      <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                        {d.type === "CITY" ? "شهر" : d.type === "COUNTRY" ? "کشور" : "قاره"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Jalali date picker */}
          <div className="relative text-right">
            <label className="text-[11px] font-bold text-stone-500 flex items-center gap-1 mb-1">
              <CalendarDays className="w-3 h-3 text-primary-600" />
              تاریخ سفر
            </label>
            <div className="h-10 rounded-lg border border-stone-200 bg-stone-50 hover:bg-white hover:border-primary-300 transition-all flex items-center px-3 gap-2">
              <DatePicker
                value={selectedDate}
                onChange={(v: JalaliDateValue | null) => setSelectedDate(v)}
                shouldHighlightWeekends
                locale="fa"
                calendarClassName="jalali-datepicker"
                inputClassName="w-full bg-transparent text-right text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none cursor-pointer border-0 p-0 h-10"
                placeholder="انتخاب تاریخ"
                formatMonth={(month: number) => jalaliMonthNames[month - 1]}
              />
            </div>
          </div>

          {/* Search button */}
          <Button asChild className="h-10 rounded-lg bg-gradient-to-l from-primary-700 to-primary-900 hover:from-primary-800 hover:to-primary-950 text-white shadow-lg shadow-primary-700/20 text-sm font-bold px-6 border-0 mt-[18px]">
            <Link href={buildSearchUrl()}>
              <Search className="w-4 h-4" />
              <span>جستجوی تور</span>
            </Link>
          </Button>
        </div>

        {/* Quick popular destinations */}
        <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-stone-500 font-semibold">پرطرفدار:</span>
          {destinations.slice(0, 6).map((d) => (
            <Link
              key={d.id}
              href={`/tours?destination=${d.slug}`}
              className="text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-primary-50 hover:text-primary px-2.5 py-1 rounded-full transition-all"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
