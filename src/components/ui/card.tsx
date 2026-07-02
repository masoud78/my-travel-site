import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "glass" | "gradient" | "hoverable";
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", shadow = "md", children, ...props },
    ref
  ) => {
    const variantClasses = {
      default: "bg-card text-card-foreground",
      bordered: "bg-card border border-border text-card-foreground",
      glass: "glass border border-white/20 text-white",
      gradient: "bg-gradient-to-br from-primary-50 to-accent-50 text-card-foreground",
      hoverable: "bg-card text-card-foreground transition-all hover:shadow-card-hover hover:-translate-y-1",
    };

    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const shadowClasses = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-card",
      lg: "shadow-lg",
      xl: "shadow-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          variantClasses[variant],
          paddingClasses[padding],
          shadowClasses[shadow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "glass";
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "",
      gradient: "bg-gradient-to-r from-primary-600 to-primary-800 text-white",
      glass: "glass border-b border-white/20",
    };

    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 rounded-t-2xl", variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-6 py-4 rounded-b-2xl bg-muted/50", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Card Image
interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  variant?: "normal" | "rounded" | "full";
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, variant = "rounded", ...props }, ref) => {
    const variantClasses = {
      normal: "rounded-t-2xl",
      rounded: "rounded-2xl",
      full: "rounded-2xl",
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden aspect-[16/10]", variantClasses[variant], className)}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
);
CardImage.displayName = "CardImage";

export { Card, CardHeader, CardContent, CardFooter, CardImage };
