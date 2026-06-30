import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creerProducteurAction } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TYPES_PRODUCTEUR } from "@/lib/types";

export default async function NouveauProducteurPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "barman") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-accent">Réservé aux barmans</h1>
        <p className="mt-4 text-foreground/70">
          Seuls les barmans peuvent référencer un nouveau producteur.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-2 text-4xl text-accent">Référencer un producteur</h1>
      <p className="mb-6 text-sm text-foreground/60">
        Mets en lumière une distillerie, un vigneron ou un artisan dont tu utilises les produits.
      </p>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">{erreur}</p>
      )}

      <form action={creerProducteurAction} className="flex flex-col gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom du producteur *</label>
          <Input name="nom" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Type *</label>
            <select name="type" required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none">
              {TYPES_PRODUCTEUR.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Région</label>
            <Input name="region" placeholder="Ex: Bretagne, Cognac..." />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Pays</label>
          <Input name="pays" defaultValue="France" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Qui sont-ils ? Qu'est-ce qui rend leurs produits uniques ? Pourquoi les utilises-tu ?"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Site web</label>
          <Input name="site_web" type="url" placeholder="https://..." />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Photo <span className="text-foreground/50">(optionnel)</span>
          </label>
          <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
        </div>

        <Button type="submit">Publier la fiche</Button>
      </form>
    </div>
  );
}
