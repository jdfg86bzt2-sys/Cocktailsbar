import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("pseudo, role, bio, avatar_url, created_at")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  const estBarman = profile.role === "barman";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface text-2xl font-bold text-accent">
          {profile.pseudo.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl text-accent">{profile.pseudo}</h1>
          <span
            className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
              estBarman
                ? "bg-accent/20 text-accent"
                : "bg-surface text-foreground/70"
            }`}
          >
            {estBarman ? "Barman / Créateur" : "Amateur"}
          </span>
        </div>
      </div>

      {profile.bio && <p className="mt-6 text-foreground/90">{profile.bio}</p>}

      <p className="mt-6 text-sm text-foreground/50">
        Membre depuis le{" "}
        {new Date(profile.created_at).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}
