"use client";

import { useState, useEffect, useRef } from "react";

type Ingredient = { ingredient_nom: string; quantite: string | null; unite: string | null };
type Etape = { texte: string; ordre: number };

function Confettis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particules = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 6 + 3,
      d: Math.random() * 80 + 20,
      color: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      vy: Math.random() * 3 + 2,
    }));

    let frame: number;
    function dessiner() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particules.forEach((p) => {
        p.tiltAngle += p.tiltSpeed;
        p.y += p.vy;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      frame = requestAnimationFrame(dessiner);
    }
    dessiner();
    const timer = setTimeout(() => cancelAnimationFrame(frame), 3000);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" />;
}

export function ModePreparation({
  nomCocktail,
  ingredients,
  etapes,
}: {
  nomCocktail: string;
  ingredients: Ingredient[];
  etapes: Etape[];
}) {
  const [ouvert, setOuvert] = useState(false);
  const [visible, setVisible] = useState(false);
  const [etape, setEtape] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animKey, setAnimKey] = useState(0);
  const [termine, setTermine] = useState(false);

  const total = etapes.length;
  const estIngredients = etape === 0;
  const etapeActuelle = etapes[etape - 1];
  const progres = etape === 0 ? 0 : Math.round((etape / total) * 100);

  function ouvrir() {
    setEtape(0);
    setTermine(false);
    setOuvert(true);
    setTimeout(() => setVisible(true), 10);
  }

  function fermer() {
    setVisible(false);
    setTimeout(() => setOuvert(false), 350);
  }

  function suivant() {
    if (etape < total) {
      setDirection("next");
      setAnimKey((k) => k + 1);
      setEtape((e) => e + 1);
    }
  }

  function precedent() {
    if (etape > 0) {
      setDirection("prev");
      setAnimKey((k) => k + 1);
      setEtape((e) => e - 1);
    }
  }

  function terminer() {
    setTermine(true);
    setTimeout(() => fermer(), 2200);
  }

  const slideClass = direction === "next" ? "anim-slide-next" : "anim-slide-prev";

  return (
    <>
      <style>{`
        @keyframes slideInNext {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInPrev {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popCheck {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .anim-slide-next { animation: slideInNext 0.3s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-slide-prev { animation: slideInPrev 0.3s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-modal-in  { animation: slideUp   0.35s cubic-bezier(.22,.68,0,1.1) both; }
        .anim-modal-out { animation: slideDown 0.35s ease-in both; }
        .anim-fade-item { animation: fadeIn 0.4s ease both; }
        .anim-check     { animation: popCheck 0.5s cubic-bezier(.22,.68,0,1.2) both; }
      `}</style>

      <button
        onClick={ouvrir}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/70 hover:border-accent hover:text-accent transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Mode préparation
      </button>

      {ouvert && (
        <>
          {termine && <Confettis />}
          <div className={`fixed inset-0 z-50 flex flex-col bg-background ${visible ? "anim-modal-in" : "anim-modal-out"}`}>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-medium text-foreground/50">{nomCocktail}</p>
              <button onClick={fermer} className="rounded-md p-1 text-foreground/40 hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Barre de progression */}
            <div className="h-1 bg-surface overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${progres}%` }}
              />
            </div>

            {/* Contenu */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
              {termine ? (
                <div className="anim-check flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="font-display text-2xl text-accent">Bien joué !</p>
                  <p className="text-sm text-foreground/50">Ton cocktail est prêt 🍹</p>
                </div>
              ) : (
                <div key={animKey} className={slideClass} style={{ width: "100%", maxWidth: "480px" }}>
                  {estIngredients ? (
                    <>
                      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground/40">Ingrédients</p>
                      <ul className="space-y-3 text-left">
                        {ingredients.map((ing, i) => (
                          <li
                            key={i}
                            className="anim-fade-item flex items-center gap-3 text-lg"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                            <span>
                              {ing.quantite && <span className="font-semibold text-accent">{ing.quantite}{ing.unite ?? ""} </span>}
                              {ing.ingredient_nom}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                        Étape {etape} / {total}
                      </p>
                      <p className="text-2xl font-medium leading-relaxed text-foreground">
                        {etapeActuelle?.texte}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Dots navigation */}
            {!termine && (
              <div className="flex justify-center gap-1.5 pb-2">
                {Array.from({ length: total + 1 }).map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === etape
                        ? "w-5 h-1.5 bg-accent"
                        : i < etape
                        ? "w-1.5 h-1.5 bg-accent/40"
                        : "w-1.5 h-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Navigation */}
            {!termine && (
              <div className="flex items-center justify-between border-t border-border px-5 py-5">
                <button
                  onClick={precedent}
                  disabled={etape === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground/60 hover:border-accent hover:text-accent transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Précédent
                </button>

                <span className="text-sm text-foreground/30">
                  {etape === 0 ? "Ingrédients" : `${etape} / ${total}`}
                </span>

                {etape < total ? (
                  <button
                    onClick={suivant}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                  >
                    {etape === 0 ? "Commencer" : "Suivant"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={terminer}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                  >
                    Terminer
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
