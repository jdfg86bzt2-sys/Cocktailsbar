import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creerTwistAction } from "@/app/cocktails/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IngredientsForm } from "@/components/ui/ingredients-form";
import { TECHNIQUES } from "@/lib/types";

export default async function NouveauTwistPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: cocktail } = await supabase
    .from("cocktails")
    .select("id, nom")
    .eq("id", id)
    .single();

  if (!cocktail) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-1 text-4xl text-accent">Proposer un twist</h1>
      <p className="mb-6 text-foreground/60">Variante de « {cocktail.nom} »</p>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">
          {erreur}
        </p>
      )}

      <form action={creerTwistAction} className="flex flex-col gap-4">
        <input type="hidden" name="cocktail_origine_id" value={cocktail.id} />

        <div>
          <label className="mb-1 block text-sm font-medium">Nom du twist</label>
          <Input name="nom" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            En quoi consiste ta variante ?
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
          />
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

        <IngredientsForm />

        <div>
          <label className="mb-1 block text-sm font-medium">Photo</label>
          <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
        </div>

        <Button type="submit">Publier mon twist</Button>
      </form>
    </div>
  );
}
