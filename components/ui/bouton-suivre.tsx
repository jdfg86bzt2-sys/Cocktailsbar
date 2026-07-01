"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function BoutonSuivre({
  profilId,
  dejaAbonne,
  notifActive,
  userId,
}: {
  profilId: string;
  dejaAbonne: boolean;
  notifActive: boolean;
  userId: string | null;
}) {
  const [abonne, setAbonne] = useState(dejaAbonne);
  const [notif, setNotif] = useState(notifActive);
  const [loading, setLoading] = useState(false);

  async function toggleSuivre() {
    if (!userId) { window.location.href = "/connexion"; return; }
    setLoading(true);
    const supabase = createClient();
    if (abonne) {
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", profilId);
      setAbonne(false);
      setNotif(false);
    } else {
      await supabase.from("follows").insert({ follower_id: userId, following_id: profilId, notif_active: false });
      setAbonne(true);
    }
    setLoading(false);
  }

  async function toggleNotif() {
    if (!userId || !abonne) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("follows")
      .update({ notif_active: !notif })
      .eq("follower_id", userId)
      .eq("following_id", profilId);
    setNotif((n) => !n);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSuivre}
        disabled={loading}
        className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
          abonne
            ? "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent"
            : "bg-accent text-white hover:bg-accent/80"
        }`}
      >
        {loading ? "..." : abonne ? "Abonné" : "Suivre"}
      </button>

      {abonne && (
        <button
          onClick={toggleNotif}
          disabled={loading}
          title={notif ? "Désactiver les notifications" : "Activer les notifications"}
          className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
            notif
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-foreground/40 hover:border-accent hover:text-accent"
          }`}
        >
          🔔
        </button>
      )}
    </div>
  );
}
