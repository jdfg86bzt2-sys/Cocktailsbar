"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function mettreAJourPhotoProducteur(producteurId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return;

  const fichier = formData.get("photo") as File;
  if (!fichier || fichier.size === 0) return;

  const ext = fichier.name.split(".").pop();
  const chemin = `producteurs/${producteurId}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("public-images")
    .upload(chemin, fichier, { upsert: true });

  if (uploadErr) return;

  const { data } = supabase.storage.from("public-images").getPublicUrl(chemin);
  const photoUrl = `${data.publicUrl}?t=${Date.now()}`;

  await supabase.from("producteurs").update({ photo_url: photoUrl }).eq("id", producteurId);

  revalidatePath(`/producteurs/${producteurId}`);
}
