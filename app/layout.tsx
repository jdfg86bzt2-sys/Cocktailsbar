import type { Metadata } from "next";
import { Barlow_Condensed, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";

// Police de contenu : nette et très lisible (recettes, descriptions)
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Police "feutre/graffiti" : réservée aux titres, logo, badges (jamais au texte courant)
const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Barre de Cocktails",
  description:
    "Plateforme communautaire pour barmans et amateurs : cocktails, créations signature et petits producteurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${barlowCondensed.variable} ${permanentMarker.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="texture-grain" />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
