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
  return { supabase, userId: user.id };
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

export async function publierSuggestionTwist(suggestionId: string) {
  const { supabase } = await verifierAdmin();

  const { data: s } = await supabase
    .from("suggestions_twists").select("*").eq("id", suggestionId).single();
  if (!s) return;

  const { data: twist, error } = await supabase
    .from("twists")
    .insert({
      cocktail_origine_id: s.cocktail_origine_id,
      createur_id: s.utilisateur_id,
      nom: s.nom,
      description: s.description,
      technique: s.technique,
      photo_url: s.photo_url,
    })
    .select("id")
    .single();

  if (error || !twist) return;

  const ingredients = (s.ingredients as Array<{
    ingredient_nom: string; quantite: number | null; unite: string | null; ordre: number;
  }>).filter((i) => i.ingredient_nom?.trim());

  if (ingredients.length > 0) {
    await supabase.from("twist_ingredients").insert(
      ingredients.map((i) => ({
        twist_id: twist.id,
        ingredient_nom: i.ingredient_nom,
        quantite: i.quantite,
        unite: i.unite,
        ordre: i.ordre,
      }))
    );
  }

  const etapes = (s.etapes as Array<{ texte: string; ordre: number }>).filter((e) => e.texte?.trim());
  if (etapes.length > 0) {
    await supabase.from("twist_etapes").insert(
      etapes.map((e) => ({ twist_id: twist.id, texte: e.texte, ordre: e.ordre }))
    );
  }

  await supabase.from("suggestions_twists").update({ statut: "accepte" }).eq("id", suggestionId);

  // Email de confirmation à l'auteur
  const { email, pseudo } = await getEmailEtPseudo(supabase, s.utilisateur_id);
  if (email) {
    await envoyerConfirmationSuggestion({
      destinataireEmail: email,
      destinatairePseudo: pseudo,
      type: "twist",
      nom: s.nom,
      accepte: true,
      lien: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://cocktailsbar.vercel.app"}/cocktails/${s.cocktail_origine_id}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/twists");
}

export async function refuserSuggestionTwist(suggestionId: string) {
  const { supabase } = await verifierAdmin();

  const { data: s } = await supabase
    .from("suggestions_twists").select("utilisateur_id, nom").eq("id", suggestionId).single();

  await supabase.from("suggestions_twists").update({ statut: "refuse" }).eq("id", suggestionId);

  if (s) {
    const { email, pseudo } = await getEmailEtPseudo(supabase, s.utilisateur_id);
    if (email) {
      await envoyerConfirmationSuggestion({
        destinataireEmail: email,
        destinatairePseudo: pseudo,
        type: "twist",
        nom: s.nom,
        accepte: false,
      }).catch(() => {});
    }
  }

  revalidatePath("/admin/twists");
}
