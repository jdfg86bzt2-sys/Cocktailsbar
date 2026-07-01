"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function suggererProducteurAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { error } = await supabase.from("suggestions_producteurs").insert({
    utilisateur_id: user.id,
    nom: formData.get("nom") as string,
    site_web: (formData.get("site_web") as string) || null,
    message: (formData.get("message") as string) || null,
  });

  if (error) {
    redirect(`/producteurs/suggerer?erreur=${encodeURIComponent(error.message)}`);
  }

  redirect("/producteurs/suggerer?succes=1");
}
