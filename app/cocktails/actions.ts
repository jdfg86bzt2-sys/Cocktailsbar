"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Upload une photo dans le bucket public-images et renvoie son URL publique
async function uploaderPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fichier: File | null,
  dossier: string
): Promise<string | null> {
  if (!fichier || fichier.size === 0) return null;

  const extension = fichier.name.split(".").pop();
  const chemin = `${dossier}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("public-images")
    .upload(chemin, fichier);

  if (error) throw new Error(`Échec de l'upload de l'image : ${error.message}`);

  const { data } = supabase.storage.from("public-images").getPublicUrl(chemin);
  return data.publicUrl;
}

// Lit les lignes d'ingrédients envoyées par le formulaire dynamique
// (champs nommés ingredient_nom[], quantite[], unite[])
function lireIngredients(formData: FormData) {
  const noms = formData.getAll("ingredient_nom[]") as string[];
  const quantites = formData.getAll("quantite[]") as string[];
  const unites = formData.getAll("unite[]") as string[];

  return noms
    .map((nom, i) => ({
      ingredient_nom: nom.trim(),
      quantite: quantites[i] ? Number(quantites[i]) : null,
      unite: unites[i]?.trim() || null,
      ordre: i,
    }))
    .filter((ligne) => ligne.ingredient_nom.length > 0);
}

export async function creerCocktailAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const photoUrl = await uploaderPhoto(
    supabase,
    formData.get("photo") as File,
    "cocktails"
  );

  const { data: cocktail, error } = await supabase
    .from("cocktails")
    .insert({
      createur_id: user.id,
      nom: formData.get("nom") as string,
      description: (formData.get("description") as string) || null,
      categorie_alcool: formData.get("categorie_alcool") as string,
      technique: formData.get("technique") as string,
      photo_url: photoUrl,
    })
    .select("id")
    .single();

  if (error || !cocktail) {
    redirect(
      `/cocktails/nouveau?erreur=${encodeURIComponent(
        error?.message ?? "Erreur inconnue"
      )}`
    );
  }

  const ingredients = lireIngredients(formData);
  if (ingredients.length > 0) {
    await supabase
      .from("cocktail_ingredients")
      .insert(ingredients.map((i) => ({ ...i, cocktail_id: cocktail.id })));
  }

  redirect(`/cocktails/${cocktail.id}`);
}

export async function creerTwistAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const cocktailOrigineId = formData.get("cocktail_origine_id") as string;

  const photoUrl = await uploaderPhoto(
    supabase,
    formData.get("photo") as File,
    "twists"
  );

  const { data: twist, error } = await supabase
    .from("twists")
    .insert({
      cocktail_origine_id: cocktailOrigineId,
      createur_id: user.id,
      nom: formData.get("nom") as string,
      description: (formData.get("description") as string) || null,
      technique: formData.get("technique") as string,
      photo_url: photoUrl,
    })
    .select("id")
    .single();

  if (error || !twist) {
    redirect(
      `/cocktails/${cocktailOrigineId}/twists/nouveau?erreur=${encodeURIComponent(
        error?.message ?? "Erreur inconnue"
      )}`
    );
  }

  const ingredients = lireIngredients(formData);
  if (ingredients.length > 0) {
    await supabase
      .from("twist_ingredients")
      .insert(ingredients.map((i) => ({ ...i, twist_id: twist.id })));
  }

  redirect(`/cocktails/${cocktailOrigineId}`);
}
