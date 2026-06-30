import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TYPES_PRODUCTEUR } from "@/lib/types";

export default async function ProducteursPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; region?: string }>;
}) {
  const { type, region } = await searchParams;
  const supabase = await createClient();

  let requete = supabase
    .from("producteurs")
    .select("id, nom, description, type, region, pays, photo_url")
    .order("created_at", { ascending: false });

  if (type) requete = requete.eq("type", type);
  if (region) requete = requete.ilike("region", `%${region}%`);

  const { data: producteurs } = await requete;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-accent">Petits Producteurs</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Distilleries, vignerons et artisans qui font vivre nos cocktails.
          </p>
        </div>
        <Link
          href="/producteurs/nouveau"
          className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground hover:opacity-90"
        >
          + Référencer un producteur
        </Link>
      </div>

      {/* Filtres */}
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <select
          name="type"
          defaultValue={type ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
        >
          <option value="">Tous les types</option>
          {TYPES_PRODUCTEUR.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          name="region"
          defaultValue={region}
          placeholder="Région (ex: Bretagne)"
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
        />
        <button type="submit"
          className="rounded-md border border-border px-4 py-2 font-semibold hover:border-accent">
          Filtrer
        </button>
      </form>

      {(!producteurs || producteurs.length === 0) && (
        <div className="mt-16 text-center">
          <p className="text-foreground/50">Aucun producteur référencé pour l&apos;instant.</p>
          <p className="mt-2 text-sm text-foreground/40">
            Les barmans peuvent référencer les producteurs dont ils utilisent les produits.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {producteurs?.map((p) => (
          <Link
            key={p.id}
            href={`/producteurs/${p.id}`}
            className="rounded-lg border border-border bg-surface p-5 hover:border-accent"
          >
            {p.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo_url} alt={p.nom}
                className="mb-3 h-36 w-full rounded object-cover" />
            )}
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{p.nom}</h2>
              <span className="shrink-0 rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
                {TYPES_PRODUCTEUR.find((t) => t.value === p.type)?.label}
              </span>
            </div>
            {p.region && (
              <p className="mt-1 text-xs text-foreground/50">📍 {p.region}{p.pays && p.pays !== "France" ? `, ${p.pays}` : ""}</p>
            )}
            {p.description && (
              <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{p.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
