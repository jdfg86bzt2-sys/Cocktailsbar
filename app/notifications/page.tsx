import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { marquerToutLu } from "./actions";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: notifs } = await supabase
    .from("notifications")
    .select("*")
    .eq("destinataire_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const nonLues = notifs?.filter((n) => !n.lu).length ?? 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl text-accent">Notifications</h1>
        {nonLues > 0 && (
          <form action={marquerToutLu}>
            <button type="submit" className="text-sm text-foreground/50 hover:text-accent">
              Tout marquer comme lu
            </button>
          </form>
        )}
      </div>

      {(!notifs || notifs.length === 0) && (
        <p className="text-foreground/50">Aucune notification pour le moment.</p>
      )}

      <div className="flex flex-col gap-2">
        {notifs?.map((n) => (
          <Link
            key={n.id}
            href={n.lien ?? "#"}
            className={`rounded-lg border px-4 py-3 transition-colors hover:border-accent ${
              n.lu ? "border-border/40 opacity-60" : "border-border bg-surface"
            }`}
          >
            <div className="flex items-start gap-3">
              {!n.lu && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
              <div className={!n.lu ? "" : "ml-5"}>
                <p className="text-sm">{n.message}</p>
                <p className="mt-0.5 text-xs text-foreground/40">
                  {new Date(n.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
