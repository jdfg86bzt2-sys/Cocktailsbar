"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function enregistrerRecreation(
  cocktailId: string,
  formData: FormData
): Promise<{ ok: boolean; erreur?: string; photoUrl?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const fichier = formData.get("photo") as File | null;
  const note = (formData.get("note") as string) || null;

  let photoUrl: string | null = null;

  if (fichier && fichier.size > 0) {
    const ext = fichier.name.split(".").pop();
    const chemin = `recreations/${user.id}_${cocktailId}.${ext}`;

    const admin = createAdminClient();
    const { error: uploadErr } = await admin.storage
      .from("public-images")
      .upload(chemin, fichier, { upsert: true });

    if (uploadErr) {
      return { ok: false, erreur: `Upload échoué: ${uploadErr.message}` };
    }

    const { data } = admin.storage.from("public-images").getPublicUrl(chemin);
    photoUrl = data.publicUrl;
  }

  const { data: existante } = await supabase
    .from("recreations")
    .select("id, photo_url")
    .eq("cocktail_id", cocktailId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existante) {
    const { error } = await supabase
      .from("recreations")
      .update({ note, photo_url: photoUrl ?? existante.photo_url })
      .eq("id", existante.id);
    if (error) return { ok: false, erreur: `DB update: ${error.message}` };
  } else {
    const { error } = await supabase
      .from("recreations")
      .insert({ cocktail_id: cocktailId, user_id: user.id, note, photo_url: photoUrl });
    if (error) return { ok: false, erreur: `DB insert: ${error.message}` };
  }

  revalidatePath(`/cocktails/${cocktailId}`);
  return { ok: true, photoUrl: photoUrl ?? undefined };
}

export async function supprimerRecreation(cocktailId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("recreations")
    .delete()
    .eq("cocktail_id", cocktailId)
    .eq("user_id", user.id);

  revalidatePath(`/cocktails/${cocktailId}`);
}
