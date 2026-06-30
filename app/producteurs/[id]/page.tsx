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
    .select("id, nom, description, type, region, pays, site_web, photo_url, created_at, profiles(pseudo)")
    .eq("id", id)
    .single();

  if (!producteur) notFound();

  // Cocktails qui utilisent ce producteur
  const { data: liens } = await supabase
    .from("cocktail_producteurs")
    .select("cocktails(id, nom, categorie_alcool, photo_url, profiles(pseudo))")
    .eq("producteur_id", id);

  const cocktails = (liens ?? []).map((l) => l.cocktails).filter(Boolean);
  const typeLabel = TYPES_PRODUCTEUR.find((t) => t.value === producteur.type)?.label;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {producteur.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={producteur.photo_url} alt={producteur.nom}
          className="mb-6 h-56 w-full rounded-lg object-cover" />
      )}

      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1">
          <h1 className="font-display text-4xl text-accent">{producteur.nom}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-foreground/60">
            <span className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
              {typeLabel}
            </span>
            {producteur.region && (
              <span>📍 {producteur.region}{producteur.pays && producteur.pays !== "France" ? `, ${producteur.pays}` : ""}</span>
            )}
          </div>
        </div>
        {producteur.site_web && (
          <a
            href={producteur.site_web}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            Site web ↗
          </a>
        )}
      </div>

      {producteur.description && (
        <p className="mt-6 text-foreground/80">{producteur.description}</p>
      )}

      {/* Cocktails qui utilisent ce producteur */}
      <div className="mt-10">
        <h2 className="font-display text-2xl text-accent">
          Utilisé dans {cocktails.length} cocktail{cocktails.length !== 1 ? "s" : ""}
        </h2>

        {cocktails.length === 0 && (
          <p className="mt-3 text-sm text-foreground/50">
            Aucun cocktail n&apos;a encore référencé ce producteur.
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cocktails.map((c) => {
            if (!c) return null;
            const co = c as unknown as { id: string; nom: string; categorie_alcool: string; photo_url: string | null; profiles: { pseudo: string } | null };
            return (
              <Link key={co.id} href={`/cocktails/${co.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 hover:border-accent">
                {co.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={co.photo_url} alt={co.nom}
                    className="h-14 w-14 rounded object-cover" />
                )}
                <div>
                  <p className="font-semibold">{co.nom}</p>
                  <p className="text-xs text-foreground/50">
                    {co.categorie_alcool} · par {co.profiles?.pseudo}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-xs text-foreground/40">
        Référencé le {new Date(producteur.created_at).toLocaleDateString("fr-FR")} par{" "}
        {(producteur.profiles as unknown as { pseudo: string } | null)?.pseudo}
      </p>
    </div>
  );
}
