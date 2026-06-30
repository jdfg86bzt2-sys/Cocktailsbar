import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creerCocktailAction } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IngredientsForm } from "@/components/ui/ingredients-form";
import { CATEGORIES_ALCOOL, TECHNIQUES } from "@/lib/types";

export default async function NouveauCocktailPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "barman") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-accent">Réservé aux barmans</h1>
        <p className="mt-4 text-foreground/70">
          Seuls les comptes barman/créateur peuvent publier une fiche cocktail.
          Tu peux en revanche publier un twist sur un cocktail existant.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-6 text-4xl text-accent">
        Publier un cocktail
      </h1>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">
          {erreur}
        </p>
      )}

      <form action={creerCocktailAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom du cocktail</label>
          <Input name="nom" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Catégorie d&apos;alcool
            </label>
            <select
              name="categorie_alcool"
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
            >
              {CATEGORIES_ALCOOL.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Technique</label>
            <select
              name="technique"
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
            >
              {TECHNIQUES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <IngredientsForm />

        <div>
          <label className="mb-1 block text-sm font-medium">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full text-sm"
          />
        </div>

        <Button type="submit">Publier la fiche</Button>
      </form>
    </div>
  );
}
