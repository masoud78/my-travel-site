import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({ items, className, separator = <ChevronLeft className="w-4 h-4 text-stone-400" /> }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      <Link
        href="/"
        className="flex items-center gap-1 text-stone-500 hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>خانه</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <span key={index} className="flex items-center gap-1">
            {separator}
            {isLast ? (
              <span className="text-stone-900 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href || "#"}
                className="text-stone-500 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
