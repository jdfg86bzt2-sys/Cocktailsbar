"use client";

import { useState } from "react";
import { Button } from "./button";

// Lignes d'étapes numérotées dynamiques (ajouter/retirer)
export function EtapesForm() {
  const [nbEtapes, setNbEtapes] = useState(3);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Étapes de préparation</label>
      {Array.from({ length: nbEtapes }).map((_, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2.5 min-w-[1.5rem] text-center text-sm font-bold text-accent">
            {i + 1}
          </span>
          <input
            name="etape[]"
            placeholder={`Étape ${i + 1}`}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        className="self-start text-sm"
        onClick={() => setNbEtapes((n) => n + 1)}
      >
        + Ajouter une étape
      </Button>
    </div>
  );
}
