import Link from "next/link";
import { connexionAction } from "../actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display mb-6 text-4xl text-accent">Connexion</h1>

      {erreur && (
        <p className="mb-4 rounded border border-accent bg-accent/10 px-3 py-2 text-sm">
          {erreur}
        </p>
      )}

      <form action={connexionAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" name="email" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <Input type="password" name="password" required />
        </div>

        <SubmitButton label="Se connecter" labelPending="Connexion..." />
      </form>

      <p className="mt-6 text-sm text-foreground/70">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-accent hover:underline">
          Inscris-toi
        </Link>
      </p>
    </div>
  );
}
