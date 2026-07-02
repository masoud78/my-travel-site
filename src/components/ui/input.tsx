import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "bordered" | "glass" | "ghost";
  size?: "sm" | "default" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "default",
      size = "default",
      icon,
      iconPosition = "left",
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-background border border-input",
      bordered: "bg-background border-2 border-input",
      glass: "glass border border-white/20 text-white placeholder:text-white/60",
      ghost: "bg-transparent border-0",
    };

    const sizeClasses = {
      sm: "h-9 text-xs",
      default: "h-11 text-sm",
      lg: "h-12 text-base",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <span className={cn(iconSizeClasses[size])}>{icon}</span>
          </div>
        )}
        <input
          type={type}
          disabled={disabled}
          className={cn(
            "flex w-full rounded-xl file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            variantClasses[variant],
            sizeClasses[size],
            icon && (iconPosition === "left" ? "pl-11" : "pr-11"),
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <span className={cn(iconSizeClasses[size])}>{icon}</span>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
