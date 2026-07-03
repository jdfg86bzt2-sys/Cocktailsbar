"use client";

import { useState, useEffect, useRef } from "react";

type Ingredient = { ingredient_nom: string; quantite: string | null; unite: string | null };
type Etape = { texte: string; ordre: number };

function detecterIllustration(texte: string): string {
  const t = texte.toLowerCase();
  if (/secoue|shake|shaker/.test(t)) return "shaker";
  if (/mélange|remue|touill|cuillèr|barre?/.test(t)) return "remuer";
  if (/verse|ajoute|complète|rempli/.test(t)) return "verser";
  if (/presse|exprim|zeste|citron|agrume/.test(t)) return "presser";
  if (/glac|glaçon/.test(t)) return "glace";
  if (/filtr|passe|pass|tamis|chinoi/.test(t)) return "filtrer";
  if (/écrас|pile|écrase|muddl/.test(t)) return "ecraser";
  return "";
}

function IllustrationEtape({ type }: { type: string }) {
  if (!type) return null;

  const illustrations: Record<string, React.ReactNode> = {
    shaker: (
      <svg viewBox="0 0 80 120" className="w-24 h-32">
        <style>{`
          @keyframes shake { 0%,100%{transform:rotate(-8deg) translateX(-3px)} 50%{transform:rotate(8deg) translateX(3px)} }
          .shaker-body { animation: shake 0.4s ease-in-out infinite; transform-origin: center; }
        `}</style>
        <g className="shaker-body">
          <rect x="28" y="10" width="24" height="10" rx="3" fill="currentColor" opacity="0.3"/>
          <path d="M24 20 L20 95 Q20 105 40 105 Q60 105 60 95 L56 20Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
          <line x1="20" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
          <line x1="22" y1="55" x2="58" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
          <ellipse cx="40" cy="75" rx="10" ry="4" fill="currentColor" opacity="0.1"/>
        </g>
      </svg>
    ),
    remuer: (
      <svg viewBox="0 0 80 110" className="w-24 h-28">
        <style>{`
          @keyframes stir { 0%{transform:rotate(-20deg) translateX(-4px)} 50%{transform:rotate(20deg) translateX(4px)} 100%{transform:rotate(-20deg) translateX(-4px)} }
          .spoon { animation: stir 0.8s ease-in-out infinite; transform-origin: 40px 20px; }
        `}</style>
        <path d="M22 20 Q22 95 40 100 Q58 95 58 20Z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2"/>
        <line x1="22" y1="45" x2="58" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
        <g className="spoon">
          <line x1="40" y1="18" x2="40" y2="85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
          <ellipse cx="40" cy="88" rx="6" ry="4" fill="currentColor" opacity="0.5"/>
        </g>
      </svg>
    ),
    verser: (
      <svg viewBox="0 0 80 110" className="w-24 h-28">
        <style>{`
          @keyframes drop1 { 0%,100%{opacity:0;transform:translateY(0)} 40%{opacity:1} 80%{opacity:0;transform:translateY(30px)} }
          @keyframes drop2 { 0%,100%{opacity:0;transform:translateY(0)} 20%{opacity:0} 60%{opacity:1} 90%{opacity:0;transform:translateY(30px)} }
          .drop1 { animation: drop1 1.2s ease-in infinite; }
          .drop2 { animation: drop2 1.2s ease-in infinite 0.3s; }
          @keyframes tilt { 0%,100%{transform:rotate(-30deg) translate(-5px,-5px)} 50%{transform:rotate(-35deg) translate(-6px,-4px)} }
          .bottle { animation: tilt 2s ease-in-out infinite; transform-origin: 55px 30px; }
        `}</style>
        <g className="bottle">
          <rect x="42" y="10" width="28" height="40" rx="6" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="52" y="6" width="8" height="8" rx="2" fill="currentColor" opacity="0.4"/>
        </g>
        <ellipse cx="38" cy="55" rx="4" ry="3" fill="currentColor" opacity="0.6" className="drop1"/>
        <ellipse cx="34" cy="58" rx="3" ry="2.5" fill="currentColor" opacity="0.5" className="drop2"/>
        <path d="M14 75 Q14 100 40 100 Q66 100 66 75Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    presser: (
      <svg viewBox="0 0 80 100" className="w-24 h-24">
        <style>{`
          @keyframes squeeze { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(0.85) translateY(4px)} }
          @keyframes dropJuice { 0%,60%{opacity:0;transform:translateY(0)} 70%{opacity:1} 100%{opacity:0;transform:translateY(20px)} }
          .juicer { animation: squeeze 1s ease-in-out infinite; transform-origin: 40px 60px; }
          .juice { animation: dropJuice 1s ease-in infinite; }
        `}</style>
        <g className="juicer">
          <ellipse cx="40" cy="55" rx="22" ry="16" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M30 48 Q40 35 50 48" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
          <path d="M32 54 Q40 45 48 54" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          <path d="M18 55 Q18 70 40 70 Q62 70 62 55" fill="currentColor" opacity="0.1"/>
        </g>
        <ellipse cx="37" cy="74" rx="3" ry="4" fill="currentColor" opacity="0.5" className="juice"/>
        <ellipse cx="43" cy="76" rx="2.5" ry="3" fill="currentColor" opacity="0.4" className="juice" style={{animationDelay:"0.3s"}}/>
      </svg>
    ),
    glace: (
      <svg viewBox="0 0 80 100" className="w-24 h-24">
        <style>{`
          @keyframes fall1 { 0%{opacity:0;transform:translateY(-10px) rotate(0deg)} 30%{opacity:1} 100%{opacity:0;transform:translateY(50px) rotate(30deg)} }
          @keyframes fall2 { 0%{opacity:0;transform:translateY(-10px) rotate(0deg)} 50%{opacity:1} 100%{opacity:0;transform:translateY(40px) rotate(-20deg)} }
          .ice1 { animation: fall1 1.4s ease-in infinite; }
          .ice2 { animation: fall2 1.4s ease-in infinite 0.4s; }
          .ice3 { animation: fall1 1.4s ease-in infinite 0.8s; }
        `}</style>
        <rect x="28" y="10" width="14" height="14" rx="3" fill="currentColor" opacity="0.5" className="ice1"/>
        <rect x="46" y="15" width="12" height="12" rx="3" fill="currentColor" opacity="0.4" className="ice2"/>
        <rect x="36" y="8" width="10" height="10" rx="2" fill="currentColor" opacity="0.3" className="ice3"/>
        <path d="M14 70 Q14 95 40 95 Q66 95 66 70Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="14" y1="70" x2="66" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
      </svg>
    ),
    filtrer: (
      <svg viewBox="0 0 80 110" className="w-24 h-28">
        <style>{`
          @keyframes drip { 0%,100%{opacity:0;transform:translateY(0)} 40%{opacity:1} 90%{opacity:0;transform:translateY(18px)} }
          .drip1 { animation: drip 1.1s ease-in infinite; }
          .drip2 { animation: drip 1.1s ease-in infinite 0.4s; }
          .drip3 { animation: drip 1.1s ease-in infinite 0.7s; }
        `}</style>
        <path d="M15 20 L40 20 L65 20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M15 20 L30 50 Q40 60 50 50 L65 20Z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="30" y1="46" x2="50" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="3 2"/>
        <circle cx="32" cy="65" r="2.5" fill="currentColor" opacity="0.5" className="drip1"/>
        <circle cx="40" cy="68" r="2" fill="currentColor" opacity="0.4" className="drip2"/>
        <circle cx="48" cy="65" r="2.5" fill="currentColor" opacity="0.5" className="drip3"/>
        <path d="M22 85 Q22 105 40 105 Q58 105 58 85Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    ecraser: (
      <svg viewBox="0 0 80 110" className="w-24 h-28">
        <style>{`
          @keyframes mash { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
          .muddler { animation: mash 0.7s ease-in-out infinite; }
        `}</style>
        <g className="muddler">
          <rect x="34" y="8" width="12" height="45" rx="3" fill="currentColor" opacity="0.3"/>
          <rect x="30" y="50" width="20" height="12" rx="3" fill="currentColor" opacity="0.5"/>
        </g>
        <ellipse cx="40" cy="78" rx="8" ry="4" fill="currentColor" opacity="0.4"/>
        <ellipse cx="33" cy="80" rx="4" ry="2" fill="currentColor" opacity="0.3"/>
        <ellipse cx="47" cy="79" rx="5" ry="2.5" fill="currentColor" opacity="0.3"/>
        <path d="M18 82 Q18 105 40 105 Q62 105 62 82Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  };

  return (
    <div className="mb-6 flex justify-center text-accent opacity-80">
      {illustrations[type]}
    </div>
  );
}

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
                      <IllustrationEtape type={detecterIllustration(etapeActuelle?.texte ?? "")} />
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
