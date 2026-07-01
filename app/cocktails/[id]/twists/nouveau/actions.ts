"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function uploaderPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fichier: File | null
): Promise<string | null> {
  if (!fichier || fichier.size === 0) return null;
  const extension = fichier.name.split(".").pop();
  const chemin = `suggestions-twists/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("public-images").upload(chemin, fichier);
  if (error) return null;
  const { data } = supabase.storage.from("public-images").getPublicUrl(chemin);
  return data.publicUrl;
}

export async function proposerTwistAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const cocktailOrigineId = formData.get("cocktail_origine_id") as string;
  const photoUrl = await uploaderPhoto(supabase, formData.get("photo") as File);

  const noms = formData.getAll("ingredient_nom[]") as string[];
  const quantites = formData.getAll("quantite[]") as string[];
  const unites = formData.getAll("unite[]") as string[];
  const producteursIds = formData.getAll("producteur_ingredient_id[]") as string[];

  const ingredients = noms
    .map((nom, i) => ({
      ingredient_nom: nom.trim(),
      quantite: quantites[i] ? Number(quantites[i]) : null,
      unite: unites[i]?.trim() || null,
      producteur_id: producteursIds[i] || null,
      ordre: i,
    }))
    .filter((l) => l.ingredient_nom.length > 0);

  const etapesRaw = formData.getAll("etape[]") as string[];
  const etapes = etapesRaw
    .map((texte, i) => ({ texte: texte.trim(), ordre: i }))
    .filter((e) => e.texte.length > 0);

  const { error } = await supabase.from("suggestions_twists").insert({
    utilisateur_id: user.id,
    cocktail_origine_id: cocktailOrigineId,
    nom: (formData.get("nom") as string).trim(),
    description: (formData.get("description") as string) || null,
    technique: (formData.get("technique") as string) || null,
    photo_url: photoUrl,
    ingredients,
    etapes,
  });

  if (error) {
    redirect(`/cocktails/${cocktailOrigineId}/twists/nouveau?erreur=${encodeURIComponent(error.message)}`);
  }

  redirect(`/cocktails/${cocktailOrigineId}/twists/nouveau?succes=1`);
}
