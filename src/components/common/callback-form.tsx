"use client";

import { useState } from "react";
import { Phone, Send, CheckCircle2 } from "lucide-react";

export interface CallbackFormProps {
  tourTitle?: string;
  subject?: string;
  compact?: boolean;
  className?: string;
}

export function CallbackForm({ tourTitle, subject, compact = false, className = "" }: CallbackFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      subject: subject || (tourTitle ? `درخواست مشاوره برای: ${tourTitle}` : "درخواست تماس متقابل"),
      message: (formData.get("message") as string) || "",
      type: "CALLBACK",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "ارسال درخواست ناموفق بود");
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    }
  }

  if (status === "ok") {
    return (
      <div className={`rounded-2xl bg-accent-50 border border-accent-200 p-6 text-center ${className}`}>
        <CheckCircle2 className="w-12 h-12 text-accent-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-stone-900 mb-2">درخواست شما ثبت شد</h3>
        <p className="text-sm text-stone-600">
          کارشناسان ما در کوتاه‌ترین زمان با شما تماس می‌گیرند.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl bg-white border border-stone-200 p-4 sm:p-5 md:p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Phone className="w-5 h-5 text-secondary shrink-0" />
        <h3 className="font-bold text-base md:text-lg text-stone-900">
          {tourTitle ? "درخواست مشاوره" : "درخواست تماس متقابل"}
        </h3>
      </div>
      {!compact && (
        <p className="text-xs sm:text-sm text-stone-600 mb-3 md:mb-4">
          نام و شماره خود را وارد کنید. مشاور ما در سریع‌ترین زمان با شما تماس می‌گیرد.
        </p>
      )}

      <div className="space-y-2.5 md:space-y-3">
        <input
          name="name"
          required
          placeholder="نام و نام خانوادگی"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
        />
        <input
          name="phone"
          required
          type="tel"
          pattern="^0?9[0-9]{9}$"
          placeholder="شماره موبایل (مثلاً 09121234567)"
          dir="ltr"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm font-mono"
        />
        {!compact && (
          <textarea
            name="message"
            rows={3}
            placeholder="پیام شما (اختیاری)"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm resize-none"
          />
        )}
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 md:mt-4 w-full bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        {status === "loading" ? (
          "در حال ارسال..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            ارسال درخواست
          </>
        )}
      </button>
    </form>
  );
}
