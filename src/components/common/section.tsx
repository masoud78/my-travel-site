import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-12 md:py-16", className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "right" | "center";
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, subtitle, align = "right", action, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-1",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 leading-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-stone-600 text-sm md:text-base">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
