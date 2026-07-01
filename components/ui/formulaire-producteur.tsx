"use client";

import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { TYPES_PRODUCTEUR } from "@/lib/types";

type Etape = "choix" | "analyse" | "formulaire";

type DonneesProducteur = {
  nom: string;
  type: string;
  region: string;
  pays: string;
  description: string;
  site_web: string;
};

const VIDE: DonneesProducteur = {
  nom: "",
  type: "autre",
  region: "",
  pays: "France",
  description: "",
  site_web: "",
};

export function FormulaireProducteur({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  const [etape, setEtape] = useState<Etape>("choix");
  const [urlSaisie, setUrlSaisie] = useState("");
  const [erreurIA, setErreurIA] = useState<string | null>(null);
  const [donnees, setDonnees] = useState<DonneesProducteur>(VIDE);

  async function analyserSite() {
    if (!urlSaisie) {
      setErreurIA("Colle d'abord un lien vers le site du producteur.");
      return;
    }
    setErreurIA(null);
    setEtape("analyse");

    try {
      const res = await fetch("/api/resume-producteur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteWeb: urlSaisie }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreurIA(data.erreur ?? "Erreur lors de l'analyse.");
        setEtape("choix");
        return;
      }

      setDonnees({
        nom: data.nom,
        type: data.type,
        region: data.region,
        pays: data.pays,
        description: data.description,
        site_web: urlSaisie,
      });
      setEtape("formulaire");
    } catch {
      setErreurIA("Erreur réseau lors de l'analyse.");
      setEtape("choix");
    }
  }

  function demarrerManuel() {
    setDonnees(VIDE);
    setEtape("formulaire");
  }

  // Étape 1 : choix du mode
  if (etape === "choix" || etape === "analyse") {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xl text-accent">✨ Via l&apos;IA</h2>
          <p className="mt-1 text-sm text-foreground/60">
            Colle le site du producteur, l&apos;IA propose la fiche (nom, type, région,
            description). Tu pourras tout modifier avant de publier.
          </p>
          <div className="mt-3 flex gap-2">
            <Input
              value={urlSaisie}
              onChange={(e) => setUrlSaisie(e.target.value)}
              placeholder="https://exemple-distillerie.fr"
              disabled={etape === "analyse"}
            />
            <Button type="button" onClick={analyserSite} disabled={etape === "analyse"}>
              {etape === "analyse" ? "Analyse..." : "Analyser"}
            </Button>
          </div>
          {erreurIA && <p className="mt-2 text-sm text-accent">{erreurIA}</p>}
        </div>

        <div className="flex items-center gap-3 text-sm text-foreground/40">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="secondary" onClick={demarrerManuel}>
          ✍️ Remplissage manuel
        </Button>
      </div>
    );
  }

  // Étape 2 : formulaire (pré-rempli par l'IA ou vide), toujours modifiable
  return (
    <form action={action} className="flex flex-col gap-5">
      {donnees.nom || donnees.description ? (
        <p className="rounded border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-foreground/80">
          Fiche générée par l&apos;IA à partir du site fourni — relis et corrige avant de publier.
        </p>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Nom du producteur *</label>
        <Input
          name="nom"
          required
          defaultValue={donnees.nom}
          key={`nom-${donnees.nom}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Type *</label>
          <select
            name="type"
            required
            defaultValue={donnees.type}
            key={`type-${donnees.type}`}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
          >
            {TYPES_PRODUCTEUR.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Région</label>
          <Input
            name="region"
            placeholder="Ex: Bretagne, Cognac..."
            defaultValue={donnees.region}
            key={`region-${donnees.region}`}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Pays</label>
        <Input name="pays" defaultValue={donnees.pays} key={`pays-${donnees.pays}`} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={5}
          placeholder="Qui sont-ils ? Qu'est-ce qui rend leurs produits uniques ?"
          defaultValue={donnees.description}
          key={`description-${donnees.description}`}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Site web</label>
        <Input
          name="site_web"
          type="url"
          placeholder="https://..."
          defaultValue={donnees.site_web}
          key={`site-${donnees.site_web}`}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Photo <span className="text-foreground/50">(optionnel)</span>
        </label>
        <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
      </div>

      <div className="flex gap-3">
        <Button type="submit">Publier la fiche</Button>
        <Button type="button" variant="secondary" onClick={() => setEtape("choix")}>
          ← Recommencer
        </Button>
      </div>
    </form>
  );
}
