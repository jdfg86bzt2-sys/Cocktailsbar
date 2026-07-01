import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let pseudo: string | null = null;
  let isAdmin = false;
  let nbEnAttente = 0;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("pseudo, is_admin")
      .eq("id", user.id)
      .single();
    pseudo = profile?.pseudo ?? null;
    isAdmin = profile?.is_admin === true;

    if (isAdmin) {
      const [{ count: c1 }, { count: c2 }] = await Promise.all([
        supabase.from("suggestions_cocktails").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
        supabase.from("suggestions_producteurs").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
      ]);
      nbEnAttente = (c1 ?? 0) + (c2 ?? 0);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl text-accent">
          Barre de Cocktails
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/cocktails" className="hover:text-accent">Cocktails</Link>
          <Link href="/producteurs" className="hover:text-accent">Producteurs</Link>

          {isAdmin && (
            <Link href="/admin" className="relative hover:text-accent">
              Admin
              {nbEnAttente > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {nbEnAttente}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <Link href={`/profil/${user.id}`} className="hidden sm:inline hover:text-accent">
                {pseudo}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/connexion" className="hover:text-accent">Connexion</Link>
              <Link href="/inscription" className="rounded bg-accent px-3 py-1.5 text-accent-foreground hover:opacity-90">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
