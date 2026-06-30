import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase utilisé côté serveur (Server Components, Server Actions, Route Handlers)
// Il lit/écrit les cookies de session pour savoir qui est connecté
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll peut être appelé depuis un Server Component : on ignore
            // l'erreur car le middleware se charge déjà de rafraîchir la session
          }
        },
      },
    }
  );
}
