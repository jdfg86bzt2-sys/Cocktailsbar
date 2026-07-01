import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { suggererProducteurAction } from "./actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function SuggererProducteurPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; succes?: string }>;
}) {
  const { erreur, succes } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display mb-2 text-4xl text-accent">Suggérer un producteur</h1>
      <p className="mb-8 text-sm text-foreground/60">
        Tu connais une distillerie, un vigneron ou un artisan de qualité ? Envoie-nous la suggestion,
        on vérifie et on crée la fiche officielle.
      </p>

      {succes && (
        <div className="mb-6 rounded border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Suggestion envoyée — merci ! On s&apos;en occupe dès que possible.
        </div>
      )}

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">{erreur}</p>
      )}

      {!succes && (
        <form action={suggererProducteurAction} className="flex flex-col gap-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Nom du producteur *</label>
            <Input name="nom" required placeholder="Ex: Distillerie du Vercors" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Site web <span className="text-foreground/50">(optionnel)</span>
            </label>
            <Input name="site_web" type="url" placeholder="https://..." />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Pourquoi tu le recommandes ? <span className="text-foreground/50">(optionnel)</span>
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Dis-nous ce qui rend ce producteur spécial..."
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
            />
          </div>

          <SubmitButton label="Envoyer la suggestion" labelPending="Envoi..." />
        </form>
      )}
    </div>
  );
}
