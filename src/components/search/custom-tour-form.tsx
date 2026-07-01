"use client";

import { useState } from "react";
import { Send, CheckCircle2, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomTourFormProps {
  className?: string;
}

export function CustomTourForm({ className }: CustomTourFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || "",
      subject: "درخواست طراحی تور اختصاصی",
      message: formData.get("message") as string,
      type: "CUSTOM_TOUR",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
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
    <form onSubmit={handleSubmit} className={`rounded-2xl bg-white border border-stone-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Plane className="w-5 h-5 text-secondary" />
        <h3 className="font-bold text-lg text-stone-900">تور اختصاصی می‌خواهید؟</h3>
      </div>
      <p className="text-sm text-stone-600 mb-4">
        مقصد، تاریخ و تعداد مسافر را بنویسید. ما بهترین پکیج را متناسب با سلیقه شما طراحی می‌کنیم.
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="custom-name" className="mb-1.5 block">
              نام و نام خانوادگی
            </Label>
            <Input id="custom-name" name="name" required placeholder="مثلاً علی احمدی" />
          </div>
          <div>
            <Label htmlFor="custom-phone" className="mb-1.5 block">
              شماره موبایل
            </Label>
            <Input
              id="custom-phone"
              name="phone"
              required
              type="tel"
              pattern="^0?9[0-9]{9}$"
              dir="ltr"
              placeholder="09121234567"
              className="font-mono"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="custom-email" className="mb-1.5 block">
            ایمیل (اختیاری)
          </Label>
          <Input id="custom-email" name="email" type="email" dir="ltr" placeholder="example@email.com" />
        </div>
        <div>
          <Label htmlFor="custom-message" className="mb-1.5 block">
            جزئیات درخواست
          </Label>
          <Textarea
            id="custom-message"
            name="message"
            required
            rows={4}
            placeholder="مقصد، تاریخ سفر، تعداد مسافر، بودجه و هر نکته‌ی دیگری را بنویسید..."
          />
        </div>
      </div>
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 w-full bg-secondary hover:bg-secondary-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          "در حال ارسال..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            ارسال درخواست تور اختصاصی
          </>
        )}
      </button>
    </form>
  );
}
