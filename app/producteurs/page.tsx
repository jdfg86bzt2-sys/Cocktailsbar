import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TYPES_PRODUCTEUR } from "@/lib/types";

export default async function ProducteursPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; region?: string; q?: string }>;
}) {
  const { type, region, q } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    : { data: null };
  const estAdmin = profile?.is_admin === true;

  let requete = supabase
    .from("producteurs")
    .select("id, nom, description, type, type_produit, region, pays, photo_url")
    .order("nom", { ascending: true });

  if (type) requete = requete.eq("type", type);
  if (region) requete = requete.ilike("region", `%${region}%`);
  if (q) requete = requete.ilike("nom", `%${q}%`);

  const { data: producteurs } = await requete;

  // Régions disponibles pour les chips
  const { data: tousLesProducteurs } = await supabase
    .from("producteurs").select("region").not("region", "is", null);
  const regions = [...new Set((tousLesProducteurs ?? []).map((p) => p.region).filter(Boolean))].sort() as string[];

  const filtreActif = !!(type || region || q);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-accent">Producteurs</h1>
          <p className="mt-1 text-sm text-foreground/50">
            Distilleries, vignerons et artisans qui font vivre nos cocktails · {producteurs?.length ?? 0} référencé{(producteurs?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {estAdmin && (
            <Link href="/admin/suggestions" className="rounded-md border border-border px-3 py-2 text-sm hover:border-accent">
              Suggestions
            </Link>
          )}
          <Link
            href={user ? (estAdmin ? "/producteurs/nouveau" : "/producteurs/suggerer") : "/connexion"}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Suggérer
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <form className="mt-6 space-y-3" method="get">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher un producteur…"
            className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Chercher
          </button>
        </div>

        {/* Types */}
        <div className="flex flex-wrap gap-2">
          <a href={buildUrl({ type, region, q }, { type: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!type ? "border-accent bg-accent text-white" : "border-border hover:border-accent"}`}>
            Tous
          </a>
          {TYPES_PRODUCTEUR.map((t) => (
            <a key={t.value} href={buildUrl({ type, region, q }, { type: type === t.value ? undefined : t.value })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${type === t.value ? "border-accent bg-accent text-white" : "border-border hover:border-accent"}`}>
              {t.label}
            </a>
          ))}
        </div>

        {/* Régions */}
        {regions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-xs text-foreground/40">Région :</span>
            {regions.map((r) => (
              <a key={r} href={buildUrl({ type, region, q }, { region: region === r ? undefined : r })}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${region === r ? "border-accent bg-accent/20 text-accent" : "border-border text-foreground/60 hover:border-accent"}`}>
                📍 {r}
              </a>
            ))}
          </div>
        )}

        {filtreActif && (
          <a href="/producteurs" className="inline-block text-xs text-foreground/40 hover:text-accent">
            ✕ Effacer les filtres
          </a>
        )}
      </form>

      {/* Résultats */}
      {(!producteurs || producteurs.length === 0) && (
        <div className="mt-20 text-center">
          <p className="text-foreground/50">Aucun producteur trouvé.</p>
          {filtreActif
            ? <a href="/producteurs" className="mt-2 inline-block text-sm text-accent hover:underline">Voir tous →</a>
            : <p className="mt-2 text-sm text-foreground/40">Suggère le premier !</p>
          }
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {producteurs?.map((p) => {
          const typeLabel = TYPES_PRODUCTEUR.find((t) => t.value === p.type)?.label;
          return (
            <Link key={p.id} href={`/producteurs/${p.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface hover:border-accent transition-colors">
              {/* Photo ou placeholder avec initiale */}
              <div className="relative h-40 w-full overflow-hidden bg-accent/5">
                {p.photo_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.photo_url} alt={p.nom} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-6xl font-bold text-accent/20">{p.nom.charAt(0)}</span>
                    </div>
                  )
                }
                {typeLabel && (
                  <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    {typeLabel}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-semibold">{p.nom}</h2>
                {(p.region || p.pays) && (
                  <p className="mt-0.5 text-xs text-foreground/50">
                    📍 {[p.region, p.pays && p.pays !== "France" ? p.pays : null].filter(Boolean).join(", ")}
                  </p>
                )}
                {p.type_produit && (
                  <p className="mt-1 text-xs text-accent">{p.type_produit}</p>
                )}
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/60">{p.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function buildUrl(current: { type?: string; region?: string; q?: string }, overrides: Partial<typeof current>) {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v); });
  const qs = params.toString();
  return `/producteurs${qs ? `?${qs}` : ""}`;
}
