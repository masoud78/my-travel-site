import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="مسیر راهنما" className={`flex items-center text-sm text-stone-500 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors" aria-label="صفحه اصلی">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4 text-stone-300" />
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-stone-900 font-medium" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
