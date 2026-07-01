"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function uploaderImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fichier: File | null,
  dossier: string
): Promise<string | null> {
  if (!fichier || fichier.size === 0) return null;
  const ext = fichier.name.split(".").pop();
  const chemin = `${dossier}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("public-images").upload(chemin, fichier);
  if (error) return null;
  const { data } = supabase.storage.from("public-images").getPublicUrl(chemin);
  return data.publicUrl;
}

export async function modifierProfilAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const pseudo = (formData.get("pseudo") as string).trim();
  const bio = (formData.get("bio") as string).trim() || null;

  // Vérifier si le pseudo est déjà pris par quelqu'un d'autre
  if (pseudo) {
    const { data: existant } = await supabase
      .from("profiles")
      .select("id")
      .ilike("pseudo", pseudo)
      .neq("id", user.id)
      .maybeSingle();

    if (existant) {
      redirect(`/profil/modifier?erreur=${encodeURIComponent(`Le pseudo "${pseudo}" est déjà utilisé.`)}`);
    }
  }

  const [avatarUrl, bannerUrl] = await Promise.all([
    uploaderImage(supabase, formData.get("avatar") as File, "avatars"),
    uploaderImage(supabase, formData.get("banner") as File, "banners"),
  ]);

  const updates: Record<string, string | null> = { pseudo, bio };
  if (avatarUrl) updates.avatar_url = avatarUrl;
  if (bannerUrl) updates.banner_url = bannerUrl;

  await supabase.from("profiles").update(updates).eq("id", user.id);

  revalidatePath(`/profil/${user.id}`);
  redirect(`/profil/${user.id}`);
}
