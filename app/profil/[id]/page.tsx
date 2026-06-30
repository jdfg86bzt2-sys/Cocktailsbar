import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BadgeSignature } from "@/components/ui/badge-signature";

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

  if (!profile) notFound();

  const estBarman = profile.role === "barman";

  // Pour les barmans : récupère leurs créations signatures avec le nb de recréations
  let signatures: { id: string; nom: string; nb_recreations: number; created_at: string }[] = [];
  let nbTotalRecreations = 0;
  if (estBarman) {
    const { data } = await supabase
      .from("cocktails_signatures")
      .select("id, nom, nb_recreations, created_at")
      .eq("createur_id", id)
      .order("nb_recreations", { ascending: false });
    signatures = data ?? [];
    nbTotalRecreations = signatures.reduce((sum, s) => sum + s.nb_recreations, 0);
  }

  // Tous les cocktails publiés par ce barman
  let cocktails: { id: string; nom: string; est_signature: boolean }[] = [];
  if (estBarman) {
    const { data } = await supabase
      .from("cocktails")
      .select("id, nom, est_signature")
      .eq("createur_id", id)
      .order("created_at", { ascending: false });
    cocktails = data ?? [];
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* En-tête profil */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface text-2xl font-bold text-accent">
          {profile.pseudo.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-accent">{profile.pseudo}</h1>
            {estBarman && signatures.length > 0 && (
              <BadgeSignature taille="sm" />
            )}
          </div>
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
            estBarman ? "bg-accent/20 text-accent" : "bg-surface text-foreground/70"
          }`}>
            {estBarman ? "Barman / Créateur" : "Amateur"}
          </span>
        </div>
      </div>

      {profile.bio && <p className="mt-4 text-foreground/90">{profile.bio}</p>}

      {/* Score de réputation du barman */}
      {estBarman && (
        <div className="mt-8">
          <div className="flex flex-wrap gap-6 rounded-lg border border-border bg-surface p-5">
            <div className="text-center">
              <p className="font-display text-4xl text-accent">{cocktails.length}</p>
              <p className="text-xs text-foreground/60">cocktails publiés</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-accent">{signatures.length}</p>
              <p className="text-xs text-foreground/60">créations signature</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-accent">{nbTotalRecreations}</p>
              <p className="text-xs text-foreground/60">recréations totales</p>
            </div>
          </div>

          {/* Créations signatures triées par nb de recréations */}
          {signatures.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-display text-xl text-accent">Créations signature</h2>
              <div className="flex flex-col gap-3">
                {signatures.map((s) => (
                  <Link
                    key={s.id}
                    href={`/cocktails/${s.id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 hover:border-accent"
                  >
                    <div>
                      <p className="font-semibold">{s.nom}</p>
                      <p className="text-xs text-foreground/50">
                        Premier publié le{" "}
                        {new Date(s.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl text-accent">{s.nb_recreations}</p>
                      <p className="text-xs text-foreground/50">recréation{s.nb_recreations !== 1 ? "s" : ""}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Autres cocktails publiés */}
          {cocktails.filter((c) => !c.est_signature).length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-display text-xl text-foreground/60">Autres cocktails</h2>
              <div className="flex flex-col gap-2">
                {cocktails.filter((c) => !c.est_signature).map((c) => (
                  <Link key={c.id} href={`/cocktails/${c.id}`}
                    className="rounded-lg border border-border p-3 hover:border-accent">
                    {c.nom}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-8 text-sm text-foreground/50">
        Membre depuis le {new Date(profile.created_at).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}
