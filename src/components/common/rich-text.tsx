import { cn } from "@/lib/utils";

interface RichTextProps {
  content: string;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  return (
    <div
      className={cn("prose-fa", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
