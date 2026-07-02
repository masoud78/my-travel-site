import Link from "next/link";
import Image from "next/image";
import { Clock, Plane, Calendar, MapPin, Headphones, Star, Zap, Heart } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardImage, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TourCardData {
  id: string;
  slug: string;
  title: string;
  destination: string;
  destinationId?: string;
  duration: number; // nights
  transport: string;
  transportId?: string;
  category?: string;
  airline?: string | null;
  price: number;
  oldPrice?: number;
  image?: string;
  startDate?: string;
  hotelStars?: number;
  discount?: number | null;
  isLastMinute?: boolean;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  rating?: number;
  reviewCount?: number;
}

interface TourCardProps {
  tour: TourCardData;
  className?: string;
  variant?: "default" | "compact" | "horizontal";
}

const transportLabels: Record<string, string> = {
  PLANE: "هواپیما",
  TRAIN: "قطار",
  BUS: "اتوبوس",
  ROAD: "زمینی",
  MIXED: "ترکیبی",
};

const statusLabels: Record<string, string> = {
  RUNNING: "در حال اجرا",
  NOT_RUNNING: "غیرفعال",
  AVAILABLE: "قابل رزرو",
  FULL: "تکمیل ظرفیت",
  CANCELLED: "لغو شده",
};

// Main Tour Card Component - Modern Design 2026
export function TourCard({ tour, className, variant = "default" }: TourCardProps) {
  const imageUrl = tour.image || `/images/placeholder-tour.jpg`;
  const transportLabel = transportLabels[tour.transport] || tour.transport;
  const airlineLabel = tour.airline || transportLabel;

  // Compact variant for grids
  if (variant === "compact") {
    return (
      <Link
        href={`/tours/${tour.slug}`}
        className={cn("group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300", className)}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-1.5 items-end">
            {tour.isFeatured && (
              <Badge variant="gradient" size="sm" className="shadow-md">
                <Star className="w-3 h-3" />
                ویژه
              </Badge>
            )}
            {tour.isLastMinute && (
              <Badge variant="destructive" size="sm" className="shadow-md">
                <Zap className="w-3 h-3" />
                آخرین فرصت
              </Badge>
            )}
            {tour.discount && (
              <Badge variant="warning" size="sm" className="shadow-md">
                ٪{tour.discount} تخفیف
              </Badge>
            )}
          </div>

          {/* Destination Badge */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur-sm text-stone-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[7rem] sm:max-w-[9rem]">{tour.destination}</span>
          </div>

          {/* Discount Ribbon */}
          {tour.discount && tour.discount > 0 && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-secondary text-white text-xs font-bold flex items-center justify-center transform rotate-45 translate-x-6 -translate-y-6">
              ٪{tour.discount} تخفیف
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-3 gap-2">
          <h3 className="font-bold text-sm text-stone-900 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[2.75rem]">
            {tour.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatNumber(tour.duration)} شب
            </span>
            <span className="flex items-center gap-1">
              <Plane className="w-3 h-3" />
              {tour.airline ? airlineLabel : transportLabel}
            </span>
            {tour.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {tour.startDate}
              </span>
            )}
          </div>

          {tour.hotelStars && (
            <div className="flex items-center gap-1 text-amber-500 text-xs" aria-label={`هتل ${tour.hotelStars} ستاره`}>
              {Array.from({ length: tour.hotelStars }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          )}

          {tour.status && statusLabels[tour.status] && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Headphones className="w-3.5 h-3.5" />
              <span>{statusLabels[tour.status]}</span>
            </div>
          )}

          {/* Rating */}
          {tour.rating && (
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span>{tour.rating.toFixed(1)}</span>
              {tour.reviewCount && (
                <span className="text-stone-400">({formatNumber(tour.reviewCount)})</span>
              )}
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-stone-100 flex items-end justify-between gap-2">
            <div>
              {tour.oldPrice && (
                <div className="text-[10px] sm:text-xs text-stone-400 line-through">
                  {formatPrice(tour.oldPrice)}
                </div>
              )}
              <div className="font-bold text-primary text-sm sm:text-base">
                {formatPrice(tour.price)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-secondary border-secondary-200 hover:bg-secondary-50 text-xs"
            >
              مشاهده تور
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal variant for lists
  if (variant === "horizontal") {
    return (
      <Link
        href={`/tours/${tour.slug}`}
        className={cn("group flex rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300", className)}
      >
        <div className="relative w-32 sm:w-48 aspect-[4/3] shrink-0">
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {tour.isFeatured && (
            <Badge variant="gradient" size="sm" className="absolute top-2 right-2 shadow-md">
              ویژه
            </Badge>
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-bold text-sm text-stone-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {tour.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {tour.destination}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatNumber(tour.duration)} شب
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div>
              {tour.oldPrice && (
                <span className="text-xs text-stone-400 line-through">{formatPrice(tour.oldPrice)}</span>
              )}
              <span className="font-bold text-primary text-base ml-2">{formatPrice(tour.price)}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-secondary">
              مشاهده
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant - Full featured card
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={cn("group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300", className)}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-1.5 items-end">
          {tour.isFeatured && (
            <Badge variant="gradient" size="sm" className="shadow-md">
              <Star className="w-3 h-3" />
              ویژه
            </Badge>
          )}
          {tour.isLastMinute && (
            <Badge variant="destructive" size="sm" className="shadow-md">
              <Zap className="w-3 h-3" />
              آخرین فرصت
            </Badge>
          )}
          {tour.discount && (
            <Badge variant="warning" size="sm" className="shadow-md">
              ٪{tour.discount} تخفیف
            </Badge>
          )}
        </div>

        {/* Destination Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur-sm text-stone-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[7rem] sm:max-w-[9rem]">{tour.destination}</span>
        </div>

        {/* Discount Ribbon */}
        {tour.discount && tour.discount > 0 && (
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary text-white text-xs font-bold flex items-center justify-center transform rotate-45 translate-x-6 -translate-y-6">
            ٪{tour.discount} تخفیف
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-stone-600 hover:text-secondary hover:bg-secondary-50 transition-colors group-hover:opacity-100 opacity-0">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-3 gap-2">
        <h3 className="font-bold text-sm text-stone-900 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[2.75rem]">
          {tour.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatNumber(tour.duration)} شب
          </span>
          <span className="flex items-center gap-1">
            <Plane className="w-3 h-3" />
            {tour.airline ? airlineLabel : transportLabel}
          </span>
          {tour.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {tour.startDate}
            </span>
          )}
        </div>

        {tour.hotelStars && (
          <div className="flex items-center gap-1 text-amber-500 text-xs" aria-label={`هتل ${tour.hotelStars} ستاره`}>
            {Array.from({ length: tour.hotelStars }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        )}

        {tour.status && statusLabels[tour.status] && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Headphones className="w-3.5 h-3.5" />
            <span>{statusLabels[tour.status]}</span>
          </div>
        )}

        {/* Rating */}
        {tour.rating && (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span>{tour.rating.toFixed(1)}</span>
            {tour.reviewCount && (
              <span className="text-stone-400">({formatNumber(tour.reviewCount)})</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-stone-100 flex items-end justify-between gap-2">
          <div>
            {tour.oldPrice && (
              <div className="text-[10px] sm:text-xs text-stone-400 line-through">
                {formatPrice(tour.oldPrice)}
              </div>
            )}
            <div className="font-bold text-primary text-sm sm:text-base">
              {formatPrice(tour.price)}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-secondary border-secondary-200 hover:bg-secondary-50 text-xs"
          >
            مشاهده تور
          </Button>
        </div>
      </div>
    </Link>
  );
}

// Skeleton Loader
export function TourCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl overflow-hidden bg-white border border-stone-200 animate-pulse", className)}>
      <div className="aspect-[16/10] bg-stone-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2 border-t border-stone-100">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="h-8 bg-stone-100 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

// Helper function for class merging
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
