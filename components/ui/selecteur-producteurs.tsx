"use client";

import { useState } from "react";

type Producteur = { id: string; nom: string; type: string; region: string | null };

// Permet de sélectionner des producteurs parmi la liste existante
// et les envoie comme champs cachés dans le formulaire
export function SelecteurProducteurs({ producteurs }: { producteurs: Producteur[] }) {
  const [selection, setSelection] = useState<string[]>([]);

  if (producteurs.length === 0) {
    return (
      <p className="text-sm text-foreground/50">
        Aucun producteur référencé pour l&apos;instant.{" "}
        <a href="/producteurs/nouveau" target="_blank" className="text-accent hover:underline">
          Référencer un producteur →
        </a>
      </p>
    );
  }

  function toggle(id: string) {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Producteurs utilisés{" "}
        <span className="text-foreground/50">(optionnel)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {producteurs.map((p) => {
          const actif = selection.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                actif
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground/70 hover:border-accent"
              }`}
            >
              {p.nom}
              {p.region && <span className="ml-1 opacity-60 text-xs">· {p.region}</span>}
            </button>
          );
        })}
      </div>
      {selection.map((id) => (
        <input key={id} type="hidden" name="producteur_id[]" value={id} />
      ))}
    </div>
  );
}
