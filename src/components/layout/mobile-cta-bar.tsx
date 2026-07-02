"use client";

import Link from "next/link";
import { Phone, MessageCircle, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

export function MobileCTABar() {
  return (
    <>
      {/* Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-50">
        <div className="flex items-center justify-between px-2 py-2">
          {/* Primary CTA - Call */}
          <Button
            asChild
            variant="cta"
            size="lg"
            className="flex-1 mx-2 h-12 rounded-xl shadow-md"
          >
            <a href={`tel:${SITE_CONFIG.defaultPhone}`}>
              <Phone className="w-5 h-5" />
              <span className="text-sm font-semibold">تماس با مشاور</span>
            </a>
          </Button>

          {/* Secondary CTA - WhatsApp */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 mx-2 h-12 rounded-xl border-secondary-200 text-secondary hover:bg-secondary-50"
          >
            <a href={SITE_CONFIG.socials.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">واتساپ</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Button
          asChild
          variant="purple"
          size="iconLg"
          className="rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Link href="/">
            <Home className="w-6 h-6" />
          </Link>
        </Button>
      </div>

      <div className="lg:hidden fixed bottom-20 left-4 z-40">
        <Button
          asChild
          variant="accent"
          size="iconLg"
          className="rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Link href="/search">
            <Search className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </>
  );
}
