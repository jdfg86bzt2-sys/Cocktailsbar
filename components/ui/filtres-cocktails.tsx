"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES_ALCOOL, TAGS_GOUT, TECHNIQUES } from "@/lib/types";

const FILTRES = [
  {
    key: "alcool",
    label: "Alcool",
    options: CATEGORIES_ALCOOL.map((c) => ({ value: c, label: c })),
  },
  {
    key: "tag",
    label: "Goût",
    options: TAGS_GOUT.map((t) => ({ value: t, label: t })),
  },
  {
    key: "technique",
    label: "Technique",
    options: TECHNIQUES.map((t) => ({ value: t.value, label: t.label })),
  },
] as const;

type FiltreKey = "alcool" | "tag" | "technique";

export function FiltresCocktails({
  valeurs,
}: {
  valeurs: { alcool?: string; tag?: string; technique?: string; signature?: string; q?: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ouvert, setOuvert] = useState<FiltreKey | null>(null);

  function setFiltre(key: FiltreKey, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/cocktails?${params.toString()}`);
    setOuvert(null);
  }

  function toggleSignature() {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("signature") === "1") params.delete("signature");
    else params.set("signature", "1");
    router.push(`/cocktails?${params.toString()}`);
  }

  function effacerTout() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("alcool");
    params.delete("tag");
    params.delete("technique");
    params.delete("signature");
    router.push(`/cocktails?${params.toString()}`);
  }

  const filtreActif = !!(valeurs.alcool || valeurs.tag || valeurs.technique || valeurs.signature);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTRES.map((f) => {
          const valeurActive = valeurs[f.key];
          const estOuvert = ouvert === f.key;
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
                {valeurActive
                  ? f.options.find((o) => o.value === valeurActive)?.label ?? f.label
                  : f.label}
                {valeurActive
                  ? <span onClick={(e) => { e.stopPropagation(); setFiltre(f.key, undefined); }} className="ml-1 text-white/70 hover:text-white">✕</span>
                  : <span className="text-foreground/40">{estOuvert ? "▲" : "▼"}</span>
                }
              </button>

              {estOuvert && (
                <>
                  {/* Overlay pour fermer */}
                  <div className="fixed inset-0 z-10" onClick={() => setOuvert(null)} />
                  <div className="absolute left-0 top-full z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
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

        {/* Signature */}
        <button
          type="button"
          onClick={toggleSignature}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            valeurs.signature === "1"
              ? "border-accent bg-accent text-white"
              : "border-border hover:border-accent"
          }`}
        >
          ✦ Signature
          {valeurs.signature === "1" && (
            <span
              onClick={(e) => { e.stopPropagation(); toggleSignature(); }}
              className="ml-1.5 text-white/70 hover:text-white"
            >✕</span>
          )}
        </button>

        {filtreActif && (
          <button
            type="button"
            onClick={effacerTout}
            className="text-xs text-foreground/40 hover:text-accent px-2"
          >
            Effacer tout
          </button>
        )}
      </div>
    </div>
  );
}
