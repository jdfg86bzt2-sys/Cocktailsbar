import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "rounded-md px-4 py-2 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50";
  const variants: Record<Variant, string> = {
    primary: "bg-accent text-accent-foreground",
    secondary: "border border-border text-foreground",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`} />
  );
}
