"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enregistrerRecreation, supprimerRecreation } from "@/app/cocktails/[id]/actions";

export function BoutonRecreation({
  cocktailId,
  dejaRecrée,
  nbRecreations,
  userId,
  maRecreation,
}: {
  cocktailId: string;
  dejaRecrée: boolean;
  nbRecreations: number;
  userId: string | null;
  maRecreation?: { photo_url: string | null; note: string | null } | null;
}) {
  const [actif, setActif] = useState(dejaRecrée);
  const [count, setCount] = useState(nbRecreations);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [apercu, setApercu] = useState<string | null>(maRecreation?.photo_url ?? null);
  const [note, setNote] = useState(maRecreation?.note ?? "");
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const fichierRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!userId) {
    return (
      <a href="/connexion" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/60 hover:border-accent">
        🔁 <span>{count} recréation{count !== 1 ? "s" : ""}</span>
        <span className="text-foreground/40">· Connecte-toi pour partager la tienne</span>
      </a>
    );
  }

  function surChangementFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setApercu(URL.createObjectURL(f));
  }

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await enregistrerRecreation(cocktailId, formData);
      if (!res.ok) {
        setErreur(res.erreur ?? "Erreur inconnue");
        return;
      }
      if (!actif) {
        setCount((n) => n + 1);
        setActif(true);
      }
      if (res.photoUrl) setApercu(res.photoUrl);
      setSucces(true);
      router.refresh();
      setTimeout(() => {
        setModalOuvert(false);
        setSucces(false);
      }, 1400);
    });
  }

  function supprimer() {
    startTransition(async () => {
      await supprimerRecreation(cocktailId);
      setActif(false);
      setCount((n) => n - 1);
      setApercu(null);
      setNote("");
      setModalOuvert(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => { setModalOuvert(true); setSucces(false); }}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          actif
            ? "border-accent bg-accent/10 text-accent hover:bg-accent/20"
            : "border-border hover:border-accent hover:text-accent"
        }`}
      >
        🔁
        <span>{count} recréation{count !== 1 ? "s" : ""}</span>
        <span className="opacity-60">{actif ? "· Tu l'as faite ✓" : "· J'ai fait ce cocktail"}</span>
      </button>

      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOuvert(false)} />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            {succes ? (
              <div className="py-8 text-center">
                <p className="text-4xl mb-3">🍹</p>
                <p className="font-display text-xl text-accent">{actif && !dejaRecrée ? "Ajouté !" : "Mis à jour !"}</p>
                <p className="mt-1 text-sm text-foreground/50">Ta trace est enregistrée.</p>
              </div>
            ) : (
              <form onSubmit={soumettre}>
                <h3 className="font-display text-xl text-accent mb-1">
                  {actif ? "Modifier ta recréation" : "J'ai fait ce cocktail"}
                </h3>
                <p className="text-sm text-foreground/50 mb-5">
                  Ajoute une photo de ta version et une note si tu veux.
                </p>

                {/* Zone photo */}
                <div
                  onClick={() => fichierRef.current?.click()}
                  className="relative mb-4 flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-accent"
                >
                  {apercu
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={apercu} alt="Aperçu" className="h-full w-full object-cover" />
                    : (
                      <div className="text-center">
                        <p className="text-3xl mb-2">📸</p>
                        <p className="text-sm text-foreground/50">Ajouter une photo</p>
                        <p className="text-xs text-foreground/30 mt-1">optionnel</p>
                      </div>
                    )
                  }
                  {apercu && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium text-white">Changer la photo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fichierRef}
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="hidden"
                  onChange={surChangementFichier}
                />

                {/* Note */}
                <textarea
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajoute une note… (substitution, avis, twist perso...)"
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-foreground/40 focus:border-accent focus:outline-none resize-none"
                />
                <p className="mt-1 text-right text-xs text-foreground/30">{note.length}/300</p>

                {erreur && (
                  <p className="mt-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
                    {erreur}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {isPending ? "Enregistrement..." : actif ? "Mettre à jour" : "Valider"}
                  </button>
                  {actif && (
                    <button
                      type="button"
                      onClick={supprimer}
                      disabled={isPending}
                      className="rounded-xl border border-border px-4 py-2.5 text-sm text-foreground/50 hover:border-accent hover:text-accent disabled:opacity-50"
                    >
                      Retirer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setModalOuvert(false)}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm text-foreground/50 hover:border-accent"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
