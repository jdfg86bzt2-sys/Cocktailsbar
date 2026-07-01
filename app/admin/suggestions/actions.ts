"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function changerStatutSuggestion(id: string, statut: "accepte" | "refuse") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "barman") return;

  await supabase
    .from("suggestions_producteurs")
    .update({ statut })
    .eq("id", id);

  revalidatePath("/admin/suggestions");
}
