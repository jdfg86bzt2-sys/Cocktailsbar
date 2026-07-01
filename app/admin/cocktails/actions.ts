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

export async function publierSuggestionCocktail(suggestionId: string) {
  const { supabase } = await verifierAdmin();

  const { data: s } = await supabase
    .from("suggestions_cocktails").select("*").eq("id", suggestionId).single();
  if (!s) return;

  // Vérifier doublon
  const { data: existant } = await supabase
    .from("cocktails").select("id").ilike("nom", s.nom).maybeSingle();
  if (existant) {
    await supabase.from("suggestions_cocktails").update({ statut: "refuse" }).eq("id", suggestionId);
    revalidatePath("/admin/cocktails");
    return;
  }

  const { data: cocktail, error } = await supabase
    .from("cocktails")
    .insert({
      createur_id: s.utilisateur_id,
      nom: s.nom,
      description: s.description,
      categorie_alcool: s.categorie_alcool,
      technique: s.technique,
      type_verre: s.type_verre,
      tags_gout: s.tags_gout,
      est_signature: s.demande_signature,
      photo_url: s.photo_url,
    })
    .select("id")
    .single();

  if (error || !cocktail) return;

  const ingredients = (s.ingredients as Array<{
    ingredient_nom: string; quantite: number | null; unite: string | null; producteur_id: string | null; ordre: number;
  }>).filter((i) => i.ingredient_nom?.trim());

  if (ingredients.length > 0) {
    await supabase.from("cocktail_ingredients").insert(
      ingredients.map((i) => ({
        cocktail_id: cocktail.id,
        ingredient_nom: i.ingredient_nom,
        quantite: i.quantite,
        unite: i.unite,
        ordre: i.ordre,
      }))
    );
    const producteursIds = [...new Set(ingredients.map((i) => i.producteur_id).filter(Boolean) as string[])];
    if (producteursIds.length > 0) {
      await supabase.from("cocktail_producteurs").insert(
        producteursIds.map((pid) => ({ cocktail_id: cocktail.id, producteur_id: pid }))
      );
    }
  }

  const etapes = (s.etapes as Array<{ texte: string; ordre: number }>).filter((e) => e.texte?.trim());
  if (etapes.length > 0) {
    await supabase.from("cocktail_etapes").insert(
      etapes.map((e) => ({ cocktail_id: cocktail.id, texte: e.texte, ordre: e.ordre }))
    );
  }

  await supabase.from("suggestions_cocktails").update({ statut: "accepte" }).eq("id", suggestionId);

  // Email de confirmation à l'auteur
  const { email, pseudo } = await getEmailEtPseudo(supabase, s.utilisateur_id);
  if (email) {
    await envoyerConfirmationSuggestion({
      destinataireEmail: email,
      destinatairePseudo: pseudo,
      type: "cocktail",
      nom: s.nom,
      accepte: true,
      lien: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://cocktailsbar.vercel.app"}/cocktails/${cocktail.id}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/cocktails");
  revalidatePath("/cocktails");
}

export async function refuserSuggestionCocktail(suggestionId: string) {
  const { supabase } = await verifierAdmin();

  const { data: s } = await supabase
    .from("suggestions_cocktails").select("utilisateur_id, nom").eq("id", suggestionId).single();

  await supabase.from("suggestions_cocktails").update({ statut: "refuse" }).eq("id", suggestionId);

  if (s) {
    const { email, pseudo } = await getEmailEtPseudo(supabase, s.utilisateur_id);
    if (email) {
      await envoyerConfirmationSuggestion({
        destinataireEmail: email,
        destinatairePseudo: pseudo,
        type: "cocktail",
        nom: s.nom,
        accepte: false,
      }).catch(() => {});
    }
  }

  revalidatePath("/admin/cocktails");
}
