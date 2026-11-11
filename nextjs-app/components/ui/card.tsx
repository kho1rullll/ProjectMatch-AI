import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  "rounded-3xl transition-all duration-300 border",
  {
    variants: {
      variant: {
        default: "bg-white border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.03)] text-slate-900",
        elevated: "bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] text-slate-900",
        interactive: "bg-white border-slate-200/80 hover:border-primary-container hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all text-slate-900 cursor-pointer",
        ghost: "bg-transparent border-transparent text-slate-900",
        dark: "bg-surface-dark border-border-glass-dark text-surface-white shadow-2xl",
      },
      padding: {
        none: "p-0",
        sm: "p-3 sm:p-4",
        md: "p-5 sm:p-6",
        lg: "p-6 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center pt-4", className)} {...props} />;
}
