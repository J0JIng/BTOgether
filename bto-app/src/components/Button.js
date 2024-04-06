import React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import "tailwindcss/tailwind.css";

const buttonVariants =
  (className) =>
  ({ variant = "default", size = "default", ...props }) => {
    const variants = {
      default: "bg-pink-900 text-white hover:bg-gray-800",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-gray-100",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const defaultVariants = {
      variant: "default",
      size: "default",
    };

    const classNames = clsx(
      "flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variants[variant],
      sizes[size],
      className
    );

    return {
      className: classNames,
      ...props,
    };
  };

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={clsx(
          buttonVariants(className)({ variant, size }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
