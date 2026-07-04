"use client";

import Link from "next/link";
import { Search, MapPin, CalendarDays, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const destinations = [
  { value: "turkey", label: "ترکیه" },
  { value: "dubai", label: "دبی" },
  { value: "europe", label: "اروپا" },
  { value: "asia", label: "آسیایی" },
  { value: "domestic", label: "ایران" },
];

export function HeroSearchWidget() {
  return (
    <div className="relative z-20 -mt-8 sm:-mt-12 mx-3 sm:mx-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-primary/10 border border-stone-100 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              مقصد
            </label>
            <Select defaultValue="turkey">
              <SelectTrigger className="h-12 rounded-xl border-stone-200 bg-stone-50 hover:bg-white transition-colors">
                <SelectValue placeholder="انتخاب مقصد" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-500 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              تاریخ سفر
            </label>
            <Input
              type="text"
              placeholder="مثلاً فروردین ۱۴۰۵"
              className="h-12 rounded-xl border-stone-200 bg-stone-50 hover:bg-white transition-colors"
            />
          </div>

          {/* Travelers */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              مسافران
            </label>
            <Select defaultValue="2">
              <SelectTrigger className="h-12 rounded-xl border-stone-200 bg-stone-50 hover:bg-white transition-colors">
                <SelectValue placeholder="تعداد مسافر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">۱ نفر</SelectItem>
                <SelectItem value="2">۲ نفر</SelectItem>
                <SelectItem value="3">۳ نفر</SelectItem>
                <SelectItem value="4">۴+ نفر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search button */}
          <div className="flex items-end">
            <Button asChild size="lg" className="w-full h-12 rounded-xl bg-gradient-to-l from-primary to-primary-600 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary/25 text-base font-bold">
              <Link href="/tours">
                <Search className="w-5 h-5" />
                جستجوی تور
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick tags */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500">پرطرفدار:</span>
          {["آنتالیا", "دبی", "استانبول", "تفلیس", "پوکت", "کیش"].map((tag) => (
            <Link
              key={tag}
              href={`/tours?q=${encodeURIComponent(tag)}`}
              className="text-xs font-medium text-stone-600 bg-stone-100 hover:bg-primary-50 hover:text-primary px-3 py-1.5 rounded-full transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
