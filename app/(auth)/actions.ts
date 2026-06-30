"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Inscription : crée le compte auth + déclenche le trigger qui crée le profil
// (pseudo et role sont passés en métadonnées, lus par handle_new_user() côté DB)
export async function inscrireAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const pseudo = formData.get("pseudo") as string;
  const role = formData.get("role") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { pseudo, role },
    },
  });

  if (error) {
    redirect(`/inscription?erreur=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function connexionAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/connexion?erreur=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}
