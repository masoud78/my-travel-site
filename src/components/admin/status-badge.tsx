type StatusType = "success" | "warning" | "danger" | "info" | "default";

const statusStyles: Record<StatusType, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-stone-100 text-stone-700 border-stone-200",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  type?: StatusType;
}

export function StatusBadge({ children, type = "default" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[type]}`}>
      {children}
    </span>
  );
}
