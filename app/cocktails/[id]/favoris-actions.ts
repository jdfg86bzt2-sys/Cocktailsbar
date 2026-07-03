"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavori(cocktailId: string): Promise<{ favori: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: existant } = await supabase
    .from("favoris")
    .select("id")
    .eq("user_id", user.id)
    .eq("cocktail_id", cocktailId)
    .maybeSingle();

  if (existant) {
    await supabase.from("favoris").delete().eq("id", existant.id);
    revalidatePath(`/cocktails/${cocktailId}`);
    return { favori: false };
  } else {
    await supabase.from("favoris").insert({ user_id: user.id, cocktail_id: cocktailId });
    revalidatePath(`/cocktails/${cocktailId}`);
    return { favori: true };
  }
}
