"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { envoyerConfirmationSuggestion } from "@/lib/email";

async function verifierAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");
  return { supabase };
}

async function getEmailEtPseudo(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>, userId: string) {
  const [{ data: usersData }, { data: profile }] = await Promise.all([
    supabase.auth.admin.listUsers(),
    supabase.from("profiles").select("pseudo").eq("id", userId).single(),
  ]);
  const email = usersData?.users.find((u) => u.id === userId)?.email ?? "";
  const pseudo = profile?.pseudo ?? "Utilisateur";
  return { email, pseudo };
}

export async function changerStatutSuggestion(id: string, statut: "accepte" | "refuse") {
  const { supabase } = await verifierAdmin();

  const { data: s } = await supabase
    .from("suggestions_producteurs").select("utilisateur_id, nom").eq("id", id).single();

  await supabase.from("suggestions_producteurs").update({ statut }).eq("id", id);

  if (s) {
    const { email, pseudo } = await getEmailEtPseudo(supabase, s.utilisateur_id);
    if (email) {
      await envoyerConfirmationSuggestion({
        destinataireEmail: email,
        destinatairePseudo: pseudo,
        type: "producteur",
        nom: s.nom,
        accepte: statut === "accepte",
      }).catch(() => {});
    }
  }

  revalidatePath("/admin/suggestions");
}
