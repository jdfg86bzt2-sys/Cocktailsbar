import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publierSuggestionTwist, refuserSuggestionTwist } from "./actions";
import Link from "next/link";
import { TECHNIQUES } from "@/lib/types";

type Ingredient = { ingredient_nom: string; quantite: number | null; unite: string | null; ordre: number };
type Etape = { texte: string; ordre: number };

export default async function AdminTwistsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const { data: suggestions } = await supabase
    .from("suggestions_twists")
    .select("*, cocktails(nom)")
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
        <h1 className="font-display text-4xl text-accent">Propositions de twists</h1>
        <Link href="/admin" className="text-sm text-foreground/50 hover:text-accent">← Admin</Link>
      </div>

      {enAttente.length === 0 ? (
        <p className="text-foreground/50">Aucune proposition en attente.</p>
      ) : (
        <div className="mb-10 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">En attente ({enAttente.length})</h2>
          {enAttente.map((s) => {
            const ingredients = (s.ingredients ?? []) as Ingredient[];
            const etapes = (s.etapes ?? []) as Etape[];
            const cocktailNom = (s.cocktails as { nom: string } | null)?.nom ?? "cocktail inconnu";
            const techniqueLabel = TECHNIQUES.find((t) => t.value === s.technique)?.label ?? s.technique;

            return (
              <div key={s.id} className="rounded-lg border border-border bg-surface p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{s.nom}</h3>
                    <p className="text-xs text-foreground/50">
                      Twist de <span className="text-accent">{cocktailNom}</span> · par {mapPseudos[s.utilisateur_id] ?? "inconnu"} · {new Date(s.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {s.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photo_url} alt={s.nom} className="h-20 w-20 rounded object-cover" />
                  )}
                </div>

                {techniqueLabel && (
                  <span className="mb-3 inline-block rounded bg-border px-2 py-1 text-xs">{techniqueLabel}</span>
                )}

                {s.description && (
                  <p className="mb-3 text-sm text-foreground/70 italic">&ldquo;{s.description}&rdquo;</p>
                )}

                {ingredients.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/50">Ingrédients</p>
                    <ul className="flex flex-col gap-1">
                      {ingredients.map((ing, i) => (
                        <li key={i} className="text-sm">
                          {ing.quantite && `${ing.quantite} `}{ing.unite && `${ing.unite} `}{ing.ingredient_nom}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {etapes.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/50">Préparation</p>
                    <ol className="flex flex-col gap-1">
                      {etapes.map((e, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="font-bold text-accent">{i + 1}.</span>
                          <span className="text-foreground/80">{e.texte}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="flex gap-2 border-t border-border pt-4">
                  <form action={refuserSuggestionTwist.bind(null, s.id)}>
                    <button type="submit" className="rounded border border-border px-4 py-2 text-sm text-foreground/60 hover:border-accent hover:text-accent">
                      Refuser
                    </button>
                  </form>
                  <form action={publierSuggestionTwist.bind(null, s.id)}>
                    <button type="submit" className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/80">
                      Publier le twist
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
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
                  {s.statut === "accepte" ? "Publiée" : "Refusée"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
