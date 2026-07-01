"use client";

import { useState, useCallback } from "react";
import { Share2, Link2, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fallback to manual
      }
    }
  }, [title, url]);

  const copyLink = useCallback(() => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [url]);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-stone-500 ml-1">اشتراک‌گذاری:</span>
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
        aria-label="اشتراک‌گذاری"
      >
        <Share2 className="w-3.5 h-3.5" />
        اشتراک
      </button>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-medium transition-colors"
        aria-label="اشتراک در واتساپ"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        واتساپ
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-medium transition-colors"
        aria-label="اشتراک در تلگرام"
      >
        <Send className="w-3.5 h-3.5" />
        تلگرام
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
        aria-label="کپی لینک"
      >
        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "کپی شد" : "کپی لینک"}
      </button>
    </div>
  );
}
