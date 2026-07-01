import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES_ALCOOL, TECHNIQUES } from "@/lib/types";

type Filtres = {
  ingredient?: string;
  alcool?: string;
  technique?: string;
};

export default async function CocktailsPage({
  searchParams,
}: {
  searchParams: Promise<Filtres>;
}) {
  const filtres = await searchParams;
  const supabase = await createClient();

  let requete = supabase
    .from("cocktails")
    .select(
      "id, nom, description, categorie_alcool, technique, photo_url, profiles(pseudo)"
    )
    .order("created_at", { ascending: false });

  if (filtres.alcool) requete = requete.eq("categorie_alcool", filtres.alcool);
  if (filtres.technique) requete = requete.eq("technique", filtres.technique);

  // Filtre par ingrédient : on cherche d'abord les cocktails qui contiennent
  // cet ingrédient, puis on filtre la liste principale sur ces ids
  if (filtres.ingredient) {
    const { data: matchs } = await supabase
      .from("cocktail_ingredients")
      .select("cocktail_id")
      .ilike("ingredient_nom", `%${filtres.ingredient}%`);

    const ids = [...new Set((matchs ?? []).map((m) => m.cocktail_id))];
    requete = requete.in("id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data: cocktails } = await requete;

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    : { data: null };
  const estAdmin = profile?.is_admin === true;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-accent">Les cocktails</h1>
        <div className="flex gap-3">
          {estAdmin && (
            <>
              <Link
                href="/admin/cocktails"
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-accent"
              >
                Propositions
              </Link>
              <Link
                href="/cocktails/nouveau"
                className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground hover:opacity-90"
              >
                + Créer directement
              </Link>
            </>
          )}
          {!estAdmin && (
            <Link
              href={user ? "/cocktails/proposer" : "/connexion"}
              className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground hover:opacity-90"
            >
              Proposer un cocktail
            </Link>
          )}
        </div>
      </div>

      <form className="mt-6 grid gap-3 sm:grid-cols-4" method="get">
        <input
          name="ingredient"
          defaultValue={filtres.ingredient}
          placeholder="Ingrédient (ex: citron)"
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
        />
        <select
          name="alcool"
          defaultValue={filtres.alcool ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
        >
          <option value="">Tous les alcools</option>
          {CATEGORIES_ALCOOL.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="technique"
          defaultValue={filtres.technique ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
        >
          <option value="">Toutes les techniques</option>
          {TECHNIQUES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-border px-4 py-2 font-semibold hover:border-accent"
        >
          Filtrer
        </button>
      </form>

      {(!cocktails || cocktails.length === 0) && (
        <p className="mt-10 text-center text-foreground/60">
          Aucun cocktail ne correspond pour le moment.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cocktails?.map((c) => (
          <Link
            key={c.id}
            href={`/cocktails/${c.id}`}
            className="rounded-lg border border-border bg-surface p-4 hover:border-accent"
          >
            {c.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.photo_url}
                alt={c.nom}
                className="mb-3 h-40 w-full rounded object-cover"
              />
            )}
            <h2 className="text-lg font-semibold">{c.nom}</h2>
            <p className="text-sm text-foreground/60">
              {c.categorie_alcool} ·{" "}
              {TECHNIQUES.find((t) => t.value === c.technique)?.label}
            </p>
            <p className="mt-1 text-xs text-foreground/50">
              par {(c.profiles as unknown as { pseudo: string } | null)?.pseudo}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
