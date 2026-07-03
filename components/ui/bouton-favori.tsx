"use client";

import { useState, useTransition } from "react";
import { toggleFavori } from "@/app/cocktails/[id]/favoris-actions";

function IconMarquePage({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

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
      <a
        href="/connexion"
        title="Connecte-toi pour sauvegarder"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/40 hover:border-accent hover:text-accent transition-colors"
      >
        <IconMarquePage filled={false} />
        <span>Sauvegarder</span>
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
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        favori
          ? "border-accent bg-accent/10 text-accent hover:bg-accent/20"
          : "border-border text-foreground/60 hover:border-accent hover:text-accent"
      }`}
    >
      <IconMarquePage filled={favori} />
      <span>{favori ? "Sauvegardé" : "Sauvegarder"}</span>
    </button>
  );
}
