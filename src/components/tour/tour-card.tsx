import Link from "next/link";
import Image from "next/image";
import { Clock, Plane, Calendar, MapPin, Headphones, Star, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
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
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-stone-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {tour.destination}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        <h3 className="font-bold text-base text-stone-900 line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
          {tour.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tour.duration} شب
          </span>
          <span className="flex items-center gap-1">
            <Plane className="w-3.5 h-3.5" />
            {tour.airline ? airlineLabel : transportLabel}
          </span>
          {tour.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {tour.startDate}
            </span>
          )}
        </div>

        {tour.hotelStars && (
          <div className="flex items-center gap-1 text-amber-500 text-sm" aria-label={`هتل ${tour.hotelStars} ستاره`}>
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

        <div className="mt-auto pt-3 border-t border-stone-100 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-stone-400">شروع قیمت</div>
            <div className="font-bold text-primary text-lg">
              {formatPrice(tour.price)}
              <span className="text-xs font-normal text-stone-500 mr-1">تومان</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-secondary bg-secondary-50 px-3 py-1.5 rounded-lg">
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
