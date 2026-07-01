"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface ReviewFormProps {
  tourId?: string;
  tourTitle?: string;
  blogPostId?: string;
  postTitle?: string;
  className?: string;
}

export function ReviewForm({ tourId, tourTitle, blogPostId, postTitle, className }: ReviewFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      name: (formData.get("name") as string)?.trim(),
      email: (formData.get("email") as string)?.trim() || undefined,
      rating,
      title: (formData.get("title") as string)?.trim() || undefined,
      text: (formData.get("text") as string)?.trim(),
    };

    if (tourId) {
      payload.tourId = tourId;
      payload.tourTitle = tourTitle;
    }
    if (blogPostId) {
      payload.blogPostId = blogPostId;
      payload.postTitle = postTitle;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "ثبت نظر با خطا مواجه شد");
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
      setRating(5);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    }
  }

  if (status === "ok") {
    return (
      <div className={cn("rounded-2xl bg-accent-50 border border-accent-200 p-6 text-center", className)}>
        <CheckCircle2 className="w-12 h-12 text-accent-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-stone-900 mb-2">نظر شما ثبت شد</h3>
        <p className="text-sm text-stone-600">با تشکر از همراهی شما. نظر پس از بررسی منتشر خواهد شد.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("rounded-2xl bg-white border border-stone-200 p-6 md:p-8", className)}
    >
      <h3 className="font-bold text-lg text-stone-900 mb-1">ثبت نظر</h3>
      <p className="text-sm text-stone-500 mb-5">
        {tourTitle ? `نظر خود را درباره «${tourTitle}» بنویسید.` : postTitle ? `نظر خود را درباره «${postTitle}» بنویسید.` : "نظر خود را با ما به اشتراک بگذارید."}
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="review-name">نام و نام خانوادگی *</Label>
            <Input
              id="review-name"
              name="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="نام شما"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-email">ایمیل (اختیاری)</Label>
            <Input
              id="review-email"
              name="email"
              type="email"
              dir="ltr"
              placeholder="example@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>امتیاز *</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label={`امتیاز ${star} از ۵`}
              >
                <Star
                  className={cn(
                    "w-7 h-7 transition-colors",
                    (hoverRating ? star <= hoverRating : star <= rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-stone-300"
                  )}
                />
              </button>
            ))}
            <span className="mr-2 text-sm text-stone-500">
              {rating} از ۵
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-title">عنوان نظر (اختیاری)</Label>
          <Input
            id="review-title"
            name="title"
            maxLength={200}
            placeholder="یک عنوان کوتاه برای نظر خود"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-text">متن نظر *</Label>
          <Textarea
            id="review-text"
            name="text"
            required
            minLength={20}
            maxLength={2000}
            rows={5}
            placeholder="حداقل ۲۰ کاراکتر بنویسید..."
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full"
          size="lg"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              ارسال نظر
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
