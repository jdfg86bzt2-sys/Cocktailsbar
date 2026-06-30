"use client";

import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";

// Liste de lignes "quantité / unité / ingrédient" avec ajout/suppression dynamique
export function IngredientsForm() {
  const [nbLignes, setNbLignes] = useState(3);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Ingrédients</label>
      {Array.from({ length: nbLignes }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <Input
            name="quantite[]"
            type="number"
            step="0.1"
            placeholder="4"
            className="w-20"
          />
          <Input name="unite[]" placeholder="cl" className="w-20" />
          <Input name="ingredient_nom[]" placeholder="Ex: Gin" />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        className="self-start text-sm"
        onClick={() => setNbLignes((n) => n + 1)}
      >
        + Ajouter un ingrédient
      </Button>
    </div>
  );
}
