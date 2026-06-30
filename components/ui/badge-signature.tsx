// Badge "Signature certifiée" style tampon dessiné au feutre
// Réservé aux créations signatures des barmans certifiés.
// IMPORTANT : ce badge certifie l'attribution (premier à publier, crédité),
// PAS une propriété légale. Une recette ne peut pas être possédée légalement.
export function BadgeSignature({ taille = "md" }: { taille?: "sm" | "md" | "lg" }) {
  const tailles = {
    sm: "w-14 h-14 text-[9px]",
    md: "w-20 h-20 text-[11px]",
    lg: "w-28 h-28 text-[13px]",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${tailles[taille]}`}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cercle extérieur irrégulier style tampon feutre */}
        <path
          d="M50 5 C58 4, 70 6, 78 12 C86 18, 93 28, 95 38 C97 48, 95 60, 90 70 C85 80, 76 88, 65 92 C54 96, 42 95, 32 90 C22 85, 13 76, 8 65 C3 54, 4 41, 9 31 C14 21, 24 13, 35 8 C42 5, 44 6, 50 5 Z"
          fill="none"
          stroke="#e2231a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Cercle intérieur */}
        <path
          d="M50 15 C56 14, 65 16, 72 21 C79 26, 84 34, 85 43 C86 52, 83 62, 78 69 C73 76, 64 81, 55 82 C46 83, 37 80, 30 74 C23 68, 18 59, 17 50 C16 41, 20 31, 26 24 C32 17, 42 16, 50 15 Z"
          fill="none"
          stroke="#e2231a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      {/* Texte centré style feutre */}
      <div className="font-display relative z-10 text-center leading-tight text-accent">
        <div className="font-bold">SIG.</div>
        <div style={{ fontSize: "0.65em" }} className="opacity-80">CERTIFIÉE</div>
      </div>
    </div>
  );
}
