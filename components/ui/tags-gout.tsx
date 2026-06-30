"use client";

import { useState } from "react";
import { TAGS_GOUT } from "@/lib/types";

// Tags de goût sélectionnables (multi-sélection)
// Les tags cochés sont envoyés comme champs cachés dans le formulaire
export function TagsGout({ selectionInitiale = [] }: { selectionInitiale?: string[] }) {
  const [selection, setSelection] = useState<string[]>(selectionInitiale);

  function toggle(tag: string) {
    setSelection((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Profil de goût</label>
      <div className="flex flex-wrap gap-2">
        {TAGS_GOUT.map((tag) => {
          const actif = selection.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                actif
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground/70 hover:border-accent"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {/* Champs cachés pour soumettre la sélection via le formulaire HTML */}
      {selection.map((tag) => (
        <input key={tag} type="hidden" name="tags_gout[]" value={tag} />
      ))}
    </div>
  );
}
