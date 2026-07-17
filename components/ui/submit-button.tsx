"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, labelPending }: { label: string; labelPending?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (labelPending ?? "Envoi en cours...") : label}
    </button>
  );
}
