import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const [{ count: nbCocktails }, { count: nbProducteurs }, { count: nbTwists }] = await Promise.all([
    supabase.from("suggestions_cocktails").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
    supabase.from("suggestions_producteurs").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
    supabase.from("suggestions_twists").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
  ]);

  const totalEnAttente = (nbCocktails ?? 0) + (nbProducteurs ?? 0) + (nbTwists ?? 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display mb-2 text-4xl text-accent">Administration</h1>
      <p className="mb-10 text-sm text-foreground/60">
        {totalEnAttente === 0
          ? "Aucune proposition en attente."
          : `${totalEnAttente} proposition${totalEnAttente > 1 ? "s" : ""} en attente de validation.`}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/cocktails" className="group relative rounded-lg border border-border bg-surface p-6 hover:border-accent">
          {(nbCocktails ?? 0) > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {nbCocktails}
            </span>
          )}
          <div className="mb-3 text-3xl">🍹</div>
          <h2 className="text-xl font-semibold group-hover:text-accent">Cocktails</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {(nbCocktails ?? 0) === 0 ? "Aucune proposition" : `${nbCocktails} à valider`}
          </p>
        </Link>

        <Link href="/admin/twists" className="group relative rounded-lg border border-border bg-surface p-6 hover:border-accent">
          {(nbTwists ?? 0) > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {nbTwists}
            </span>
          )}
          <div className="mb-3 text-3xl">🔄</div>
          <h2 className="text-xl font-semibold group-hover:text-accent">Twists</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {(nbTwists ?? 0) === 0 ? "Aucune proposition" : `${nbTwists} à valider`}
          </p>
        </Link>

        <Link href="/admin/suggestions" className="group relative rounded-lg border border-border bg-surface p-6 hover:border-accent">
          {(nbProducteurs ?? 0) > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {nbProducteurs}
            </span>
          )}
          <div className="mb-3 text-3xl">🏭</div>
          <h2 className="text-xl font-semibold group-hover:text-accent">Producteurs</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {(nbProducteurs ?? 0) === 0 ? "Aucune suggestion" : `${nbProducteurs} à valider`}
          </p>
        </Link>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/cocktails/nouveau" className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent">
          + Créer un cocktail
        </Link>
        <Link href="/producteurs/nouveau" className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent">
          + Créer un producteur
        </Link>
      </div>
    </div>
  );
}
