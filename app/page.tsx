import Link from "next/link";
import { Martini, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { BadgeSignature } from "@/components/ui/badge-signature";
import { Reveal } from "@/components/ui/reveal";
import { CocktailSceneLoader } from "@/components/ui/cocktail-scene-loader";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: dernierscocktails },
    { data: cocktailsSignature },
    { data: topCreateurs },
    { data: derniersProducteurs },
    { count: nbCocktails },
    { count: nbProducteurs },
    { count: nbMembres },
    { data: tendances },
  ] = await Promise.all([
    supabase.from("cocktails").select("id, nom, photo_url, est_signature, categorie_alcool, profiles(pseudo)").order("created_at", { ascending: false }).limit(8),
    supabase.from("cocktails").select("id, nom, photo_url, categorie_alcool, profiles(pseudo, id)").eq("est_signature", true).order("created_at", { ascending: false }).limit(4),
    supabase.from("profiles").select("id, pseudo, avatar_url, role").neq("role", null).limit(5),
    supabase.from("producteurs").select("id, nom, photo_url, region, type_produit").order("created_at", { ascending: false }).limit(4),
    supabase.from("cocktails").select("*", { count: "exact", head: true }),
    supabase.from("producteurs").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("cocktails").select("id, nom, photo_url, categorie_alcool, profiles(pseudo), recreations(count)").order("created_at", { ascending: false }).limit(6),
  ]);

  const cocktailDuJour = dernierscocktails?.[Math.floor((new Date().getDate()) % (dernierscocktails?.length || 1))] ?? dernierscocktails?.[0];
  const tendancesSorted = tendances?.sort((a, b) => {
    const ra = (a.recreations as unknown as { count: number }[])?.[0]?.count ?? 0;
    const rb = (b.recreations as unknown as { count: number }[])?.[0]?.count ?? 0;
    return rb - ra;
  }).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(226,35,26,0.18),transparent)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
          <div className="grid gap-12 sm:grid-cols-2 sm:items-center">
            {/* Texte */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">La communauté du cocktail</p>
              <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
                Barre de<br /><span className="text-accent">Cocktails</span>
              </h1>
              <p className="mt-5 text-base text-foreground/60 leading-relaxed">
                La référence des barmans passionnés. Explorez des centaines de recettes, partagez vos créations et découvrez les meilleurs producteurs.
              </p>

              {!user ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/inscription" className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity">
                    Rejoindre gratuitement
                  </Link>
                  <Link href="/cocktails" className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground/70 hover:border-accent hover:text-foreground transition-colors">
                    Explorer les recettes
                  </Link>
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/cocktails/proposer" className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity">
                    Proposer une recette
                  </Link>
                  <Link href="/cocktails" className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground/70 hover:border-accent hover:text-foreground transition-colors">
                    Explorer
                  </Link>
                </div>
              )}

              {/* Stats */}
              <div className="mt-10 flex gap-8">
                <div>
                  <p className="font-display text-2xl text-accent">{nbCocktails ?? 0}</p>
                  <p className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5">Recettes</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display text-2xl text-accent">{nbProducteurs ?? 0}</p>
                  <p className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5">Producteurs</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display text-2xl text-accent">{nbMembres ?? 0}</p>
                  <p className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5">Membres</p>
                </div>
              </div>
            </div>

            {/* Verre 3D */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
              <div className="absolute inset-0">
                <CocktailSceneLoader accent="#e2231a" />
              </div>
              {cocktailDuJour && (
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-transparent to-transparent p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Cocktail du jour</p>
                  <p className="font-display text-2xl text-white leading-tight">{cocktailDuJour.nom}</p>
                  <p className="text-sm text-white/60 mt-1">{cocktailDuJour.categorie_alcool}</p>
                  <Link href={`/cocktails/${cocktailDuJour.id}`} className="pointer-events-auto mt-3 inline-flex w-fit items-center gap-1 text-sm font-semibold text-accent hover:underline">
                    Voir la recette <CaretRight size={14} weight="bold" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll horizontal : dernières recettes */}
      {(dernierscocktails?.length ?? 0) > 0 && (
        <Reveal as="section" className="border-b border-border py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl">Nouvelles recettes</h2>
              <Link href="/cocktails" className="text-sm text-accent hover:underline">Tout voir →</Link>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-3 sm:px-[calc((100vw-1024px)/2+16px)] scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {dernierscocktails?.map((c) => {
              const createur = c.profiles as unknown as { pseudo: string } | null;
              return (
                <Link
                  key={c.id}
                  href={`/cocktails/${c.id}`}
                  className="group relative shrink-0 overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent transition-colors"
                  style={{ width: "200px", scrollSnapAlign: "start" }}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    {c.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 to-surface">
                          <Martini size={28} weight="thin" className="text-accent/30" />
                        </div>
                    }
                    {c.est_signature && (
                      <span className="absolute right-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">SIG</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-semibold text-white text-sm leading-tight line-clamp-2">{c.nom}</p>
                      {createur && <p className="text-xs text-white/50 mt-0.5">{createur.pseudo}</p>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Reveal>
      )}

      <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">

        {/* Tendances */}
        {(tendancesSorted?.length ?? 0) > 0 && (
          <Reveal as="section">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">Tendances</h2>
                <p className="text-sm text-foreground/40 mt-0.5">Les plus recréés par la communauté</p>
              </div>
              <Link href="/cocktails" className="text-sm text-accent hover:underline">Voir tout →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tendancesSorted?.map((c, i) => {
                const createur = c.profiles as unknown as { pseudo: string } | null;
                const nbRecrées = (c.recreations as unknown as { count: number }[])?.[0]?.count ?? 0;
                return (
                  <Link key={c.id} href={`/cocktails/${c.id}`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 hover:border-accent transition-colors">
                    <span className="font-display text-3xl text-accent/20 w-8 shrink-0 text-center">{i + 1}</span>
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-accent/10">
                      {c.photo_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover" />
                        : <div className="flex h-full w-full items-center justify-center"><Martini size={24} weight="thin" className="text-accent/50" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-1">{c.nom}</p>
                      <p className="text-xs text-foreground/40 mt-0.5">{createur?.pseudo} · {c.categorie_alcool}</p>
                    </div>
                    {nbRecrées > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-accent">{nbRecrées}</p>
                        <p className="text-[10px] text-foreground/30">recréation{nbRecrées > 1 ? "s" : ""}</p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Cocktails signature */}
        {(cocktailsSignature?.length ?? 0) > 0 && (
          <Reveal as="section" className="rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl">Cocktails Signature</h2>
                <BadgeSignature taille="sm" />
              </div>
              <Link href="/cocktails" className="text-sm text-accent hover:underline">Voir tout →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              {cocktailsSignature?.map((c) => {
                const createur = c.profiles as unknown as { pseudo: string; id: string } | null;
                return (
                  <Link key={c.id} href={`/cocktails/${c.id}`} className="group relative overflow-hidden rounded-2xl bg-background border border-accent/20 hover:border-accent transition-colors">
                    <div className="aspect-square overflow-hidden">
                      {c.photo_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 to-background">
                            <Martini size={32} weight="thin" className="text-accent/30" />
                          </div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="font-semibold text-white text-sm line-clamp-1">{c.nom}</p>
                        {createur && <p className="text-xs text-white/50">{createur.pseudo}</p>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Producteurs */}
        {(derniersProducteurs?.length ?? 0) > 0 && (
          <Reveal as="section">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">Producteurs à la une</h2>
                <p className="text-sm text-foreground/40 mt-0.5">Les artisans derrière les bouteilles</p>
              </div>
              <Link href="/producteurs" className="text-sm text-accent hover:underline">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {derniersProducteurs?.map((p) => (
                <Link key={p.id} href={`/producteurs/${p.id}`} className="group flex flex-col items-center rounded-2xl border border-border bg-surface p-5 text-center hover:border-accent transition-colors">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                    {p.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.photo_url} alt={p.nom} className="h-full w-full object-cover" />
                      : <span className="text-2xl font-bold text-accent">{p.nom.charAt(0)}</span>
                    }
                  </div>
                  <p className="font-semibold text-sm line-clamp-1">{p.nom}</p>
                  {p.region && <p className="text-xs text-foreground/40 mt-0.5">{p.region}</p>}
                  {p.type_produit && <p className="mt-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">{p.type_produit}</p>}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* Communauté + CTA */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-2">
          {/* Membres actifs */}
          {(topCreateurs?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-display text-lg mb-4">La communauté</h3>
              <div className="space-y-3">
                {topCreateurs?.map((c) => (
                  <Link key={c.id} href={`/profil/${c.id}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10 text-sm font-bold text-accent">
                      {c.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={c.avatar_url} alt={c.pseudo} className="h-full w-full object-cover" />
                        : c.pseudo?.charAt(0).toUpperCase()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{c.pseudo}</p>
                      <p className="text-xs text-foreground/40">{c.role === "barman" ? "Barman" : "Amateur"}</p>
                    </div>
                    <CaretRight size={14} weight="bold" className="text-foreground/20 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {!user ? (
            <div className="flex flex-col justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-surface p-6">
              <p className="font-display text-2xl text-accent leading-tight">Partage tes recettes.</p>
              <p className="font-display text-2xl text-foreground/60 leading-tight mb-4">Rejoins la communauté.</p>
              <p className="text-sm text-foreground/50 mb-6">Propose tes cocktails, suis les barmans qui t&apos;inspirent, découvre des producteurs du monde entier.</p>
              <div className="flex flex-col gap-2">
                <Link href="/inscription" className="rounded-lg bg-accent py-3 text-center font-semibold text-white hover:opacity-90 transition-opacity">
                  Créer un compte
                </Link>
                <Link href="/connexion" className="rounded-lg border border-border py-2.5 text-center text-sm text-foreground/60 hover:border-accent transition-colors">
                  Déjà membre ? Connexion
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center rounded-2xl border border-border bg-surface p-6">
              <p className="font-display text-xl mb-2">Prêt à créer ?</p>
              <p className="text-sm text-foreground/50 mb-6">Partage ta prochaine recette avec la communauté.</p>
              <Link href="/cocktails/proposer" className="rounded-lg bg-accent py-3 text-center font-semibold text-white hover:opacity-90 transition-opacity">
                Proposer un cocktail
              </Link>
            </div>
          )}
        </Reveal>

      </div>
    </div>
  );
}
