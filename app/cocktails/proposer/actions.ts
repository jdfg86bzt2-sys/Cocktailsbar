"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function uploaderPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fichier: File | null
): Promise<string | null> {
  if (!fichier || fichier.size === 0) return null;
  const extension = fichier.name.split(".").pop();
  const chemin = `suggestions/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("public-images").upload(chemin, fichier);
  if (error) return null;
  const { data } = supabase.storage.from("public-images").getPublicUrl(chemin);
  return data.publicUrl;
}

export async function proposerCocktailAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const photoUrl = await uploaderPhoto(supabase, formData.get("photo") as File);

  // Lire les ingrédients
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

  // Lire les étapes
  const etapesRaw = formData.getAll("etape[]") as string[];
  const etapes = etapesRaw
    .map((texte, i) => ({ texte: texte.trim(), ordre: i }))
    .filter((e) => e.texte.length > 0);

  const tagsGout = formData.getAll("tags_gout[]") as string[];

  const { error } = await supabase.from("suggestions_cocktails").insert({
    utilisateur_id: user.id,
    nom: formData.get("nom") as string,
    description: (formData.get("description") as string) || null,
    categorie_alcool: (formData.get("categorie_alcool") as string) || null,
    technique: (formData.get("technique") as string) || null,
    type_verre: (formData.get("type_verre") as string) || null,
    tags_gout: tagsGout,
    demande_signature: formData.get("demande_signature") === "on",
    photo_url: photoUrl,
    ingredients,
    etapes,
  });

  if (error) {
    redirect(`/cocktails/proposer?erreur=${encodeURIComponent(error.message)}`);
  }

  redirect("/cocktails/proposer?succes=1");
}
