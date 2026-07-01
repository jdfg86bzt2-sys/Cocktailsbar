import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES_ALCOOL, TAGS_GOUT, TECHNIQUES } from "@/lib/types";
import { BadgeSignature } from "@/components/ui/badge-signature";

type Filtres = {
  q?: string;
  alcool?: string;
  technique?: string;
  tag?: string;
  signature?: string;
};

export default async function CocktailsPage({
  searchParams,
}: {
  searchParams: Promise<Filtres>;
}) {
  const filtres = await searchParams;
  const supabase = await createClient();

  let requete = supabase
    .from("cocktails")
    .select("id, nom, categorie_alcool, technique, photo_url, est_signature, tags_gout, profiles(pseudo)")
    .order("created_at", { ascending: false });

  if (filtres.alcool) requete = requete.eq("categorie_alcool", filtres.alcool);
  if (filtres.technique) requete = requete.eq("technique", filtres.technique);
  if (filtres.signature === "1") requete = requete.eq("est_signature", true);
  if (filtres.tag) requete = requete.contains("tags_gout", [filtres.tag]);

  if (filtres.q) {
    const { data: matchsIngredients } = await supabase
      .from("cocktail_ingredients")
      .select("cocktail_id")
      .ilike("ingredient_nom", `%${filtres.q}%`);
    const idsIngredients = [...new Set((matchsIngredients ?? []).map((m) => m.cocktail_id))];

    const orClause = `nom.ilike.%${filtres.q}%${idsIngredients.length > 0 ? `,id.in.(${idsIngredients.join(",")})` : ""}`;
    requete = requete.or(orClause);
  }

  const { data: cocktails } = await requete;

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    : { data: null };
  const estAdmin = profile?.is_admin === true;

  const nbSignatures = cocktails?.filter((c) => c.est_signature).length ?? 0;
  const filtreActif = !!(filtres.q || filtres.alcool || filtres.technique || filtres.tag || filtres.signature);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-accent">Cocktails</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {cocktails?.length ?? 0} recette{(cocktails?.length ?? 0) !== 1 ? "s" : ""}
            {nbSignatures > 0 && <> · <span className="text-accent">{nbSignatures} signature{nbSignatures !== 1 ? "s" : ""}</span></>}
          </p>
        </div>
        <div className="flex gap-2">
          {estAdmin && (
            <Link href="/admin/cocktails" className="rounded-md border border-border px-3 py-2 text-sm hover:border-accent">
              Propositions
            </Link>
          )}
          <Link
            href={user ? (estAdmin ? "/cocktails/nouveau" : "/cocktails/proposer") : "/connexion"}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Proposer
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <form className="mt-6 space-y-3" method="get">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={filtres.q}
            placeholder="Rechercher un cocktail ou un ingrédient…"
            className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-accent px-4 py-2.5 font-semibold text-white hover:opacity-90">
            Chercher
          </button>
        </div>

        {/* Filtres chips alcool */}
        <div className="flex flex-wrap gap-2">
          <a href={buildUrl(filtres, { alcool: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!filtres.alcool ? "border-accent bg-accent text-white" : "border-border hover:border-accent"}`}>
            Tous
          </a>
          {CATEGORIES_ALCOOL.map((c) => (
            <a key={c} href={buildUrl(filtres, { alcool: filtres.alcool === c ? undefined : c })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filtres.alcool === c ? "border-accent bg-accent text-white" : "border-border hover:border-accent"}`}>
              {c}
            </a>
          ))}
        </div>

        {/* Filtres secondaires */}
        <div className="flex flex-wrap gap-2">
          {/* Tags goût */}
          {TAGS_GOUT.map((t) => (
            <a key={t} href={buildUrl(filtres, { tag: filtres.tag === t ? undefined : t })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${filtres.tag === t ? "border-accent bg-accent/20 text-accent" : "border-border text-foreground/60 hover:border-accent"}`}>
              {t}
            </a>
          ))}

          {/* Techniques */}
          {TECHNIQUES.map((t) => (
            <a key={t.value} href={buildUrl(filtres, { technique: filtres.technique === t.value ? undefined : t.value })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${filtres.technique === t.value ? "border-accent bg-accent/20 text-accent" : "border-border text-foreground/60 hover:border-accent"}`}>
              {t.label}
            </a>
          ))}

          {/* Signature */}
          <a href={buildUrl(filtres, { signature: filtres.signature === "1" ? undefined : "1" })}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${filtres.signature === "1" ? "border-accent bg-accent text-white" : "border-border text-foreground/60 hover:border-accent"}`}>
            ✦ Signatures seulement
          </a>
        </div>

        {filtreActif && (
          <a href="/cocktails" className="inline-block text-xs text-foreground/40 hover:text-accent">
            ✕ Effacer les filtres
          </a>
        )}
      </form>

      {/* Résultats */}
      {(!cocktails || cocktails.length === 0) && (
        <div className="mt-20 text-center">
          <p className="text-foreground/50">Aucun cocktail ne correspond.</p>
          {filtreActif && (
            <a href="/cocktails" className="mt-2 inline-block text-sm text-accent hover:underline">Voir tous les cocktails →</a>
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cocktails?.map((c) => {
          const createur = c.profiles as unknown as { pseudo: string } | null;
          const techniqueLabel = TECHNIQUES.find((t) => t.value === c.technique)?.label;
          return (
            <Link key={c.id} href={`/cocktails/${c.id}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-surface border border-border hover:border-accent transition-colors">
              {c.photo_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
                    <span className="text-3xl">🍹</span>
                    <span className="text-xs font-medium text-foreground/60">{c.nom}</span>
                  </div>
                )
              }
              {c.est_signature && (
                <div className="absolute right-2 top-2">
                  <BadgeSignature taille="xs" />
                </div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="font-semibold text-white text-sm leading-tight line-clamp-2">{c.nom}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{techniqueLabel} · {createur?.pseudo}</p>
              </div>
              {/* Nom toujours visible en bas pour les sans-photo */}
              {!c.photo_url && null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function buildUrl(current: Filtres, overrides: Partial<Record<keyof Filtres, string | undefined>>) {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v); });
  const qs = params.toString();
  return `/cocktails${qs ? `?${qs}` : ""}`;
}
