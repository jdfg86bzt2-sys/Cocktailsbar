"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPES_PRODUCTEUR } from "@/lib/types";

type FiltreKey = "type" | "pays";

const DRAPEAUX: Record<string, string> = {
  France: "🇫🇷", "États-Unis": "🇺🇸", "USA": "🇺🇸", Mexique: "🇲🇽",
  Jamaïque: "🇯🇲", Cuba: "🇨🇺", Écosse: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Irlande: "🇮🇪",
  Japon: "🇯🇵", Italie: "🇮🇹", Espagne: "🇪🇸", "Royaume-Uni": "🇬🇧",
  Allemagne: "🇩🇪", Belgique: "🇧🇪", "Pays-Bas": "🇳🇱", Portugal: "🇵🇹",
  Brésil: "🇧🇷", Argentine: "🇦🇷", Pérou: "🇵🇪", Chili: "🇨🇱",
  Australie: "🇦🇺", "Nouvelle-Zélande": "🇳🇿", "Afrique du Sud": "🇿🇦",
  "République Dominicaine": "🇩🇴", Barbade: "🇧🇧", Haïti: "🇭🇹",
  Martinique: "🇫🇷", Guadeloupe: "🇫🇷", Réunion: "🇫🇷",
  Canada: "🇨🇦", Suède: "🇸🇪", Danemark: "🇩🇰", Finlande: "🇫🇮",
  Norvège: "🇳🇴", Suisse: "🇨🇭", Autriche: "🇦🇹", Grèce: "🇬🇷",
  Turquie: "🇹🇷", Maroc: "🇲🇦", Inde: "🇮🇳", Chine: "🇨🇳",
  Taiwan: "🇹🇼", Thaïlande: "🇹🇭", Vietnam: "🇻🇳",
};

export function FiltresProducteurs({
  valeurs,
  paysDisponibles,
}: {
  valeurs: { type?: string; pays?: string; q?: string };
  paysDisponibles: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ouvert, setOuvert] = useState<FiltreKey | null>(null);

  function setFiltre(key: FiltreKey, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/producteurs?${params.toString()}`);
    setOuvert(null);
  }

  function effacerTout() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("pays");
    router.push(`/producteurs?${params.toString()}`);
  }

  const filtres = [
    {
      key: "type" as FiltreKey,
      label: "Type",
      options: TYPES_PRODUCTEUR.map((t) => ({ value: t.value, label: t.label })),
    },
    {
      key: "pays" as FiltreKey,
      label: "Pays",
      options: paysDisponibles.map((p) => ({ value: p, label: `${DRAPEAUX[p] ?? "🌍"} ${p}` })),
    },
  ];

  const filtreActif = !!(valeurs.type || valeurs.pays);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        {filtres.map((f) => {
          const valeurActive = valeurs[f.key];
          const estOuvert = ouvert === f.key;
          const labelActif = f.options.find((o) => o.value === valeurActive)?.label;

          return (
            <div key={f.key} className="relative">
              <button
                type="button"
                onClick={() => setOuvert(estOuvert ? null : f.key)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  valeurActive
                    ? "border-accent bg-accent text-white"
                    : estOuvert
                    ? "border-accent text-accent"
                    : "border-border hover:border-accent"
                }`}
              >
                {valeurActive ? labelActif : f.label}
                {valeurActive
                  ? <span onClick={(e) => { e.stopPropagation(); setFiltre(f.key, undefined); }} className="ml-1 text-white/70 hover:text-white">✕</span>
                  : <span className="text-foreground/40">{estOuvert ? "▲" : "▼"}</span>
                }
              </button>

              {estOuvert && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOuvert(null)} />
                  <div className="absolute left-0 top-full z-20 mt-2 max-h-64 min-w-[180px] overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
                    {f.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFiltre(f.key, valeurActive === opt.value ? undefined : opt.value)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-surface ${
                          valeurActive === opt.value ? "text-accent font-medium" : "text-foreground"
                        }`}
                      >
                        {opt.label}
                        {valeurActive === opt.value && <span className="text-accent">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {filtreActif && (
          <button
            type="button"
            onClick={effacerTout}
            className="px-2 text-xs text-foreground/40 hover:text-accent"
          >
            Effacer tout
          </button>
        )}
      </div>
    </div>
  );
}
