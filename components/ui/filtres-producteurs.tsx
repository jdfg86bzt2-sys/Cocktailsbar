"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPES_PRODUCTEUR } from "@/lib/types";

type FiltreKey = "type" | "pays";

export const PAYS_LISTE: { label: string; drapeau: string }[] = [
  { label: "France", drapeau: "🇫🇷" },
  { label: "Belgique", drapeau: "🇧🇪" },
  { label: "Suisse", drapeau: "🇨🇭" },
  { label: "Luxembourg", drapeau: "🇱🇺" },
  { label: "Italie", drapeau: "🇮🇹" },
  { label: "Espagne", drapeau: "🇪🇸" },
  { label: "Portugal", drapeau: "🇵🇹" },
  { label: "Allemagne", drapeau: "🇩🇪" },
  { label: "Autriche", drapeau: "🇦🇹" },
  { label: "Pays-Bas", drapeau: "🇳🇱" },
  { label: "Royaume-Uni", drapeau: "🇬🇧" },
  { label: "Écosse", drapeau: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { label: "Irlande", drapeau: "🇮🇪" },
  { label: "Suède", drapeau: "🇸🇪" },
  { label: "Danemark", drapeau: "🇩🇰" },
  { label: "Norvège", drapeau: "🇳🇴" },
  { label: "Finlande", drapeau: "🇫🇮" },
  { label: "Pologne", drapeau: "🇵🇱" },
  { label: "République Tchèque", drapeau: "🇨🇿" },
  { label: "Grèce", drapeau: "🇬🇷" },
  { label: "Turquie", drapeau: "🇹🇷" },
  { label: "Russie", drapeau: "🇷🇺" },
  { label: "États-Unis", drapeau: "🇺🇸" },
  { label: "Canada", drapeau: "🇨🇦" },
  { label: "Mexique", drapeau: "🇲🇽" },
  { label: "Cuba", drapeau: "🇨🇺" },
  { label: "Jamaïque", drapeau: "🇯🇲" },
  { label: "Barbade", drapeau: "🇧🇧" },
  { label: "Haïti", drapeau: "🇭🇹" },
  { label: "République Dominicaine", drapeau: "🇩🇴" },
  { label: "Trinidad-et-Tobago", drapeau: "🇹🇹" },
  { label: "Martinique", drapeau: "🇫🇷" },
  { label: "Guadeloupe", drapeau: "🇫🇷" },
  { label: "Brésil", drapeau: "🇧🇷" },
  { label: "Argentine", drapeau: "🇦🇷" },
  { label: "Chili", drapeau: "🇨🇱" },
  { label: "Pérou", drapeau: "🇵🇪" },
  { label: "Colombie", drapeau: "🇨🇴" },
  { label: "Venezuela", drapeau: "🇻🇪" },
  { label: "Uruguay", drapeau: "🇺🇾" },
  { label: "Bolivie", drapeau: "🇧🇴" },
  { label: "Japon", drapeau: "🇯🇵" },
  { label: "Chine", drapeau: "🇨🇳" },
  { label: "Taiwan", drapeau: "🇹🇼" },
  { label: "Corée du Sud", drapeau: "🇰🇷" },
  { label: "Inde", drapeau: "🇮🇳" },
  { label: "Thaïlande", drapeau: "🇹🇭" },
  { label: "Vietnam", drapeau: "🇻🇳" },
  { label: "Philippines", drapeau: "🇵🇭" },
  { label: "Singapour", drapeau: "🇸🇬" },
  { label: "Indonésie", drapeau: "🇮🇩" },
  { label: "Australie", drapeau: "🇦🇺" },
  { label: "Nouvelle-Zélande", drapeau: "🇳🇿" },
  { label: "Afrique du Sud", drapeau: "🇿🇦" },
  { label: "Maroc", drapeau: "🇲🇦" },
  { label: "Tunisie", drapeau: "🇹🇳" },
  { label: "Algérie", drapeau: "🇩🇿" },
  { label: "Éthiopie", drapeau: "🇪🇹" },
  { label: "Israël", drapeau: "🇮🇱" },
  { label: "Liban", drapeau: "🇱🇧" },
];

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
  const [recherchePays, setRecherchePays] = useState("");

  function setFiltre(key: FiltreKey, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/producteurs?${params.toString()}`);
    setOuvert(null);
    setRecherchePays("");
  }

  function effacerTout() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("pays");
    router.push(`/producteurs?${params.toString()}`);
  }

  const paysFiltres = PAYS_LISTE.filter((p) =>
    recherchePays === "" || p.label.toLowerCase().includes(recherchePays.toLowerCase())
  );

  const filtreActif = !!(valeurs.type || valeurs.pays);
  const labelPaysActif = PAYS_LISTE.find((p) => p.label === valeurs.pays)?.label;
  const drapeauPaysActif = PAYS_LISTE.find((p) => p.label === valeurs.pays)?.drapeau ?? "🌍";

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">

        {/* Filtre Type */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOuvert(ouvert === "type" ? null : "type"); setRecherchePays(""); }}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              valeurs.type ? "border-accent bg-accent text-white"
              : ouvert === "type" ? "border-accent text-accent"
              : "border-border hover:border-accent"
            }`}
          >
            {valeurs.type
              ? TYPES_PRODUCTEUR.find((t) => t.value === valeurs.type)?.label
              : "Type"}
            {valeurs.type
              ? <span onClick={(e) => { e.stopPropagation(); setFiltre("type", undefined); }} className="ml-1 text-white/70 hover:text-white">✕</span>
              : <span className="text-foreground/40">{ouvert === "type" ? "▲" : "▼"}</span>
            }
          </button>

          {ouvert === "type" && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOuvert(null)} />
              <div className="absolute left-0 top-full z-20 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                {TYPES_PRODUCTEUR.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFiltre("type", valeurs.type === t.value ? undefined : t.value)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-surface ${
                      valeurs.type === t.value ? "text-accent font-medium" : "text-foreground"
                    }`}
                  >
                    {t.label}
                    {valeurs.type === t.value && <span className="text-accent">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filtre Pays */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOuvert(ouvert === "pays" ? null : "pays"); setRecherchePays(""); }}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              valeurs.pays ? "border-accent bg-accent text-white"
              : ouvert === "pays" ? "border-accent text-accent"
              : "border-border hover:border-accent"
            }`}
          >
            {valeurs.pays
              ? <>{drapeauPaysActif} {labelPaysActif ?? valeurs.pays}</>
              : "🌍 Pays"}
            {valeurs.pays
              ? <span onClick={(e) => { e.stopPropagation(); setFiltre("pays", undefined); }} className="ml-1 text-white/70 hover:text-white">✕</span>
              : <span className="text-foreground/40">{ouvert === "pays" ? "▲" : "▼"}</span>
            }
          </button>

          {ouvert === "pays" && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => { setOuvert(null); setRecherchePays(""); }} />
              <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                {/* Recherche dans la liste */}
                <div className="border-b border-border px-3 py-2">
                  <input
                    autoFocus
                    value={recherchePays}
                    onChange={(e) => setRecherchePays(e.target.value)}
                    placeholder="Rechercher un pays…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {paysFiltres.length === 0 && (
                    <p className="px-4 py-3 text-sm text-foreground/40">Aucun résultat</p>
                  )}
                  {paysFiltres.map((p) => {
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFiltre("pays", valeurs.pays === p.label ? undefined : p.label)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-surface ${
                          valeurs.pays === p.label ? "text-accent font-medium" : "text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{p.drapeau}</span>
                          <span>{p.label}</span>
                        </span>
                        {valeurs.pays === p.label && <span className="text-accent">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {filtreActif && (
          <button type="button" onClick={effacerTout} className="px-2 text-xs text-foreground/40 hover:text-accent">
            Effacer tout
          </button>
        )}
      </div>
    </div>
  );
}
