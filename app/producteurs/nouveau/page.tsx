import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creerProducteurAction } from "../actions";
import { FormulaireProducteur } from "@/components/ui/formulaire-producteur";

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

      <FormulaireProducteur action={creerProducteurAction} />
    </div>
  );
}
