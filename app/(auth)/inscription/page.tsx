import Link from "next/link";
import { inscrireAction } from "../actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display mb-6 text-4xl text-accent">Rejoindre la bande</h1>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">
          {erreur}
        </p>
      )}

      <form action={inscrireAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Pseudo</label>
          <Input name="pseudo" required minLength={3} maxLength={30} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" name="email" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <Input type="password" name="password" required minLength={6} />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Je suis...</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="amateur" defaultChecked />
              Amateur
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="barman" />
              Barman / Créateur
            </label>
          </div>
        </fieldset>

        <SubmitButton label="Créer mon compte" labelPending="Création..." />
      </form>

      <p className="mt-6 text-sm text-foreground/70">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-accent hover:underline">
          Connecte-toi
        </Link>
      </p>
    </div>
  );
}
