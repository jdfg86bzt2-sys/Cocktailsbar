import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TECHNIQUES } from "@/lib/types";

export default async function CocktailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cocktail } = await supabase
    .from("cocktails")
    .select("id, nom, description, categorie_alcool, technique, type_verre, tags_gout, photo_url, created_at, profiles(id, pseudo)")
    .eq("id", id)
    .single();

  if (!cocktail) notFound();

  const [{ data: ingredients }, { data: etapes }, { data: twists }] = await Promise.all([
    supabase.from("cocktail_ingredients")
      .select("ingredient_nom, quantite, unite")
      .eq("cocktail_id", id).order("ordre"),
    supabase.from("cocktail_etapes")
      .select("texte, ordre")
      .eq("cocktail_id", id).order("ordre"),
    supabase.from("twists")
      .select("id, nom, description, created_at, profiles(pseudo)")
      .eq("cocktail_origine_id", id).order("created_at", { ascending: false }),
  ]);

  const createur = cocktail.profiles as unknown as { id: string; pseudo: string } | null;
  const tags = (cocktail.tags_gout ?? []) as string[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {cocktail.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cocktail.photo_url} alt={cocktail.nom}
          className="mb-6 h-64 w-full rounded-lg object-cover" />
      )}

      <h1 className="font-display text-4xl text-accent">{cocktail.nom}</h1>
      <div className="mt-2 flex flex-wrap gap-2 text-sm text-foreground/60">
        <span>{cocktail.categorie_alcool}</span>
        <span>·</span>
        <span>{TECHNIQUES.find((t) => t.value === cocktail.technique)?.label}</span>
        {cocktail.type_verre && (
          <>
            <span>·</span>
            <span>🥃 {cocktail.type_verre}</span>
          </>
        )}
        <span>·</span>
        <span>
          par{" "}
          {createur && (
            <Link href={`/profil/${createur.id}`} className="text-accent hover:underline">
              {createur.pseudo}
            </Link>
          )}
        </span>
      </div>

      {/* Profil de goût */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag}
              className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* L'inspiration */}
      {cocktail.description && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">L&apos;inspiration</h2>
          <p className="mt-1 text-foreground/80">{cocktail.description}</p>
        </div>
      )}

      {/* Ingrédients */}
      <h2 className="mt-8 text-xl font-semibold">Ingrédients</h2>
      <ul className="mt-2 space-y-1">
        {ingredients?.map((ing, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              {ing.quantite ? `${ing.quantite}${ing.unite ?? ""} ` : ""}
              {ing.ingredient_nom}
            </span>
          </li>
        ))}
      </ul>

      {/* Étapes */}
      {etapes && etapes.length > 0 && (
        <>
          <h2 className="mt-8 text-xl font-semibold">Préparation</h2>
          <ol className="mt-2 space-y-3">
            {etapes.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-foreground/90">{e.texte}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {/* Twists */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Twists ({twists?.length ?? 0})</h2>
        <Link href={`/cocktails/${id}/twists/nouveau`}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:border-accent">
          + Proposer un twist
        </Link>
      </div>

      {(!twists || twists.length === 0) && (
        <p className="mt-3 text-sm text-foreground/60">
          Aucun twist publié. Sois le premier à en proposer un.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {twists?.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-surface p-4">
            <h3 className="font-semibold">{t.nom}</h3>
            {t.description && (
              <p className="mt-1 text-sm text-foreground/70">{t.description}</p>
            )}
            <p className="mt-1 text-xs text-foreground/50">
              twist par {(t.profiles as unknown as { pseudo: string } | null)?.pseudo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
