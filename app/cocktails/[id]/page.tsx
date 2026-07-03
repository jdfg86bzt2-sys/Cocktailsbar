import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TECHNIQUES } from "@/lib/types";
import { BadgeSignature } from "@/components/ui/badge-signature";
import { BoutonRecreation } from "@/components/ui/bouton-recreation";

export default async function CocktailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: cocktail } = await supabase
    .from("cocktails")
    .select("id, nom, description, categorie_alcool, technique, type_verre, tags_gout, photo_url, est_signature, created_at, profiles(id, pseudo)")
    .eq("id", id)
    .single();

  if (!cocktail) notFound();

  const [
    { data: ingredients },
    { data: etapes },
    { data: twists },
    { data: recreations },
    { data: liensProducteurs },
  ] = await Promise.all([
    supabase.from("cocktail_ingredients").select("ingredient_nom, quantite, unite").eq("cocktail_id", id).order("ordre"),
    supabase.from("cocktail_etapes").select("texte, ordre").eq("cocktail_id", id).order("ordre"),
    supabase.from("twists").select("id, nom, description, created_at, profiles(pseudo)").eq("cocktail_origine_id", id).order("created_at", { ascending: false }),
    supabase.from("recreations").select("id, user_id, photo_url, note, created_at, profiles(pseudo, avatar_url)").eq("cocktail_id", id).order("created_at", { ascending: false }),
    supabase.from("cocktail_producteurs").select("producteurs(id, nom, type)").eq("cocktail_id", id),
  ]);

  const nbRecreations = recreations?.length ?? 0;

  let maRecreation: { photo_url: string | null; note: string | null } | null = null;
  if (user) {
    const found = recreations?.find((r) => r.user_id === user.id);
    if (found) maRecreation = { photo_url: found.photo_url, note: found.note };
  }
  const dejaRecrée = !!maRecreation;

  const recreationsAvecPhoto = recreations?.filter((r) => r.photo_url) ?? [];
  const recreationsSansPhoto = recreations?.filter((r) => !r.photo_url) ?? [];

  const createur = cocktail.profiles as unknown as { id: string; pseudo: string } | null;
  const tags = (cocktail.tags_gout ?? []) as string[];
  const datePublication = new Date(cocktail.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Photo hero */}
      {cocktail.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cocktail.photo_url} alt={cocktail.nom} className="mb-6 h-72 w-full rounded-2xl object-cover" />
      )}

      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="font-display text-4xl text-accent">{cocktail.nom}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-foreground/60">
            <span>{cocktail.categorie_alcool}</span>
            <span>·</span>
            <span>{TECHNIQUES.find((t) => t.value === cocktail.technique)?.label}</span>
            {cocktail.type_verre && (<><span>·</span><span>🥃 {cocktail.type_verre}</span></>)}
            <span>·</span>
            <span>
              par{" "}
              {createur && (
                <Link href={`/profil/${createur.id}`} className="text-accent hover:underline">{createur.pseudo}</Link>
              )}
            </span>
          </div>
          {cocktail.est_signature && (
            <p className="mt-1 text-xs text-foreground/50">Première publication : {datePublication}</p>
          )}
        </div>
        {cocktail.est_signature && <BadgeSignature taille="lg" />}
      </div>

      {/* Tags goût */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bouton recréation */}
      <div className="mt-6">
        <BoutonRecreation
          cocktailId={id}
          dejaRecrée={dejaRecrée}
          nbRecreations={nbRecreations}
          userId={user?.id ?? null}
          maRecreation={maRecreation}
        />
      </div>

      {/* Description */}
      {cocktail.description && (
        <div className="mt-8">
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
            <span>{ing.quantite ? `${ing.quantite}${ing.unite ?? ""} ` : ""}{ing.ingredient_nom}</span>
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

      {/* Producteurs */}
      {liensProducteurs && liensProducteurs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Produits utilisés</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {liensProducteurs.map((l) => {
              const p = l.producteurs as unknown as { id: string; nom: string; type: string } | null;
              if (!p) return null;
              return (
                <Link key={p.id} href={`/producteurs/${p.id}`}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-sm hover:border-accent">
                  {p.nom}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recréations de la communauté */}
      {nbRecreations > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            La communauté l&apos;a fait <span className="text-foreground/40 text-base font-normal">({nbRecreations})</span>
          </h2>
          <div className="flex flex-col gap-3">
            {recreations?.map((r) => {
              const profil = r.profiles as unknown as { pseudo: string; avatar_url: string | null } | null;
              return (
                <div key={r.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground/80">{profil?.pseudo}</p>
                    {r.note && <p className="mt-0.5 text-sm text-foreground/60">{r.note}</p>}
                  </div>
                  {r.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.photo_url}
                      alt={`Photo de ${profil?.pseudo}`}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
        <p className="mt-3 text-sm text-foreground/60">Aucun twist publié. Sois le premier à en proposer un.</p>
      )}
      <div className="mt-4 mb-10 flex flex-col gap-3">
        {twists?.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-surface p-4">
            <h3 className="font-semibold">{t.nom}</h3>
            {t.description && <p className="mt-1 text-sm text-foreground/70">{t.description}</p>}
            <p className="mt-1 text-xs text-foreground/50">
              twist par {(t.profiles as unknown as { pseudo: string } | null)?.pseudo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
