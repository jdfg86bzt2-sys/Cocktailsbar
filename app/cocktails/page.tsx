import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TECHNIQUES } from "@/lib/types";
import { BadgeSignature } from "@/components/ui/badge-signature";
import { FiltresCocktails } from "@/components/ui/filtres-cocktails";

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
    .select("id, nom, categorie_alcool, technique, photo_url, est_signature, profiles(pseudo)")
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-accent">Cocktails</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {cocktails?.length ?? 0} recette{(cocktails?.length ?? 0) !== 1 ? "s" : ""}
            {nbSignatures > 0 && (
              <> · <span className="text-accent">{nbSignatures} signature{nbSignatures !== 1 ? "s" : ""}</span></>
            )}
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

      {/* Recherche */}
      <form className="mt-6" method="get">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={filtres.q}
            placeholder="Rechercher un cocktail ou un ingrédient…"
            className="flex-1 rounded-full border border-border bg-surface px-5 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Chercher
          </button>
        </div>
      </form>

      {/* Filtres dropdown */}
      <Suspense>
        <FiltresCocktails valeurs={filtres} />
      </Suspense>

      {/* Résultats */}
      {(!cocktails || cocktails.length === 0) && (
        <div className="mt-20 text-center">
          <p className="text-foreground/50">Aucun cocktail ne correspond.</p>
          <Link href="/cocktails" className="mt-2 inline-block text-sm text-accent hover:underline">
            Voir tous les cocktails →
          </Link>
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
