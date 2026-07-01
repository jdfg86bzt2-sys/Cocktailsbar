import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { proposerCocktailAction } from "./actions";
import { IngredientsForm } from "@/components/ui/ingredients-form";
import { EtapesForm } from "@/components/ui/etapes-form";
import { TagsGout } from "@/components/ui/tags-gout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TECHNIQUES, CATEGORIES_ALCOOL, TYPES_VERRE } from "@/lib/types";

export default async function ProposerCocktailPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; succes?: string }>;
}) {
  const { erreur, succes } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: producteurs } = await supabase
    .from("producteurs")
    .select("id, nom")
    .order("nom");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-2 text-4xl text-accent">Proposer un cocktail</h1>
      <p className="mb-8 text-sm text-foreground/60">
        Envoie ta recette complète. Notre équipe la vérifie et la publie si elle correspond à nos
        critères de qualité. Tu peux demander le badge Signature si le cocktail est une création originale.
      </p>

      {succes && (
        <div className="mb-6 rounded border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Proposition envoyée — merci ! On la vérifie dès que possible.
        </div>
      )}

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">{erreur}</p>
      )}

      {!succes && (
        <form action={proposerCocktailAction} className="flex flex-col gap-6">
          {/* Photo */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Photo du cocktail <span className="text-foreground/50">(recommandé)</span>
            </label>
            <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
          </div>

          {/* Infos de base */}
          <div>
            <label className="mb-1 block text-sm font-medium">Nom du cocktail *</label>
            <Input name="nom" required placeholder="Ex: Negroni Fumé" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description / inspiration</label>
            <textarea
              name="description"
              rows={3}
              placeholder="D'où vient ce cocktail ? Quelle est l'histoire derrière ?"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Catégorie d&apos;alcool</label>
              <select
                name="categorie_alcool"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
              >
                <option value="">Choisir...</option>
                {CATEGORIES_ALCOOL.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Technique</label>
              <select
                name="technique"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
              >
                <option value="">Choisir...</option>
                {TECHNIQUES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Type de verre</label>
            <select
              name="type_verre"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Choisir...</option>
              {TYPES_VERRE.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Ingrédients avec producteur */}
          <IngredientsForm producteurs={producteurs ?? []} />

          {/* Étapes */}
          <EtapesForm />

          {/* Tags de goût */}
          <TagsGout />

          {/* Demande Signature */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="demande_signature"
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <p className="font-medium">Demander le badge Signature</p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  Ce cocktail est une création 100% originale de ta part — pas une adaptation d&apos;une
                  recette existante. Notre équipe vérifiera l&apos;originalité avant de valider.
                </p>
              </div>
            </label>
          </div>

          <Button type="submit">Envoyer la proposition</Button>
        </form>
      )}
    </div>
  );
}
