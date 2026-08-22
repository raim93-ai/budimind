import * as React from "react";

const buttonVariants = {
  default: "inline-flex items-center justify-center gap-2 rounded-xl min-h-[44px] px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md",
  destructive: "inline-flex items-center justify-center gap-2 rounded-xl min-h-[44px] px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-destructive text-white shadow-sm hover:brightness-110",
  outline: "inline-flex items-center justify-center gap-2 rounded-xl min-h-[44px] px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 border-[1.5px] border-primary text-primary bg-transparent hover:bg-primary-soft",
  secondary: "inline-flex items-center justify-center gap-2 rounded-xl min-h-[44px] px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:brightness-110",
  accent: "inline-flex items-center justify-center gap-2 rounded-xl min-h-[44px] px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground shadow-sm hover:brightness-105 hover:shadow-md",
  ghost: "inline-flex items-center justify-center gap-2 rounded-xl min-h-[44px] px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-transparent text-primary hover:bg-primary-soft",
};

interface ButtonProps
extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={
          buttonVariants[variant] +
            (className ? " " + className : "")
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };