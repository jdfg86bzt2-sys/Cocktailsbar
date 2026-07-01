import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BadgeSignature } from "@/components/ui/badge-signature";

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
  ] = await Promise.all([
    supabase.from("cocktails").select("id, nom, photo_url, est_signature, categorie_alcool, profiles(pseudo)").order("created_at", { ascending: false }).limit(6),
    supabase.from("cocktails").select("id, nom, photo_url, profiles(pseudo, id)").eq("est_signature", true).order("created_at", { ascending: false }).limit(3),
    supabase.from("profiles").select("id, pseudo, avatar_url, role").neq("role", null).limit(6),
    supabase.from("producteurs").select("id, nom, photo_url, region, type_produit").order("created_at", { ascending: false }).limit(4),
    supabase.from("cocktails").select("*", { count: "exact", head: true }),
    supabase.from("producteurs").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(226,35,26,0.15),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-5xl leading-tight text-accent sm:text-7xl">
            Barre de Cocktails
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-foreground/70 sm:text-lg">
            La communauté des barmans et amateurs passionnés. Partagez vos recettes, découvrez des signatures, suivez les meilleurs créateurs.
          </p>
          {!user ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/inscription" className="rounded-md bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">
                Rejoindre la communauté
              </Link>
              <Link href="/connexion" className="rounded-md border border-border px-6 py-3 font-semibold hover:border-accent">
                Connexion
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/cocktails/proposer" className="rounded-md bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">
                Proposer un cocktail
              </Link>
              <Link href="/cocktails" className="rounded-md border border-border px-6 py-3 font-semibold hover:border-accent">
                Explorer les cocktails
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-10">
            <div>
              <p className="font-display text-3xl text-accent">{nbCocktails ?? 0}</p>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">Cocktails</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-display text-3xl text-accent">{nbProducteurs ?? 0}</p>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">Producteurs</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-display text-3xl text-accent">{nbMembres ?? 0}</p>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">Membres</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">

        {/* Derniers cocktails */}
        {(dernierscocktails?.length ?? 0) > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl">Dernières recettes</h2>
              <Link href="/cocktails" className="text-sm text-accent hover:underline">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {dernierscocktails?.map((c) => {
                const createur = c.profiles as unknown as { pseudo: string } | null;
                return (
                  <Link key={c.id} href={`/cocktails/${c.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-surface border border-border hover:border-accent transition-colors">
                    {c.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      : (
                        <div className="flex h-full w-full items-center justify-center p-4">
                          <span className="text-center text-sm font-medium text-foreground/60">{c.nom}</span>
                        </div>
                      )
                    }
                    {c.est_signature && (
                      <span className="absolute right-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">SIG</span>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
                      <p className="font-semibold text-white text-sm leading-tight line-clamp-2">{c.nom}</p>
                      {createur && <p className="text-xs text-white/60 mt-0.5">par {createur.pseudo}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Cocktails signature */}
        {(cocktailsSignature?.length ?? 0) > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl">Signatures</h2>
                <BadgeSignature taille="sm" />
              </div>
              <Link href="/cocktails" className="text-sm text-accent hover:underline">Voir tout →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {cocktailsSignature?.map((c) => {
                const createur = c.profiles as unknown as { pseudo: string; id: string } | null;
                return (
                  <Link key={c.id} href={`/cocktails/${c.id}`} className="group relative overflow-hidden rounded-lg bg-surface border border-accent/30 hover:border-accent transition-colors">
                    <div className="aspect-video overflow-hidden">
                      {c.photo_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        : <div className="h-full w-full bg-gradient-to-br from-accent/10 to-surface" />
                      }
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm">{c.nom}</p>
                      {createur && (
                        <span className="text-xs text-accent">{createur.pseudo}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Producteurs */}
        {(derniersProducteurs?.length ?? 0) > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl">Producteurs à la une</h2>
              <Link href="/producteurs" className="text-sm text-accent hover:underline">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {derniersProducteurs?.map((p) => (
                <Link key={p.id} href={`/producteurs/${p.id}`} className="group rounded-lg border border-border bg-surface p-4 hover:border-accent transition-colors">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-accent/10">
                    {p.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.photo_url} alt={p.nom} className="h-full w-full object-cover" />
                      : <span className="text-xl font-bold text-accent">{p.nom.charAt(0)}</span>
                    }
                  </div>
                  <p className="font-semibold text-sm line-clamp-1">{p.nom}</p>
                  {p.region && <p className="text-xs text-foreground/50 mt-0.5">{p.region}</p>}
                  {p.type_produit && <p className="text-xs text-accent mt-1">{p.type_produit}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top créateurs */}
        {(topCreateurs?.length ?? 0) > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="font-display text-2xl">La communauté</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {topCreateurs?.map((c) => (
                <Link key={c.id} href={`/profil/${c.id}`} className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 hover:border-accent transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-sm font-bold text-accent">
                    {c.avatar_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.avatar_url} alt={c.pseudo} className="h-full w-full object-cover" />
                      : c.pseudo?.charAt(0).toUpperCase()
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{c.pseudo}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">{c.role === "barman" ? "Barman" : "Amateur"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA bas de page */}
        {!user && (
          <section className="rounded-xl border border-accent/30 bg-accent/5 px-6 py-10 text-center">
            <h2 className="font-display text-2xl text-accent">Rejoins la communauté</h2>
            <p className="mt-2 text-sm text-foreground/70">Propose tes recettes, suis tes barmans préférés, découvre des producteurs locaux.</p>
            <Link href="/inscription" className="mt-5 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">
              Créer un compte gratuitement
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
