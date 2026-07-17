import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";

// Police de contenu et de titres : géométrique, nette, sans-serif futuriste
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Police mono : réservée aux chiffres, labels techniques (quantités, stats, étapes)
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="texture-grid" />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
