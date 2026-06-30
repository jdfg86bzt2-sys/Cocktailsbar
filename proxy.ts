import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Rafraîchit la session Supabase avant chaque requête
// (Next.js 16 a renommé "middleware" en "proxy")
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
