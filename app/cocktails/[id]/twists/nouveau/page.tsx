import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { proposerTwistAction } from "./actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IngredientsForm } from "@/components/ui/ingredients-form";
import { EtapesForm } from "@/components/ui/etapes-form";
import { TECHNIQUES } from "@/lib/types";

export default async function ProposerTwistPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string; succes?: string }>;
}) {
  const { id } = await params;
  const { erreur, succes } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: cocktail } = await supabase
    .from("cocktails").select("id, nom").eq("id", id).single();

  if (!cocktail) notFound();

  const { data: producteurs } = await supabase
    .from("producteurs").select("id, nom").order("nom");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-1 text-4xl text-accent">Proposer un twist</h1>
      <p className="mb-6 text-foreground/60">Variante de « {cocktail.nom} », soumise à validation avant publication.</p>

      {succes && (
        <div className="mb-6 rounded border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Proposition envoyée, merci ! On la vérifie dès que possible.
        </div>
      )}

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">{erreur}</p>
      )}

      {!succes && (
        <form action={proposerTwistAction} className="flex flex-col gap-4">
          <input type="hidden" name="cocktail_origine_id" value={cocktail.id} />

          <div>
            <label className="mb-1 block text-sm font-medium">Nom du twist *</label>
            <Input name="nom" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">En quoi consiste ta variante ?</label>
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
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Choisir...</option>
              {TECHNIQUES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <IngredientsForm producteurs={producteurs ?? []} />
          <EtapesForm />

          <div>
            <label className="mb-1 block text-sm font-medium">
              Photo <span className="text-foreground/50">(optionnel)</span>
            </label>
            <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
          </div>

          <SubmitButton label="Envoyer la proposition" labelPending="Envoi..." />
        </form>
      )}
    </div>
  );
}
