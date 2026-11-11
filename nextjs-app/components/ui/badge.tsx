import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center font-bold rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border border-slate-200/80",
        high: "bg-lime-50 text-lime-800 border border-lime-300/80 font-bold",
        medium: "bg-amber-50 text-amber-800 border border-amber-300/80 font-bold",
        low: "bg-slate-100 text-slate-600 border border-slate-200",
        verified: "bg-purple-50 text-purple-700 border border-purple-200/80 font-bold",
        accent: "bg-accent-lime-glow/20 text-surface-dark border border-accent-lime-glow font-bold",
        outline: "border border-slate-200 text-slate-700 bg-white font-semibold",
      },
      size: {
        sm: "text-[10px] px-2.5 py-0.5 gap-1",
        md: "text-xs px-3 py-1 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}
