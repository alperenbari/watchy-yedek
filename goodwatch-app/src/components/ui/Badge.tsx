import type { PropsWithChildren } from "react";
import { clsx } from "clsx";

type BadgeProps = PropsWithChildren<{
  variant?: "default" | "outline" | "subtle";
  className?: string;
}>;

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variant === "default" && "bg-white/15 text-white",
        variant === "outline" && "border border-white/30 text-white/80",
        variant === "subtle" && "bg-white/10 text-white/70",
        className,
      )}
    >
      {children}
    </span>
  );
}
