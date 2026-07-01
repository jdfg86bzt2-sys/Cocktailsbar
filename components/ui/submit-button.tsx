"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, labelPending }: { label: string; labelPending?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (labelPending ?? "Envoi en cours...") : label}
    </button>
  );
}
