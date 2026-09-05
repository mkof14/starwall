import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-orange text-navy hover:bg-orange/90",
    ghost: "bg-transparent text-sand hover:bg-sand/10",
    outline: "border border-sand/25 bg-transparent text-sand hover:border-sand/50",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
