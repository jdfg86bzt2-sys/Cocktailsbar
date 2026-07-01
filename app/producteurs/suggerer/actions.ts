"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function suggererProducteurAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const nom = (formData.get("nom") as string).trim();

  // Vérifier si ce producteur existe déjà en base
  const { data: existant } = await supabase
    .from("producteurs")
    .select("id")
    .ilike("nom", nom)
    .maybeSingle();

  if (existant) {
    redirect(`/producteurs/suggerer?erreur=${encodeURIComponent(`"${nom}" est déjà référencé comme producteur sur la plateforme.`)}`);
  }

  // Vérifier si une suggestion en attente existe déjà pour ce nom
  const { data: dejaPropose } = await supabase
    .from("suggestions_producteurs")
    .select("id")
    .ilike("nom", nom)
    .eq("statut", "en_attente")
    .maybeSingle();

  if (dejaPropose) {
    redirect(`/producteurs/suggerer?erreur=${encodeURIComponent(`Une suggestion pour "${nom}" est déjà en attente de validation.`)}`);
  }

  const { error } = await supabase.from("suggestions_producteurs").insert({
    utilisateur_id: user.id,
    nom,
    site_web: (formData.get("site_web") as string) || null,
    message: (formData.get("message") as string) || null,
  });

  if (error) {
    redirect(`/producteurs/suggerer?erreur=${encodeURIComponent(error.message)}`);
  }

  redirect("/producteurs/suggerer?succes=1");
}
