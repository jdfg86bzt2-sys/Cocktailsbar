"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { envoyerNotifNouveauCocktail } from "@/lib/email";

async function verifierAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");
  return { supabase, userId: user.id };
}

export async function publierSuggestionCocktail(suggestionId: string) {
  const { supabase, userId } = await verifierAdmin();

  const { data: s } = await supabase
    .from("suggestions_cocktails")
    .select("*")
    .eq("id", suggestionId)
    .single();

  if (!s) return;

  // Vérifier doublon avant publication
  const { data: existant } = await supabase
    .from("cocktails")
    .select("id")
    .ilike("nom", s.nom)
    .maybeSingle();

  if (existant) {
    await supabase
      .from("suggestions_cocktails")
      .update({ statut: "refuse" })
      .eq("id", suggestionId);
    revalidatePath("/admin/cocktails");
    return;
  }

  // Créer le cocktail
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

  // Ingrédients
  const ingredients = (s.ingredients as Array<{
    ingredient_nom: string;
    quantite: number | null;
    unite: string | null;
    producteur_id: string | null;
    ordre: number;
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

    // Lier les producteurs mentionnés dans les ingrédients
    const producteursIds = [...new Set(
      ingredients.map((i) => i.producteur_id).filter(Boolean) as string[]
    )];
    if (producteursIds.length > 0) {
      await supabase.from("cocktail_producteurs").insert(
        producteursIds.map((pid) => ({ cocktail_id: cocktail.id, producteur_id: pid }))
      );
    }
  }

  // Étapes
  const etapes = (s.etapes as Array<{ texte: string; ordre: number }>)
    .filter((e) => e.texte?.trim());
  if (etapes.length > 0) {
    await supabase.from("cocktail_etapes").insert(
      etapes.map((e) => ({ cocktail_id: cocktail.id, texte: e.texte, ordre: e.ordre }))
    );
  }

  // Marquer la suggestion comme acceptée
  await supabase
    .from("suggestions_cocktails")
    .update({ statut: "accepte" })
    .eq("id", suggestionId);

  // Notifier uniquement les abonnés qui ont activé les notifications
  const { data: followers } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", s.utilisateur_id)
    .eq("notif_active", true);

  if (followers && followers.length > 0) {
    const { data: createur } = await supabase
      .from("profiles").select("pseudo").eq("id", s.utilisateur_id).single();
    const createurPseudo = createur?.pseudo ?? "Un barman";

    // Notifs in-app
    await supabase.from("notifications").insert(
      followers.map((f) => ({
        destinataire_id: f.follower_id,
        type: "nouveau_cocktail",
        message: `${createurPseudo} vient de publier un nouveau cocktail : ${s.nom}`,
        lien: `/cocktails/${cocktail.id}`,
      }))
    );

    // Emails — récupérer les adresses des abonnés
    const followerIds = followers.map((f) => f.follower_id);
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const emailsMap = Object.fromEntries(
      (usersData?.users ?? [])
        .filter((u) => followerIds.includes(u.id))
        .map((u) => [u.id, u.email ?? ""])
    );
    const { data: profilesAbonnes } = await supabase
      .from("profiles").select("id, pseudo").in("id", followerIds);
    const mapPseudos = Object.fromEntries((profilesAbonnes ?? []).map((p) => [p.id, p.pseudo]));

    await Promise.allSettled(
      followers
        .filter((f) => emailsMap[f.follower_id])
        .map((f) =>
          envoyerNotifNouveauCocktail({
            destinataireEmail: emailsMap[f.follower_id],
            destinatairePseudo: mapPseudos[f.follower_id] ?? "ami",
            createurPseudo,
            cocktailNom: s.nom,
            cocktailId: cocktail.id,
          })
        )
    );
  }

  revalidatePath("/admin/cocktails");
  revalidatePath("/cocktails");
}

export async function refuserSuggestionCocktail(suggestionId: string) {
  const { supabase } = await verifierAdmin();
  await supabase
    .from("suggestions_cocktails")
    .update({ statut: "refuse" })
    .eq("id", suggestionId);
  revalidatePath("/admin/cocktails");
}
