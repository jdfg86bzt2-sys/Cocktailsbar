import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TECHNIQUES } from "@/lib/types";
import { BadgeSignature } from "@/components/ui/badge-signature";
import { BoutonRecreation } from "@/components/ui/bouton-recreation";
import { toggleSignatureAction } from "@/app/cocktails/actions";

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
    { count: nbRecreations },
    { data: liensProducteurs },
  ] = await Promise.all([
    supabase.from("cocktail_ingredients").select("ingredient_nom, quantite, unite").eq("cocktail_id", id).order("ordre"),
    supabase.from("cocktail_etapes").select("texte, ordre").eq("cocktail_id", id).order("ordre"),
    supabase.from("twists").select("id, nom, description, created_at, profiles(pseudo)").eq("cocktail_origine_id", id).order("created_at", { ascending: false }),
    supabase.from("recreations").select("*", { count: "exact", head: true }).eq("cocktail_id", id),
    supabase.from("cocktail_producteurs").select("producteurs(id, nom, type)").eq("cocktail_id", id),
  ]);

  // Vérifie si l'utilisateur connecté a déjà déclaré une recréation
  let dejaRecrée = false;
  if (user) {
    const { data: maRec } = await supabase
      .from("recreations")
      .select("id")
      .eq("cocktail_id", id)
      .eq("user_id", user.id)
      .single();
    dejaRecrée = !!maRec;
  }

  const createur = cocktail.profiles as unknown as { id: string; pseudo: string } | null;
  const tags = (cocktail.tags_gout ?? []) as string[];
  const estLeCreateur = user?.id === createur?.id;
  const datePublication = new Date(cocktail.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* En-tête avec badge signature si applicable */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
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
            {cocktail.type_verre && (<><span>·</span><span>🥃 {cocktail.type_verre}</span></>)}
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

          {/* Horodatage "premier à publier" pour les signatures */}
          {cocktail.est_signature && (
            <p className="mt-1 text-xs text-foreground/50">
              Première publication : {datePublication}
            </p>
          )}
        </div>

        {/* Badge signature */}
        {cocktail.est_signature && (
          <div className="shrink-0">
            <BadgeSignature taille="lg" />
          </div>
        )}
      </div>

      {/* Profil de goût */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Compteur de recréations + bouton */}
      <div className="mt-6">
        <BoutonRecreation
          cocktailId={id}
          dejaRecrée={dejaRecrée}
          nbRecreations={nbRecreations ?? 0}
          userId={user?.id ?? null}
        />
      </div>

      {/* Bouton "marquer comme signature" — réservé au créateur barman */}
      {estLeCreateur && (
        <form action={toggleSignatureAction.bind(null, id)} className="mt-3">
          <button
            type="submit"
            className={`text-sm underline ${cocktail.est_signature ? "text-accent" : "text-foreground/50 hover:text-accent"}`}
          >
            {cocktail.est_signature
              ? "✓ Marqué comme création signature — retirer"
              : "Marquer comme ma création signature"}
          </button>
        </form>
      )}

      {/* L'inspiration */}
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

      {/* Producteurs utilisés */}
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
      <div className="mt-4 flex flex-col gap-3">
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
