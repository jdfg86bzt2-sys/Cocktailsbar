import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { changerStatutSuggestion } from "./actions";
import Link from "next/link";

export default async function AdminSuggestionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const { data: suggestions } = await supabase
    .from("suggestions_producteurs")
    .select("*")
    .order("created_at", { ascending: false });

  const userIds = [...new Set((suggestions ?? []).map((s) => s.utilisateur_id))];
  const { data: profilesData } = userIds.length > 0
    ? await supabase.from("profiles").select("id, pseudo").in("id", userIds)
    : { data: [] };
  const mapPseudos = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p.pseudo]));

  const enAttente = suggestions?.filter((s) => s.statut === "en_attente") ?? [];
  const traitees = suggestions?.filter((s) => s.statut !== "en_attente") ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl text-accent">Suggestions producteurs</h1>
        <Link
          href="/producteurs/nouveau"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80"
        >
          + Créer une fiche
        </Link>
      </div>

      {enAttente.length === 0 ? (
        <p className="text-foreground/50">Aucune suggestion en attente.</p>
      ) : (
        <div className="mb-10 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">En attente ({enAttente.length})</h2>
          {enAttente.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-surface p-5">
              <div className="mb-1 flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{s.nom}</p>
                  <p className="text-xs text-foreground/50">
                    par {mapPseudos[s.utilisateur_id] ?? "inconnu"} —{" "}
                    {new Date(s.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={changerStatutSuggestion.bind(null, s.id, "refuse")}>
                    <button
                      type="submit"
                      className="rounded border border-border px-3 py-1 text-sm text-foreground/60 hover:border-accent hover:text-accent"
                    >
                      Refuser
                    </button>
                  </form>
                  <Link
                    href={`/producteurs/nouveau?nom=${encodeURIComponent(s.nom)}&site_web=${encodeURIComponent(s.site_web ?? "")}`}
                    className="rounded bg-accent px-3 py-1 text-sm text-white hover:bg-accent/80"
                  >
                    Créer la fiche
                  </Link>
                </div>
              </div>
              {s.site_web && (
                <a
                  href={s.site_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline"
                >
                  {s.site_web}
                </a>
              )}
              {s.message && (
                <p className="mt-2 text-sm text-foreground/70 italic">&ldquo;{s.message}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {traitees.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground/50">Traitées ({traitees.length})</h2>
          <div className="flex flex-col gap-2">
            {traitees.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded border border-border/40 px-4 py-3 opacity-60">
                <span className="text-sm">{s.nom}</span>
                <span className={`text-xs font-medium ${s.statut === "accepte" ? "text-green-400" : "text-foreground/40"}`}>
                  {s.statut === "accepte" ? "Acceptée" : "Refusée"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
