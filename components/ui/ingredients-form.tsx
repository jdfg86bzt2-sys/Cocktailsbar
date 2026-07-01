"use client";

import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";

type Producteur = { id: string; nom: string };

export function IngredientsForm({ producteurs }: { producteurs?: Producteur[] }) {
  const [nbLignes, setNbLignes] = useState(3);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Ingrédients</label>
      {Array.from({ length: nbLignes }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <Input name="quantite[]" type="number" step="0.1" placeholder="4" className="w-20" />
          <Input name="unite[]" placeholder="cl" className="w-20" />
          <Input name="ingredient_nom[]" placeholder="Ex: Gin" className="flex-1" />
          {producteurs && producteurs.length > 0 && (
            <select
              name="producteur_ingredient_id[]"
              className="rounded-md border border-border bg-surface px-2 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Producteur?</option>
              {producteurs.map((p) => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          )}
        </div>
      ))}
      <Button type="button" variant="secondary" className="self-start text-sm" onClick={() => setNbLignes((n) => n + 1)}>
        + Ajouter un ingrédient
      </Button>
    </div>
  );
}
