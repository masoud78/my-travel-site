import Link from "next/link";
import Image from "next/image";
import { Clock, Plane, Calendar, MapPin, Headphones, Star, Zap } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  image?: string;
  startDate?: string;
  hotelStars?: number;
  discount?: number | null;
  isLastMinute?: boolean;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
}

interface TourCardProps {
  tour: TourCardData;
  className?: string;
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

export function TourCard({ tour }: TourCardProps) {
  const imageUrl = tour.image || `/images/placeholder-tour.jpg`;
  const transportLabel = transportLabels[tour.transport] || tour.transport;
  const airlineLabel = tour.airline || transportLabel;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
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
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-1.5 items-end">
          {tour.isFeatured && (
            <Badge variant="accent" className="shadow-md">
              <Star className="w-3 h-3 ml-1" />
              ویژه
            </Badge>
          )}
          {tour.isLastMinute && (
            <Badge variant="destructive" className="shadow-md">
              <Zap className="w-3 h-3 ml-1" />
              آخرین فرصت
            </Badge>
          )}
          {tour.discount ? (
            <div className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
              ٪{tour.discount} تخفیف
            </div>
          ) : null}
        </div>
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur-sm text-stone-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[7rem] sm:max-w-[9rem]">{tour.destination}</span>
        </div>
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

        <div className="mt-auto pt-2 border-t border-stone-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] sm:text-xs text-stone-400">شروع قیمت</div>
            <div className="font-bold text-primary text-sm sm:text-base">
              {formatPrice(tour.price)}
            </div>
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-secondary bg-secondary-50 px-2.5 py-1 rounded-lg shrink-0">
            مشاهده تور
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TourCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-stone-200 animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/2" />
        <div className="h-6 bg-stone-200 rounded w-1/3 mt-4" />
      </div>
    </div>
  );
}
