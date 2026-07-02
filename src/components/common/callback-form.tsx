"use client";

import { useState } from "react";
import { Phone, Send, CheckCircle2, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
      <Card
        variant="gradient"
        className={`rounded-2xl border-0 p-6 sm:p-8 text-center ${className}`}
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-bold text-lg text-stone-900 mb-2">درخواست شما ثبت شد</h3>
        <p className="text-sm text-stone-600">
          کارشناسان ما در کوتاه‌ترین زمان با شما تماس می‌گیرند.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className={`rounded-2xl p-4 sm:p-5 md:p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white shrink-0">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg text-stone-900">
            {tourTitle ? "درخواست مشاوره" : "درخواست تماس متقابل"}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            نام و شماره خود را وارد کنید. مشاور ما در سریع‌ترین زمان با شما تماس می‌گیرد.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div className="space-y-3">
          <Input
            name="name"
            required
            placeholder="نام و نام خانوادگی"
            icon={<User className="w-4 h-4" />}
            iconPosition="right"
            size="lg"
          />
          <Input
            name="phone"
            required
            type="tel"
            pattern="^0?9[0-9]{9}$"
            placeholder="شماره موبایل (مثلاً 09121234567)"
            dir="ltr"
            icon={<Phone className="w-4 h-4" />}
            iconPosition="right"
            size="lg"
          />
          {!compact && (
            <Input
              name="message"
              placeholder="پیام شما (اختیاری)"
              icon={<MessageCircle className="w-4 h-4" />}
              iconPosition="right"
              size="lg"
            />
          )}
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={status === "loading"}
          variant="cta"
          size="lg"
          className="w-full"
          loading={status === "loading"}
        >
          <Send className="w-5 h-5" />
          ارسال درخواست
        </Button>
      </form>
    </Card>
  );
}
