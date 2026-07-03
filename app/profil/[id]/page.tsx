import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BadgeSignature } from "@/components/ui/badge-signature";
import { BoutonSuivre } from "@/components/ui/bouton-suivre";

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const estMonProfil = user?.id === id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("pseudo, role, bio, avatar_url, banner_url, created_at")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const estBarman = profile.role === "barman";

  const [{ data: cocktails }, { data: twists }, { data: recreations }, { count: nbFollowers }, { count: nbFollowing }, { data: favoris }] = await Promise.all([
    supabase.from("cocktails").select("id, nom, photo_url, est_signature, categorie_alcool").eq("createur_id", id).order("created_at", { ascending: false }),
    supabase.from("twists").select("id, nom, photo_url, cocktails(nom)").eq("createur_id", id).order("created_at", { ascending: false }),
    supabase.from("recreations").select("cocktail_id, cocktails(id, nom, photo_url)").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", id),
    supabase.from("favoris").select("cocktail_id, cocktails(id, nom, photo_url, categorie_alcool)").eq("user_id", id).order("created_at", { ascending: false }),
  ]);

  let dejaAbonne = false;
  let notifActive = false;
  if (user && !estMonProfil) {
    const { data: f } = await supabase.from("follows").select("id, notif_active").eq("follower_id", user.id).eq("following_id", id).maybeSingle();
    dejaAbonne = !!f;
    notifActive = f?.notif_active === true;
  }

  const nbSignatures = cocktails?.filter((c) => c.est_signature).length ?? 0;

  const { count: nbTotalRecreations } = (cocktails?.length ?? 0) > 0
    ? await supabase.from("recreations").select("*", { count: "exact", head: true }).in("cocktail_id", cocktails!.map((c) => c.id))
    : { count: 0 };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Bannière */}
      <div className="relative h-48 w-full bg-surface sm:h-56">
        {profile.banner_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={profile.banner_url} alt="Bannière" className="h-full w-full object-cover" />
          : <div className="h-full w-full bg-gradient-to-br from-surface to-accent/10" />
        }
        <div className="absolute -bottom-10 left-4 sm:left-6">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-surface text-2xl font-bold text-accent flex items-center justify-center">
            {profile.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={profile.avatar_url} alt={profile.pseudo} className="h-full w-full object-cover" />
              : profile.pseudo.charAt(0).toUpperCase()
            }
          </div>
        </div>
        {estMonProfil && (
          <div className="absolute bottom-3 right-4">
            <Link href="/profil/modifier" className="rounded-md border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur hover:border-accent">
              Modifier le profil
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12 px-4 sm:px-6">
        {/* Nom + badge + rôle + bouton suivre */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl text-accent">{profile.pseudo}</h1>
              {estBarman && nbSignatures > 0 && <BadgeSignature taille="sm" />}
            </div>
            <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold mt-1 ${
              estBarman ? "bg-accent/20 text-accent" : "bg-surface text-foreground/70"
            }`}>
              {estBarman ? "Barman / Créateur" : "Amateur"}
            </span>
          </div>
          {!estMonProfil && (
            <BoutonSuivre profilId={id} dejaAbonne={dejaAbonne} notifActive={notifActive} userId={user?.id ?? null} />
          )}
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{profile.bio}</p>
        )}

        {/* Followers */}
        <div className="mt-3 flex gap-4 text-sm">
          <span><span className="font-semibold text-foreground">{nbFollowers ?? 0}</span> <span className="text-foreground/50">abonnés</span></span>
          <span><span className="font-semibold text-foreground">{nbFollowing ?? 0}</span> <span className="text-foreground/50">abonnements</span></span>
        </div>

        {/* Stats */}
        <div className="mt-5 flex gap-6 border-b border-border pb-5">
          <div className="text-center">
            <p className="font-display text-2xl text-accent">{cocktails?.length ?? 0}</p>
            <p className="text-xs text-foreground/60">cocktails</p>
          </div>
          {estBarman && (
            <>
              <div className="text-center">
                <p className="font-display text-2xl text-accent">{nbSignatures}</p>
                <p className="text-xs text-foreground/60">signatures</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl text-accent">{nbTotalRecreations ?? 0}</p>
                <p className="text-xs text-foreground/60">recréations</p>
              </div>
            </>
          )}
          <div className="text-center">
            <p className="font-display text-2xl text-accent">{twists?.length ?? 0}</p>
            <p className="text-xs text-foreground/60">twists</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-accent">{recreations?.length ?? 0}</p>
            <p className="text-xs text-foreground/60">recréés</p>
          </div>
        </div>

        {/* Grille cocktails */}
        {(cocktails?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">Cocktails</h2>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {cocktails?.map((c) => (
                <Link key={c.id} href={`/cocktails/${c.id}`} className="group relative aspect-square overflow-hidden rounded-md bg-surface">
                  {c.photo_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    : (
                      <div className="flex h-full w-full items-center justify-center bg-surface p-2">
                        <span className="text-center text-xs font-medium text-foreground/70">{c.nom}</span>
                      </div>
                    )
                  }
                  {c.est_signature && (
                    <span className="absolute right-1 top-1 rounded bg-accent px-1 py-0.5 text-[10px] font-bold text-white">SIG</span>
                  )}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-medium text-white line-clamp-2">{c.nom}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Twists */}
        {(twists?.length ?? 0) > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">Twists proposés</h2>
            <div className="flex flex-col gap-2">
              {twists?.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
                  {t.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photo_url} alt={t.nom} className="h-10 w-10 rounded object-cover shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{t.nom}</p>
                    <p className="text-xs text-foreground/50">variante de {(t.cocktails as unknown as { nom: string } | null)?.nom}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recréations */}
        {(recreations?.length ?? 0) > 0 && (
          <div className="mt-8 mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">Cocktails recréés</h2>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {recreations?.map((r) => {
                const c = r.cocktails as unknown as { id: string; nom: string; photo_url: string | null } | null;
                if (!c) return null;
                return (
                  <Link key={r.cocktail_id} href={`/cocktails/${c.id}`} className="group relative aspect-square overflow-hidden rounded-md bg-surface">
                    {c.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      : (
                        <div className="flex h-full w-full items-center justify-center p-2">
                          <span className="text-center text-xs text-foreground/70">{c.nom}</span>
                        </div>
                      )
                    }
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-xs font-medium text-white line-clamp-2">{c.nom}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Favoris */}
        {(favoris?.length ?? 0) > 0 && (
          <div className="mt-8 mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">🔖 Sauvegardés</h2>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {favoris?.map((f) => {
                const c = f.cocktails as unknown as { id: string; nom: string; photo_url: string | null } | null;
                if (!c) return null;
                return (
                  <Link key={f.cocktail_id} href={`/cocktails/${c.id}`} className="group relative aspect-square overflow-hidden rounded-md bg-surface">
                    {c.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.photo_url} alt={c.nom} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      : (
                        <div className="flex h-full w-full items-center justify-center p-2">
                          <span className="text-center text-xs text-foreground/70">{c.nom}</span>
                        </div>
                      )
                    }
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-xs font-medium text-white line-clamp-2">{c.nom}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {(cocktails?.length ?? 0) === 0 && (recreations?.length ?? 0) === 0 && (
          <div className="py-16 text-center text-foreground/40">
            <p>Aucun cocktail pour le moment.</p>
            {estMonProfil && (
              <Link href="/cocktails/proposer" className="mt-2 inline-block text-sm text-accent hover:underline">
                Proposer ton premier cocktail →
              </Link>
            )}
          </div>
        )}

        <p className="pb-10 pt-4 text-xs text-foreground/30">
          Membre depuis le {new Date(profile.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </div>
  );
}
