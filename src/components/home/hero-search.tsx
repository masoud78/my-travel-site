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

function formatJalali(date: JalaliDateValue | null): string {
  if (!date) return "";
  return `${toPersianDigits(date.day)} ${jalaliMonthNames[date.month - 1]} ${toPersianDigits(date.year)}`;
}

export function HeroSearchWidget({
  destinations,
}: {
  destinations: DestinationOption[];
}) {
  const [selectedDest, setSelectedDest] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<JalaliDateValue | null>(null);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredDestinations = destSearch
    ? destinations.filter((d) => d.name.includes(destSearch))
    : destinations;

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (selectedDest) {
      params.set("destination", selectedDest);
    }
    if (selectedDate) {
      params.set("date", `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`);
    }
    const query = params.toString();
    return query ? `/tours?${query}` : "/tours";
  };

  const selectedDestName = destinations.find((d) => d.slug === selectedDest)?.name || "";

  return (
    <div className="relative z-20 -mt-12 sm:-mt-14 mx-3 sm:mx-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl shadow-primary-900/10 border border-stone-100 p-4 sm:p-5 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 sm:gap-4 items-end">
          {/* Destination dropdown */}
          <div className="space-y-1.5 relative sm:text-right text-right" ref={dropdownRef}>
            <label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              مقصد سفر
            </label>
            <button
              type="button"
              onClick={() => setDestDropdownOpen(!destDropdownOpen)}
              className="w-full h-12 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-primary-300 transition-all px-3 flex items-center justify-between text-right"
            >
              <span className={selectedDestName ? "text-stone-800 font-semibold text-sm" : "text-stone-400 text-sm"}>
                {selectedDestName || "انتخاب مقصد"}
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${destDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {destDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 left-0 bg-white rounded-2xl shadow-2xl border border-stone-100 z-40 max-h-[280px] overflow-hidden flex flex-col">
                <div className="bg-white border-b border-stone-100 p-3 sticky top-0">
                  <input
                    type="text"
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    placeholder="جستجوی مقصد..."
                    className="w-full h-10 rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-primary focus:bg-white"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1">
                  {filteredDestinations.length === 0 && (
                    <div className="p-4 text-sm text-stone-400 text-center">مقصدی یافت نشد</div>
                  )}
                  {filteredDestinations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDest(d.slug);
                        setDestDropdownOpen(false);
                        setDestSearch("");
                      }}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors flex items-center justify-between border-b border-stone-50 last:border-0 ${
                        selectedDest === d.slug ? "bg-primary-50 text-primary font-bold" : "text-stone-700"
                      }`}
                    >
                      <span>{d.name}</span>
                      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                        {d.type === "CITY" ? "شهر" : d.type === "COUNTRY" ? "کشور" : "قاره"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Jalali date picker */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-primary-600" />
              تاریخ سفر
            </label>
            <div className="flex items-center h-12 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-primary-300 transition-all px-3 text-right">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                shouldHighlightWeekends
                locale="fa"
                calendarClassName="jalali-datepicker"
                inputClassName="w-full h-12 bg-transparent text-right text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none cursor-pointer border-0"
                placeholder="مثلاً فروردین ۱۴۰۵"
                formatMonth={(month: number) => jalaliMonthNames[month - 1]}
              />
            </div>
          </div>

          {/* Search button */}
          <Button asChild size="lg" className="h-12 rounded-xl bg-gradient-to-l from-primary-700 to-primary-900 hover:from-primary-800 hover:to-primary-950 text-white shadow-lg shadow-primary-700/30 text-sm font-bold px-7 border-0">
            <Link href={buildSearchUrl()}>
              <Search className="w-4 h-4" />
              <span>جستجوی تور</span>
            </Link>
          </Button>
        </div>

        {/* Quick popular destinations */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">پرطرفدار:</span>
          {destinations.slice(0, 6).map((d) => (
            <Link
              key={d.id}
              href={`/tours?destination=${d.slug}`}
              className="text-xs font-medium text-stone-600 bg-stone-100 hover:bg-gradient-to-l hover:from-primary-50 hover:to-accent-50 hover:text-primary hover:shadow-sm px-3 py-1.5 rounded-full transition-all border border-transparent hover:border-primary-200"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
