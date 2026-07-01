/**
 * Jalali (Shamsi/Persian) date utilities.
 * Uses native Intl + Persian digits; avoids fragile dayjs/jalaliday plugin typing.
 */

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function toPersianDigits(input: string | number): string {
  return toFa(input);
}

export { formatPrice, formatNumber } from "@/lib/utils";

export function formatJalaliDate(date: Date | string | number): string {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatter.format(d);
}

export function formatJalaliDateShort(date: Date | string | number): string {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d);
}

export function getJalaliMonth(monthIndex: number): string {
  return PERSIAN_MONTHS[monthIndex] || "";
}

export function getJalaliWeekday(weekdayIndex: number): string {
  const PERSIAN_WEEKDAYS = [
    "یک‌شنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
    "شنبه",
  ];
  return PERSIAN_WEEKDAYS[weekdayIndex] || "";
}

interface JalaliDateParts {
  year: number;
  month: number;
  day: number;
  hours?: number;
  minutes?: number;
}

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  let gy = 400 * ~~(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * ~~(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 13 && gd > sal_a[gm]) {
    gd -= sal_a[gm];
    gm++;
  }
  return [gy, gm, gd];
}

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  if (gy > 1600) {
    gy -= 1600;
  } else {
    gy -= 200;
  }
  let gNo = 365 * gy + ~~((gy + 3) / 4) - ~~((gy + 99) / 100) + ~~((gy + 399) / 400);
  for (let i = 0; i < gm; ++i) gNo += g_d_m[i];
  if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) gNo++;
  gNo += gd;
  let jy = -1595 + 33 * ~~(gNo / 12053);
  gNo %= 12053;
  jy += 4 * ~~(gNo / 1461);
  gNo %= 1461;
  if (gNo > 365) {
    jy += ~~((gNo - 1) / 365);
    gNo = (gNo - 1) % 365;
  }
  let jm, jd;
  if (gNo < 186) {
    jm = 1 + ~~(gNo / 31);
    jd = 1 + (gNo % 31);
  } else {
    jm = 7 + ~~((gNo - 186) / 30);
    jd = 1 + ((gNo - 186) % 30);
  }
  return [jy, jm, jd];
}

export function parseDate(date: Date): JalaliDateParts {
  const [year, month, day] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return {
    year,
    month,
    day,
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

export function formatDate({ year, month, day, hours = 0, minutes = 0 }: JalaliDateParts): Date {
  const [gy, gm, gd] = jalaliToGregorian(year, month, day);
  return new Date(gy, gm - 1, gd, hours, minutes, 0, 0);
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  const { year, month, day, hours, minutes } = parseDate(d);
  return `${toFa(year)}/${toFa(String(month).padStart(2, "0"))}/${toFa(String(day).padStart(2, "0"))} ${toFa(String(hours).padStart(2, "0"))}:${toFa(String(minutes).padStart(2, "0"))}`;
}
