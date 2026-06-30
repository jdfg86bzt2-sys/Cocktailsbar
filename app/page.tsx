import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-5xl text-accent sm:text-6xl">
        Barre de Cocktails
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
        La plateforme communautaire pour barmans et amateurs : fiches
        cocktails, créations signature créditées et spotlight sur les petits
        producteurs.
      </p>

      {!user && (
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/inscription"
            className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90"
          >
            Rejoindre la communauté
          </Link>
          <Link
            href="/connexion"
            className="rounded-md border border-border px-6 py-3 font-semibold hover:border-accent"
          >
            Connexion
          </Link>
        </div>
      )}

      <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xl text-accent">Cocktails &amp; twists</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Bientôt disponible — fiches détaillées et variantes créditées.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xl text-accent">Signature certifiée</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Bientôt disponible — créateur crédité et compteur de recréations.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xl text-accent">Petits producteurs</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Bientôt disponible — spotlight sur les distilleries locales.
          </p>
        </div>
      </div>
    </div>
  );
}
