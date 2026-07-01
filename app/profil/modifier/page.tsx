import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { modifierProfilAction } from "./actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function ModifierProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("pseudo, bio, avatar_url, banner_url, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display mb-8 text-4xl text-accent">Modifier mon profil</h1>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">{erreur}</p>
      )}

      <form action={modifierProfilAction} className="flex flex-col gap-6">
        {/* Bannière */}
        <div>
          <label className="mb-1 block text-sm font-medium">Photo de couverture</label>
          {profile.banner_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.banner_url} alt="Bannière actuelle"
              className="mb-2 h-32 w-full rounded-lg object-cover" />
          )}
          <input type="file" name="banner" accept="image/*" className="w-full text-sm" />
          <p className="mt-1 text-xs text-foreground/50">Format paysage recommandé (1200×400)</p>
        </div>

        {/* Avatar */}
        <div>
          <label className="mb-1 block text-sm font-medium">Photo de profil</label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface text-xl font-bold text-accent overflow-hidden">
              {profile.avatar_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                : profile.pseudo.charAt(0).toUpperCase()
              }
            </div>
            <input type="file" name="avatar" accept="image/*" className="w-full text-sm" />
          </div>
        </div>

        {/* Pseudo */}
        <div>
          <label className="mb-1 block text-sm font-medium">Pseudo *</label>
          <Input name="pseudo" required defaultValue={profile.pseudo} />
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile.bio ?? ""}
            placeholder="Parle de toi, de ta passion pour les cocktails, de ton bar..."
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <SubmitButton label="Enregistrer" labelPending="Sauvegarde..." />
          <a
            href={`/profil/${user.id}`}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent"
          >
            Annuler
          </a>
        </div>
      </form>
    </div>
  );
}
