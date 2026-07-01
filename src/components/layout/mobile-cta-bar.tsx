"use client";

import { Phone, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

interface MobileCTABarProps {
  phoneNumber?: string;
  phoneDisplay?: string;
  whatsapp?: string;
}

export function MobileCTABar({
  phoneNumber = SITE_CONFIG.defaultPhone,
  phoneDisplay = SITE_CONFIG.defaultPhoneDisplay,
  whatsapp = SITE_CONFIG.socials.whatsapp,
}: MobileCTABarProps) {
  return (
    <>
      {/* Sticky bottom CTA — mobile only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] safe-area-inset-bottom">
        <div className="grid grid-cols-2 gap-2 p-2 sm:p-3">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl bg-secondary text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-secondary-600 transition-colors"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>تماس فوری</span>
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>واتساپ</span>
          </a>
        </div>
      </div>

      {/* Floating WhatsApp — desktop */}
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform items-center justify-center"
        aria-label="چت در واتساپ"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* hidden phone display for screen readers / SEO */}
      <span className="sr-only" dir="ltr">{phoneDisplay}</span>
    </>
  );
}
