import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  variant?: "default" | "gradient" | "glass" | "bordered";
}

export function Section({ 
  children, 
  className, 
  containerClassName, 
  id,
  variant = "default"
}: SectionProps) {
  const variantClasses = {
    default: "",
    gradient: "bg-gradient-to-br from-primary-50 to-accent-50",
    glass: "glass border border-white/20",
    bordered: "border-t border-stone-200",
  };

  return (
    <section id={id} className={cn("py-10 md:py-14 lg:py-16", variantClasses[variant], className)}>
      <div className={cn("container mx-auto px-3 sm:px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "right" | "center" | "left";
  action?: ReactNode;
  className?: string;
  showDividers?: boolean;
}

export function SectionHeading({ 
  title, 
  subtitle, 
  align = "right", 
  action, 
  className,
  showDividers = false
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-5 md:mb-6 flex flex-col gap-2 md:gap-1",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn(showDividers && "relative pl-4")}>
        {showDividers && (
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
        )}
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-stone-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 md:mt-2 text-stone-600 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  );
}

// Modern Section with decorative elements
interface ModernSectionProps extends SectionProps {
  decorative?: boolean;
  pattern?: "dots" | "lines" | "waves" | "none";
}

export function ModernSection({ 
  children, 
  className, 
  containerClassName, 
  id,
  variant = "default",
  decorative = false,
  pattern = "none"
}: ModernSectionProps) {
  const patternClasses = {
    dots: "bg-[radial-gradient(circle_at_1px_1px,rgba(30,64,175,0.15),transparent_0)] bg-[length:20px_20px]",
    lines: "bg-[linear-gradient(to_right,rgba(30,64,175,0.05)_1px,transparent_1px)] bg-[length:40px_40px]",
    waves: "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYWZmYmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat",
    none: "",
  };

  return (
    <Section 
      id={id} 
      className={cn(
        decorative && patternClasses[pattern],
        className
      )}
      containerClassName={containerClassName}
      variant={variant}
    >
      {children}
    </Section>
  );
}

// Section with title and action
interface SectionWithActionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "right" | "center" | "left";
}

export function SectionWithAction({ 
  title, 
  subtitle, 
  action, 
  children, 
  className,
  align = "right"
}: SectionWithActionProps) {
  return (
    <Section className={className}>
      <SectionHeading 
        title={title} 
        subtitle={subtitle} 
        action={action} 
        align={align}
      />
      {children}
    </Section>
  );
}
