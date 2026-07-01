"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import { cn } from "@/lib/utils";
import { Images } from "lucide-react";

interface TourImageGalleryProps {
  images: string[];
  title: string;
  thumbnail?: string | null;
  className?: string;
}

export function TourImageGallery({ images, title, thumbnail, className }: TourImageGalleryProps) {
  const allImages = images.length > 0 ? images : thumbnail ? [thumbnail] : [];
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const normalizedImages = allImages.map((src, idx) => ({
    src,
    alt: `${title} - تصویر ${idx + 1}`,
  }));

  const openAt = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);
  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  if (normalizedImages.length === 0) {
    return (
      <div className={cn("relative aspect-[16/10] rounded-2xl bg-stone-100 flex items-center justify-center", className)}>
        <div className="text-stone-400 text-sm">تصویری موجود نیست</div>
      </div>
    );
  }

  // Single image
  if (normalizedImages.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => openAt(0)}
          className={cn("relative aspect-[16/10] rounded-2xl overflow-hidden group block w-full", className)}
        >
          <Image
            src={normalizedImages[0].src}
            alt={normalizedImages[0].alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        </button>
        <Lightbox
          images={normalizedImages}
          currentIndex={currentIndex}
          isOpen={isOpen}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      </>
    );
  }

  // Multiple images: hero + grid
  const mainImage = normalizedImages[0];
  const gridImages = normalizedImages.slice(1, 5);
  const remaining = normalizedImages.length - gridImages.length - 1;

  return (
    <>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative aspect-[16/10] md:aspect-auto md:row-span-2 rounded-2xl overflow-hidden group block"
        >
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </button>
        {gridImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => openAt(idx + 1)}
            className={cn(
              "relative aspect-[16/10] rounded-2xl overflow-hidden group block",
              idx === 3 && remaining > 0 && "after:absolute after:inset-0 after:bg-black/50 after:flex after:items-center after:justify-center"
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {idx === 3 && remaining > 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                <Images className="w-5 h-5 ml-2" />
                +{remaining} تصویر
              </div>
            )}
          </button>
        ))}
      </div>
      <Lightbox
        images={normalizedImages}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </>
  );
}
