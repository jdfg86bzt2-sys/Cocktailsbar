"use client";

import { useState, useTransition } from "react";
import { toggleFavori } from "@/app/cocktails/[id]/favoris-actions";

export function BoutonFavori({
  cocktailId,
  dejaFavori,
  userId,
}: {
  cocktailId: string;
  dejaFavori: boolean;
  userId: string | null;
}) {
  const [favori, setFavori] = useState(dejaFavori);
  const [isPending, startTransition] = useTransition();

  if (!userId) {
    return (
      <a href="/connexion" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/40 hover:border-accent hover:text-accent transition-colors" title="Sauvegarder">
        🔖
      </a>
    );
  }

  function handleClick() {
    startTransition(async () => {
      const res = await toggleFavori(cocktailId);
      setFavori(res.favori);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={favori ? "Retirer des favoris" : "Sauvegarder"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
        favori
          ? "border-amber-400 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
          : "border-border text-foreground/40 hover:border-amber-400 hover:text-amber-400"
      }`}
    >
      {favori ? "🔖" : "🔖"}
    </button>
  );
}
