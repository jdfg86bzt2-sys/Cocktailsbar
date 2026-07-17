import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-foreground placeholder:text-foreground/40 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
    />
  );
}
