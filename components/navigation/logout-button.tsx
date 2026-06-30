"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Bouton de déconnexion : doit être un Client Component pour gérer le clic
export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-foreground/70 hover:text-accent"
    >
      Déconnexion
    </button>
  );
}
