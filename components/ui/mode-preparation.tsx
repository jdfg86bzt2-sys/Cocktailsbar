"use client";

import { useState } from "react";

type Ingredient = { ingredient_nom: string; quantite: string | null; unite: string | null };
type Etape = { texte: string; ordre: number };

export function ModePreparation({
  nomCocktail,
  ingredients,
  etapes,
}: {
  nomCocktail: string;
  ingredients: Ingredient[];
  etapes: Etape[];
}) {
  const [ouvert, setOuvert] = useState(false);
  const [etape, setEtape] = useState(0); // 0 = ingrédients, 1..n = étapes

  const total = etapes.length;
  const estIngredients = etape === 0;
  const etapeActuelle = etapes[etape - 1];
  const progres = etape === 0 ? 0 : Math.round((etape / total) * 100);

  function ouvrir() {
    setEtape(0);
    setOuvert(true);
  }

  function fermer() {
    setOuvert(false);
  }

  function suivant() {
    if (etape < total) setEtape((e) => e + 1);
  }

  function precedent() {
    if (etape > 0) setEtape((e) => e - 1);
  }

  return (
    <>
      <button
        onClick={ouvrir}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/70 hover:border-accent hover:text-accent transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Mode préparation
      </button>

      {ouvert && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="text-sm font-medium text-foreground/50">{nomCocktail}</p>
            <button onClick={fermer} className="rounded-md p-1 text-foreground/40 hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Barre de progression */}
          <div className="h-1 bg-surface">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progres}%` }}
            />
          </div>

          {/* Contenu */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            {estIngredients ? (
              <>
                <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground/40">Ingrédients</p>
                <ul className="space-y-3 text-left">
                  {ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                      <span>
                        {ing.quantite && <span className="font-semibold text-accent">{ing.quantite}{ing.unite ?? ""} </span>}
                        {ing.ingredient_nom}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Étape {etape} / {total}
                </p>
                <p className="max-w-md text-2xl font-medium leading-relaxed text-foreground">
                  {etapeActuelle?.texte}
                </p>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-border px-5 py-5">
            <button
              onClick={precedent}
              disabled={etape === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground/60 hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Précédent
            </button>

            <span className="text-sm text-foreground/30">
              {etape === 0 ? "Ingrédients" : `${etape} / ${total}`}
            </span>

            {etape < total ? (
              <button
                onClick={suivant}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {etape === 0 ? "Commencer" : "Suivant"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <button
                onClick={fermer}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Terminer ✓
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
