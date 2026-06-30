"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function creerProducteurAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const fichierPhoto = formData.get("photo") as File;
  let photoUrl: string | null = null;

  if (fichierPhoto && fichierPhoto.size > 0) {
    const ext = fichierPhoto.name.split(".").pop();
    const chemin = `producteurs/${crypto.randomUUID()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("public-images").upload(chemin, fichierPhoto);
    if (!uploadErr) {
      const { data } = supabase.storage.from("public-images").getPublicUrl(chemin);
      photoUrl = data.publicUrl;
    }
  }

  const { data: producteur, error } = await supabase
    .from("producteurs")
    .insert({
      createur_id: user.id,
      nom: formData.get("nom") as string,
      description: (formData.get("description") as string) || null,
      type: formData.get("type") as string,
      region: (formData.get("region") as string) || null,
      pays: (formData.get("pays") as string) || "France",
      site_web: (formData.get("site_web") as string) || null,
      photo_url: photoUrl,
    })
    .select("id")
    .single();

  if (error || !producteur) {
    redirect(`/producteurs/nouveau?erreur=${encodeURIComponent(error?.message ?? "Erreur inconnue")}`);
  }

  redirect(`/producteurs/${producteur.id}`);
}
