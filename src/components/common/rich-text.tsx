import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RichTextProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "large" | "small";
}

export function RichText({ children, className, variant = "default" }: RichTextProps) {
  const variantClasses = {
    default: "text-stone-700 leading-relaxed",
    large: "text-lg text-stone-700 leading-loose",
    small: "text-sm text-stone-600 leading-relaxed",
  };

  return (
    <div className={cn("prose prose-stone max-w-none", variantClasses[variant], className)}>
      {children}
    </div>
  );
}

// Prose configuration for Tailwind
// Add this to your globals.css or tailwind.config.js
// @tailwind base;
// @tailwind components;
// @tailwind utilities;
//
// .prose :where(h1):not(:where([class~="not-prose"] *)) {
//   @apply text-2xl md:text-3xl font-bold text-stone-900 mb-4;
// }
// .prose :where(h2):not(:where([class~="not-prose"] *)) {
//   @apply text-xl md:text-2xl font-bold text-stone-900 mb-3;
// }
// .prose :where(h3):not(:where([class~="not-prose"] *)) {
//   @apply text-lg font-bold text-stone-900 mb-2;
// }
// .prose :where(p):not(:where([class~="not-prose"] *)) {
//   @apply text-stone-700 leading-relaxed mb-4;
// }
// .prose :where(a):not(:where([class~="not-prose"] *)) {
//   @apply text-primary hover:underline;
// }
// .prose :where(ul):not(:where([class~="not-prose"] *)),
// .prose :where(ol):not(:where([class~="not-prose"] *)) {
//   @apply list-disc list-inside text-stone-700 mb-4;
// }
// .prose :where(li):not(:where([class~="not-prose"] *)) {
//   @apply mb-1;
// }
// .prose :where(blockquote):not(:where([class~="not-prose"] *)) {
//   @apply border-l-4 border-primary-300 pl-4 italic text-stone-700 my-4;
// }
