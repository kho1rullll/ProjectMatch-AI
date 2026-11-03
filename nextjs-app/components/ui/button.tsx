import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary-container hover:bg-primary-hover text-white shadow-md shadow-purple-500/25",
        secondary: "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80",
        outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-purple-300",
        destructive: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
        ghost: "bg-transparent hover:bg-purple-50 text-slate-700 hover:text-purple-700",
        accent: "bg-accent-lime-glow hover:bg-secondary-fixed text-surface-dark font-extrabold shadow-md shadow-lime-500/20",
      },
      size: {
        sm: "text-xs px-3.5 py-1.5 gap-1.5",
        md: "text-xs sm:text-sm px-5 py-2.5 gap-2",
        lg: "text-sm sm:text-base px-7 py-3.5 gap-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
