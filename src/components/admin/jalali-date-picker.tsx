"use client";

import { useState } from "react";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, parseDate, toFa } from "@/lib/jalali";

export interface JalaliDateValue {
  year: number;
  month: number;
  day: number;
}

interface JalaliDatePickerProps {
  value?: Date | string | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  showTime?: boolean;
  required?: boolean;
}

export function JalaliDatePicker({
  value,
  onChange,
  label,
  placeholder = "انتخاب تاریخ",
  showTime = false,
  required,
}: JalaliDatePickerProps) {
  const initial = value ? parseDate(typeof value === "string" ? new Date(value) : value) : null;
  const initialTime = value
    ? `${String((typeof value === "string" ? new Date(value) : value).getHours()).padStart(2, "0")}:${String((typeof value === "string" ? new Date(value) : value).getMinutes()).padStart(2, "0")}`
    : "12:00";
  const [selectedDay, setSelectedDay] = useState<JalaliDateValue | null>(initial);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(initialTime);

  const displayValue = () => {
    if (!value) return placeholder;
    const d = typeof value === "string" ? new Date(value) : value;
    const { year, month, day } = parseDate(d);
    const t = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return `${toFa(year)}/${toFa(String(month).padStart(2, "0"))}/${toFa(String(day).padStart(2, "0"))}${showTime ? ` | ${toFa(t)}` : ""}`;
  };

  const handleSelect = (day: JalaliDateValue) => {
    setSelectedDay(day);
    const [hours, minutes] = time.split(":").map(Number);
    const gregorian = formatDate({ ...day, hours, minutes });
    onChange(gregorian);
    if (!showTime) setOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (selectedDay) {
      const [hours, minutes] = newTime.split(":").map(Number);
      onChange(formatDate({ ...selectedDay, hours, minutes }));
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="w-full justify-between h-11"
        >
          <span className={value ? "text-stone-900" : "text-stone-400"}>{displayValue()}</span>
          <CalendarIcon className="w-4 h-4 text-stone-400" />
        </Button>
        {open && (
          <div className="absolute z-50 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg p-3" dir="rtl">
            <Calendar
              value={selectedDay || undefined}
              onChange={handleSelect}
              shouldHighlightWeekends
              locale="fa"
            />
            {showTime && (
              <div className="mt-3 border-t pt-3">
                <label className="text-xs text-stone-500 block mb-1">ساعت (تهران)</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  dir="ltr"
                  className="h-9"
                />
              </div>
            )}
          </div>
        )}
      </div>
      {required && !value && <p className="text-xs text-red-500">این فیلد الزامی است</p>}
    </div>
  );
}

export function JalaliDateDisplay({ date }: { date: Date | string | null | undefined }) {
  if (!date) return <span>—</span>;
  const d = typeof date === "string" ? new Date(date) : date;
  const { year, month, day } = parseDate(d);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return <span>{`${toFa(year)}/${toFa(String(month).padStart(2, "0"))}/${toFa(String(day).padStart(2, "0"))}`} <span className="text-stone-400 mx-1">|</span> {toFa(time)}</span>;
}
