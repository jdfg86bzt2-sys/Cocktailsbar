"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function BoutonSuivre({
  profilId,
  dejaAbonne,
  userId,
}: {
  profilId: string;
  dejaAbonne: boolean;
  userId: string | null;
}) {
  const [abonne, setAbonne] = useState(dejaAbonne);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!userId) {
      window.location.href = "/connexion";
      return;
    }
    setLoading(true);
    const supabase = createClient();

    if (abonne) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", profilId);
      setAbonne(false);
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: userId, following_id: profilId });
      setAbonne(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
        abonne
          ? "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent"
          : "bg-accent text-white hover:bg-accent/80"
      }`}
    >
      {loading ? "..." : abonne ? "Abonné" : "Suivre"}
    </button>
  );
}
