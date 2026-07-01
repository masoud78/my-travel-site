import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert English digits to Persian digits.
 */
export function toFa(input: string | number): string {
  const en = "0123456789";
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/[0-9]/g, (d) => fa[en.indexOf(d)]);
}

/**
 * Format bytes to human-readable string.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "۰ بایت";
  const k = 1024;
  const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت", "ترابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return `${toFa(value.toString())} ${sizes[i]}`;
}

/**
 * Format price in Iranian Toman with separators and Persian digits.
 */
export function formatPrice(amount: number | string | null | undefined, currency = "تومان"): string {
  if (amount === null || amount === undefined || amount === "") return "-";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return "-";
  const formatted = num.toLocaleString("en-US");
  return currency ? `${toFa(formatted)} ${currency}` : toFa(formatted);
}

/**
 * Format number with separators and Persian digits.
 */
export function formatNumber(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "-";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return "-";
  return toFa(num.toLocaleString("en-US"));
}

/**
 * Format date in Persian (Jalali).
 * Lightweight inline formatter to avoid extra deps in critical path.
 */
export function formatJalali(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Generate slug from Persian/English text.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Safe JSON parse.
 */
export function safeParse<T>(input: string | null | undefined, fallback: T): T {
  if (!input) return fallback;
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

/**
 * Truncate string to word boundary.
 */
export function truncate(text: string, len = 160): string {
  if (text.length <= len) return text;
  return text.slice(0, len).replace(/\s+\S*$/, "") + "…";
}

/**
 * Calculate reading time for a blog post.
 */
export function readingTime(text: string): string {
  const wordsPerMinute = 180; // Persian reading speed
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return toFa(minutes) + " دقیقه مطالعه";
}
