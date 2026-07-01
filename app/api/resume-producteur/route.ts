import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ erreur: "Non connecté" }, { status: 401 });
  }

  const { siteWeb } = await request.json();
  if (!siteWeb || typeof siteWeb !== "string") {
    return NextResponse.json({ erreur: "URL manquante" }, { status: 400 });
  }

  // Récupérer le contenu du site
  let contenuSite = "";
  try {
    const res = await fetch(siteWeb, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CocktailApp/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    // Extraire le texte brut (supprimer les balises HTML)
    contenuSite = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
  } catch {
    return NextResponse.json(
      { erreur: "Impossible de lire ce site. Vérifie l'URL ou utilise le remplissage manuel." },
      { status: 422 }
    );
  }

  if (!contenuSite) {
    return NextResponse.json(
      { erreur: "Le site ne contient pas de texte lisible." },
      { status: 422 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent(`
Voici le contenu textuel d'un site de producteur de boissons (distillerie, brasserie, vigneron, etc.) :

---
${contenuSite}
---

À partir de ce contenu, propose une fiche producteur pour une application de cocktails.
Réponds UNIQUEMENT avec un objet JSON brut (sans \`\`\`json, sans texte autour), avec exactement ces clés :
{
  "nom": "nom du producteur ou de la marque",
  "type": "une seule valeur parmi: distillerie, brasserie, vigneron, liquoriste, artisan, autre",
  "region": "région ou ville d'origine, ou chaîne vide si inconnue",
  "pays": "pays d'origine, par défaut France si inconnu",
  "description": "résumé en français, 100-160 mots, factuel et chaleureux : qui ils sont, leur histoire, ce qui rend leurs produits uniques, sans superlatifs marketing excessifs"
}`);

    const texte = result.response.text().trim();
    const correspondance = texte.match(/\{[\s\S]*\}/);
    if (!correspondance) {
      return NextResponse.json(
        { erreur: "Impossible d'analyser cette page. Essaie le remplissage manuel." },
        { status: 422 }
      );
    }

    const donnees = JSON.parse(correspondance[0]);
    return NextResponse.json({
      nom: donnees.nom ?? "",
      type: donnees.type ?? "autre",
      region: donnees.region ?? "",
      pays: donnees.pays ?? "France",
      description: donnees.description ?? "",
    });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
