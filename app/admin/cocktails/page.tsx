import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publierSuggestionCocktail, refuserSuggestionCocktail } from "./actions";
import Link from "next/link";
import { TECHNIQUES, TYPES_VERRE } from "@/lib/types";

type Ingredient = {
  ingredient_nom: string;
  quantite: number | null;
  unite: string | null;
  producteur_id: string | null;
  ordre: number;
};

type Etape = { texte: string; ordre: number };

export default async function AdminCocktailsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const { data: suggestions } = await supabase
    .from("suggestions_cocktails")
    .select("*")
    .order("created_at", { ascending: false });

  // Récupérer les pseudos séparément
  const userIds = [...new Set((suggestions ?? []).map((s) => s.utilisateur_id))];
  const { data: profilesData } = userIds.length > 0
    ? await supabase.from("profiles").select("id, pseudo").in("id", userIds)
    : { data: [] };
  const mapPseudos = Object.fromEntries((profilesData ?? []).map((p) => [p.id, p.pseudo]));

  // Récupérer les noms des producteurs pour affichage
  const { data: producteurs } = await supabase.from("producteurs").select("id, nom");
  const mapProducteurs = Object.fromEntries((producteurs ?? []).map((p) => [p.id, p.nom]));

  const enAttente = suggestions?.filter((s) => s.statut === "en_attente") ?? [];
  const traitees = suggestions?.filter((s) => s.statut !== "en_attente") ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl text-accent">Propositions de cocktails</h1>
        <Link
          href="/cocktails/nouveau"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80"
        >
          + Créer directement
        </Link>
      </div>

      {enAttente.length === 0 ? (
        <p className="text-foreground/50">Aucune proposition en attente.</p>
      ) : (
        <div className="mb-10 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">En attente ({enAttente.length})</h2>
          {enAttente.map((s) => {
            const ingredients = (s.ingredients ?? []) as Ingredient[];
            const etapes = (s.etapes ?? []) as Etape[];
            const techniqueLabel = TECHNIQUES.find((t) => t.value === s.technique)?.label ?? s.technique;

            return (
              <div key={s.id} className="rounded-lg border border-border bg-surface p-5">
                {/* En-tête */}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{s.nom}</h3>
                      {s.demande_signature && (
                        <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                          DEMANDE SIGNATURE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/50">
                      par {mapPseudos[s.utilisateur_id] ?? "inconnu"},{" "}
                      {new Date(s.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {s.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photo_url} alt={s.nom} className="h-20 w-20 rounded object-cover" />
                  )}
                </div>

                {/* Méta */}
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  {s.categorie_alcool && (
                    <span className="rounded bg-border px-2 py-1">{s.categorie_alcool}</span>
                  )}
                  {techniqueLabel && (
                    <span className="rounded bg-border px-2 py-1">{techniqueLabel}</span>
                  )}
                  {s.type_verre && (
                    <span className="rounded bg-border px-2 py-1">{s.type_verre}</span>
                  )}
                  {(s.tags_gout as string[])?.map((t: string) => (
                    <span key={t} className="rounded bg-accent/10 px-2 py-1 text-accent">{t}</span>
                  ))}
                </div>

                {/* Description */}
                {s.description && (
                  <p className="mb-3 text-sm text-foreground/70 italic">&ldquo;{s.description}&rdquo;</p>
                )}

                {/* Ingrédients */}
                {ingredients.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/50">Ingrédients</p>
                    <ul className="flex flex-col gap-1">
                      {ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-foreground/80">
                            {ing.quantite && `${ing.quantite} `}{ing.unite && `${ing.unite} `}{ing.ingredient_nom}
                          </span>
                          {ing.producteur_id && mapProducteurs[ing.producteur_id] && (
                            <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
                              {mapProducteurs[ing.producteur_id]}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Étapes */}
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

                {/* Actions */}
                <div className="flex gap-2 border-t border-border pt-4">
                  <form action={refuserSuggestionCocktail.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="rounded border border-border px-4 py-2 text-sm text-foreground/60 hover:border-accent hover:text-accent"
                    >
                      Refuser
                    </button>
                  </form>
                  <form action={publierSuggestionCocktail.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/80"
                    >
                      Publier le cocktail
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
