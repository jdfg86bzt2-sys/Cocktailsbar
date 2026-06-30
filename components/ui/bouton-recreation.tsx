"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function BoutonRecreation({
  cocktailId,
  dejaRecrée,
  nbRecreations,
  userId,
}: {
  cocktailId: string;
  dejaRecrée: boolean;
  nbRecreations: number;
  userId: string | null;
}) {
  const [actif, setActif] = useState(dejaRecrée);
  const [count, setCount] = useState(nbRecreations);
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  if (!userId) {
    return (
      <a href="/connexion" className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/60 hover:border-accent">
        🔁 {count} recréation{count !== 1 ? "s" : ""} — Connecte-toi pour en déclarer une
      </a>
    );
  }

  async function basculer() {
    setChargement(true);
    const supabase = createClient();

    if (actif) {
      await supabase
        .from("recreations")
        .delete()
        .match({ cocktail_id: cocktailId, user_id: userId });
      setCount((n) => n - 1);
    } else {
      await supabase
        .from("recreations")
        .insert({ cocktail_id: cocktailId, user_id: userId });
      setCount((n) => n + 1);
    }

    setActif((v) => !v);
    setChargement(false);
    router.refresh();
  }

  return (
    <button
      onClick={basculer}
      disabled={chargement}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        actif
          ? "border-accent bg-accent/10 text-accent"
          : "border-border hover:border-accent hover:text-accent"
      }`}
    >
      🔁 {count} recréation{count !== 1 ? "s" : ""}{actif ? " — Tu l'as faite" : " — J'ai recréé ce cocktail"}
    </button>
  );
}
