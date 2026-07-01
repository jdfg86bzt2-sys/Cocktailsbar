import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creerCocktailAction } from "../actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IngredientsForm } from "@/components/ui/ingredients-form";
import { EtapesForm } from "@/components/ui/etapes-form";
import { TagsGout } from "@/components/ui/tags-gout";
import { SelecteurProducteurs } from "@/components/ui/selecteur-producteurs";
import { CATEGORIES_ALCOOL, TECHNIQUES, TYPES_VERRE } from "@/lib/types";

export default async function NouveauCocktailPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();

  if (!profile?.is_admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-accent">Accès réservé</h1>
        <p className="mt-4 text-foreground/70">
          Tu veux partager un cocktail ?{" "}
          <a href="/cocktails/proposer" className="text-accent underline">Envoie une proposition</a> et on la vérifie avant publication.
        </p>
      </div>
    );
  }

  // Charge la liste des producteurs existants pour la sélection
  const { data: producteurs } = await supabase
    .from("producteurs")
    .select("id, nom, type, region")
    .order("nom");



  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-6 text-4xl text-accent">Publier un cocktail</h1>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">{erreur}</p>
      )}

      <form action={creerCocktailAction} className="flex flex-col gap-6">
        {/* Infos générales */}
        <div>
          <label className="mb-1 block text-sm font-medium">Nom du cocktail *</label>
          <Input name="nom" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            L&apos;inspiration — contexte, histoire, pourquoi ce cocktail ?
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Ex: J'ai créé ce cocktail pour un dîner automnal en cherchant à marier les notes fumées du whisky tourbé avec la fraîcheur du gingembre..."
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Catégorie d&apos;alcool *</label>
            <select name="categorie_alcool" required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none">
              {CATEGORIES_ALCOOL.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Technique *</label>
            <select name="technique" required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none">
              {TECHNIQUES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Verre utilisé</label>
          <select name="type_verre"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none">
            <option value="">— Sélectionner un verre —</option>
            {TYPES_VERRE.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* Profil de goût */}
        <TagsGout />

        {/* Ingrédients */}
        <IngredientsForm />

        {/* Producteurs utilisés */}
        <SelecteurProducteurs producteurs={producteurs ?? []} />

        {/* Étapes */}
        <EtapesForm />

        {/* Photo */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Photo du cocktail <span className="text-foreground/50">(optionnel)</span>
          </label>
          <p className="mb-2 text-xs text-foreground/50">
            Merci de publier une photo réelle du cocktail décrit.
          </p>
          <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
        </div>

        <SubmitButton label="Publier la fiche" labelPending="Publication..." />
      </form>
    </div>
  );
}
