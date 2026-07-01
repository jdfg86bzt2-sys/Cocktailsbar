import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TYPES_PRODUCTEUR } from "@/lib/types";

export default async function ProducteurDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: producteur } = await supabase
    .from("producteurs")
    .select("id, nom, description, type, type_produit, region, pays, site_web, photo_url, created_at, profiles(pseudo, id)")
    .eq("id", id)
    .single();

  if (!producteur) notFound();

  // Cocktails qui utilisent ce producteur via cocktail_producteurs
  const { data: liens } = await supabase
    .from("cocktail_producteurs")
    .select("cocktails(id, nom, categorie_alcool, technique, photo_url, est_signature, profiles(pseudo, id))")
    .eq("producteur_id", id);

  // Ingrédients liés à ce producteur
  const { data: ingredientsLies } = await supabase
    .from("cocktail_ingredients")
    .select("ingredient_nom, cocktail_id")
    .eq("producteur_id", id);

  const ingredientsUniques = [...new Set((ingredientsLies ?? []).map((i) => i.ingredient_nom))];

  const cocktails = ((liens ?? []).map((l) => l.cocktails).filter(Boolean) as unknown) as Array<{
    id: string; nom: string; categorie_alcool: string; technique: string;
    photo_url: string | null; est_signature: boolean;
    profiles: { pseudo: string; id: string } | null;
  }>;

  const typeLabel = TYPES_PRODUCTEUR.find((t) => t.value === producteur.type)?.label;
  const ajoutePar = producteur.profiles as unknown as { pseudo: string; id: string } | null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-border">
        {producteur.photo_url && (
          <div className="h-56 w-full overflow-hidden sm:h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={producteur.photo_url} alt={producteur.nom} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        )}

        <div className={`px-6 py-6 ${producteur.photo_url ? "relative -mt-20" : ""}`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              {typeLabel && (
                <span className="mb-2 inline-block rounded-full bg-accent/20 px-3 py-0.5 text-xs font-semibold text-accent">
                  {typeLabel}
                </span>
              )}
              <h1 className="font-display text-4xl text-white drop-shadow sm:text-5xl">{producteur.nom}</h1>
              {(producteur.region || producteur.pays) && (
                <p className="mt-1 text-sm text-white/70">
                  📍 {[producteur.region, producteur.pays && producteur.pays !== "France" ? producteur.pays : null].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            {producteur.site_web && (
              <a href={producteur.site_web} target="_blank" rel="noopener noreferrer"
                className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20">
                Visiter le site ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-8">
          {producteur.description && (
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">À propos</h2>
              <p className="text-foreground/80 leading-relaxed">{producteur.description}</p>
            </section>
          )}

          {/* Cocktails */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Utilisé dans {cocktails.length} cocktail{cocktails.length !== 1 ? "s" : ""}
            </h2>

            {cocktails.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-foreground/50">Aucun cocktail ne référence encore ce producteur.</p>
                <Link href="/cocktails/proposer" className="mt-2 inline-block text-sm text-accent hover:underline">
                  Proposer un cocktail avec ce producteur →
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {cocktails.map((c) => (
                  <Link key={c.id} href={`/cocktails/${c.id}`}
                    className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 hover:border-accent transition-colors">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-accent/10">
                      {c.photo_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover" />
                        : <span className="flex h-full w-full items-center justify-center text-xl">🍹</span>
                      }
                      {c.est_signature && (
                        <span className="absolute right-0 top-0 rounded-bl bg-accent px-1 text-[8px] font-bold text-white">SIG</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight line-clamp-1">{c.nom}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">{c.categorie_alcool}</p>
                      {c.profiles && (
                        <p className="text-xs text-accent mt-0.5">par {c.profiles.pseudo}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Colonne droite — infos */}
        <div className="space-y-6">
          {/* Produits */}
          {(producteur.type_produit || ingredientsUniques.length > 0) && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">Produits</h3>
              {producteur.type_produit && (
                <p className="text-sm font-medium text-accent mb-2">{producteur.type_produit}</p>
              )}
              {ingredientsUniques.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ingredientsUniques.map((ing) => (
                    <span key={ing} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Localisation */}
          {(producteur.region || producteur.pays) && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">Localisation</h3>
              {producteur.region && <p className="text-sm font-medium">{producteur.region}</p>}
              {producteur.pays && <p className="text-sm text-foreground/60">{producteur.pays}</p>}
              {producteur.region && (
                <Link href={`/producteurs?region=${encodeURIComponent(producteur.region)}`}
                  className="mt-3 inline-block text-xs text-accent hover:underline">
                  Autres producteurs de cette région →
                </Link>
              )}
            </div>
          )}

          {/* Ajouté par */}
          {ajoutePar && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">Référencé par</h3>
              <Link href={`/profil/${ajoutePar.id}`} className="text-sm text-accent hover:underline">
                {ajoutePar.pseudo}
              </Link>
              <p className="text-xs text-foreground/40 mt-1">
                le {new Date(producteur.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
        </div>
      </div>

      <Link href="/producteurs" className="mt-10 inline-block text-sm text-foreground/40 hover:text-accent">
        ← Retour aux producteurs
      </Link>
    </div>
  );
}
