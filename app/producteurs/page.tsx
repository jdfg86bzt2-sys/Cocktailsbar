import Link from "next/link";
import { Suspense } from "react";
import { Globe, MapPin } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { TYPES_PRODUCTEUR } from "@/lib/types";
import { FiltresProducteurs } from "@/components/ui/filtres-producteurs";

const DRAPEAUX: Record<string, string> = {
  France: "🇫🇷", "États-Unis": "🇺🇸", "USA": "🇺🇸", Mexique: "🇲🇽",
  Jamaïque: "🇯🇲", Cuba: "🇨🇺", Écosse: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Irlande: "🇮🇪",
  Japon: "🇯🇵", Italie: "🇮🇹", Espagne: "🇪🇸", "Royaume-Uni": "🇬🇧",
  Allemagne: "🇩🇪", Belgique: "🇧🇪", "Pays-Bas": "🇳🇱", Portugal: "🇵🇹",
  Brésil: "🇧🇷", Argentine: "🇦🇷", Pérou: "🇵🇪", Chili: "🇨🇱",
  Australie: "🇦🇺", "Nouvelle-Zélande": "🇳🇿", "Afrique du Sud": "🇿🇦",
  "République Dominicaine": "🇩🇴", Barbade: "🇧🇧", Haïti: "🇭🇹",
  Martinique: "🇫🇷", Guadeloupe: "🇫🇷", Réunion: "🇫🇷",
  Canada: "🇨🇦", Suède: "🇸🇪", Danemark: "🇩🇰", Finlande: "🇫🇮",
  Norvège: "🇳🇴", Suisse: "🇨🇭", Autriche: "🇦🇹", Grèce: "🇬🇷",
  Turquie: "🇹🇷", Maroc: "🇲🇦", Inde: "🇮🇳", Chine: "🇨🇳",
  Taiwan: "🇹🇼", Thaïlande: "🇹🇭", Vietnam: "🇻🇳",
};

export default async function ProducteursPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; pays?: string; q?: string }>;
}) {
  const { type, pays, q } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    : { data: null };
  const estAdmin = profile?.is_admin === true;

  let requete = supabase
    .from("producteurs")
    .select("id, nom, description, type, type_produit, region, ville, pays, photo_url")
    .order("pays", { ascending: true })
    .order("nom", { ascending: true });

  if (type) requete = requete.eq("type", type);
  if (pays) requete = requete.eq("pays", pays);
  if (q) requete = requete.ilike("nom", `%${q}%`);

  const { data: producteurs } = await requete;

  const { data: tousProducteurs } = await supabase
    .from("producteurs").select("pays").not("pays", "is", null);
  const paysDisponibles = [...new Set((tousProducteurs ?? []).map((p) => p.pays).filter(Boolean))].sort() as string[];

  // Grouper par pays (seulement si pas de filtre actif ou filtre uniquement sur pays)
  const grouped: Record<string, typeof producteurs> = {};
  for (const p of producteurs ?? []) {
    const k = p.pays ?? "Autre";
    if (!grouped[k]) grouped[k] = [];
    grouped[k]!.push(p);
  }
  const paysTries = Object.keys(grouped).sort((a, b) => {
    if (a === "France") return -1;
    if (b === "France") return 1;
    return a.localeCompare(b);
  });

  const filtreActif = !!(type || pays || q);
  const afficherGroupes = !type && !q;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-accent">Producteurs</h1>
          <p className="mt-1 text-sm text-foreground/50">
            Distilleries, vignerons et artisans du monde entier · {producteurs?.length ?? 0} référencé{(producteurs?.length ?? 0) !== 1 ? "s" : ""}
            {paysDisponibles.length > 1 && <> dans {paysDisponibles.length} pays</>}
          </p>
        </div>
        <div className="flex gap-2">
          {estAdmin && (
            <Link href="/admin/suggestions" className="rounded-lg border border-border px-3 py-2 text-sm hover:border-accent">
              Suggestions
            </Link>
          )}
          <Link
            href={user ? (estAdmin ? "/producteurs/nouveau" : "/producteurs/suggerer") : "/connexion"}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Suggérer
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <form className="mt-6" method="get">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher un producteur…"
            className="flex-1 rounded-lg border border-border bg-surface px-5 py-2.5 placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Chercher
          </button>
        </div>
      </form>

      {/* Filtres dropdowns */}
      <Suspense>
        <FiltresProducteurs valeurs={{ type, pays, q }} paysDisponibles={paysDisponibles} />
      </Suspense>

      {(!producteurs || producteurs.length === 0) && (
        <div className="mt-20 text-center">
          <Globe size={40} weight="thin" className="mx-auto mb-3 text-accent/30" />
          <p className="text-foreground/50">Aucun producteur trouvé.</p>
          {filtreActif
            ? <Link href="/producteurs" className="mt-2 inline-block text-sm text-accent hover:underline">Voir tous →</Link>
            : <p className="mt-2 text-sm text-foreground/40">Sois le premier à en suggérer un !</p>
          }
        </div>
      )}

      {(producteurs?.length ?? 0) > 0 && (
        <div className="mt-10 space-y-10">
          {afficherGroupes
            ? paysTries.map((paysNom) => (
              <section key={paysNom}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{DRAPEAUX[paysNom] ?? "🌍"}</span>
                  <h2 className="font-display text-xl">{paysNom}</h2>
                  <span className="text-xs text-foreground/40">{grouped[paysNom]?.length} producteur{(grouped[paysNom]?.length ?? 0) !== 1 ? "s" : ""}</span>
                  <div className="flex-1 border-b border-border" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[paysNom]?.map((p) => <CarteProducteur key={p.id} p={p} />)}
                </div>
              </section>
            ))
            : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {producteurs?.map((p) => <CarteProducteur key={p.id} p={p} />)}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}

function CarteProducteur({ p }: {
  p: {
    id: string; nom: string; description: string | null; type: string;
    type_produit: string | null; region: string | null; ville: string | null;
    pays: string | null; photo_url: string | null;
  }
}) {
  const typeLabel = TYPES_PRODUCTEUR.find((t) => t.value === p.type)?.label;
  const localisation = [p.ville, p.region].filter(Boolean).join(", ");

  return (
    <Link href={`/producteurs/${p.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent transition-colors">
      <div className="relative h-44 w-full overflow-hidden bg-accent/5">
        {p.photo_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={p.photo_url} alt={p.nom} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-5xl font-bold text-accent/20">{p.nom.charAt(0)}</span>
            </div>
          )
        }
        {typeLabel && (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {typeLabel}
          </span>
        )}
        {p.pays && (
          <span className="absolute left-2 top-2 text-xl" title={p.pays}>
            {DRAPEAUX[p.pays] ?? "🌍"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold leading-tight">{p.nom}</h2>
        {localisation && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/50">
            <MapPin size={12} weight="thin" />
            {localisation}
          </p>
        )}
        {p.type_produit && <p className="mt-1 text-xs text-accent">{p.type_produit}</p>}
        {p.description && <p className="mt-2 line-clamp-2 text-sm text-foreground/60">{p.description}</p>}
      </div>
    </Link>
  );
}
