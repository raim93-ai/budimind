import * as React from "react";

const buttonVariants = {
  default: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent/20 hover:text-accent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
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