import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

// Barre de navigation mobile-first, affichée sur toutes les pages (Server Component)
export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let pseudo: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("pseudo")
      .eq("id", user.id)
      .single();
    pseudo = profile?.pseudo ?? null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl text-accent">
          Barre de Cocktails
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/cocktails" className="hover:text-accent">
            Cocktails
          </Link>
          <Link href="/producteurs" className="hover:text-accent">
            Producteurs
          </Link>
          {user ? (
            <>
              <Link
                href={`/profil/${user.id}`}
                className="hidden sm:inline hover:text-accent"
              >
                {pseudo}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/connexion" className="hover:text-accent">
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded bg-accent px-3 py-1.5 text-accent-foreground hover:opacity-90"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
