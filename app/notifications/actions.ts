"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function marquerToutLu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  await supabase
    .from("notifications")
    .update({ lu: true })
    .eq("destinataire_id", user.id)
    .eq("lu", false);

  revalidatePath("/notifications");
}
