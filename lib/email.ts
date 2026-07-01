import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");

const FROM = "Barre de Cocktails <notifications@barredecocktails.fr>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cocktailsbar.vercel.app";

function layoutEmail(contenu: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
          <tr>
            <td style="background:#E2231A;padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">BARRE DE COCKTAILS</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">${contenu}</td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;font-size:12px;color:#555555;">
                <a href="${BASE_URL}" style="color:#E2231A;text-decoration:none;">barredecocktails.fr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function envoyerConfirmationSuggestion({
  destinataireEmail,
  destinatairePseudo,
  type,
  nom,
  accepte,
  lien,
}: {
  destinataireEmail: string;
  destinatairePseudo: string;
  type: "cocktail" | "twist" | "producteur";
  nom: string;
  accepte: boolean;
  lien?: string;
}) {
  const labels: Record<typeof type, string> = {
    cocktail: "cocktail",
    twist: "twist",
    producteur: "producteur",
  };
  const label = labels[type];

  const sujetEmoji = accepte ? "✅" : "❌";
  const sujet = accepte
    ? `${sujetEmoji} Ta demande de ${label} a été acceptée : ${nom}`
    : `${sujetEmoji} Ta demande de ${label} a été refusée : ${nom}`;

  const contenu = accepte
    ? `<p style="margin:0 0 8px;font-size:14px;color:#888888;">Bonjour ${destinatairePseudo},</p>
       <p style="margin:0 0 20px;font-size:16px;color:#cccccc;line-height:1.6;">
         Bonne nouvelle ! Ta demande de ${label} a été <strong style="color:#4ade80;">acceptée</strong> et est maintenant en ligne :
       </p>
       <div style="background:#1a1a1a;border-left:3px solid #E2231A;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
         <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${nom}</p>
       </div>
       ${lien ? `<a href="${lien}" style="display:inline-block;background:#E2231A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:700;font-size:15px;">Voir la fiche →</a>` : ""}`
    : `<p style="margin:0 0 8px;font-size:14px;color:#888888;">Bonjour ${destinatairePseudo},</p>
       <p style="margin:0 0 20px;font-size:16px;color:#cccccc;line-height:1.6;">
         Ta demande de ${label} n'a pas pu être acceptée en l'état :
       </p>
       <div style="background:#1a1a1a;border-left:3px solid #555555;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
         <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${nom}</p>
       </div>
       <p style="margin:0;font-size:14px;color:#888888;line-height:1.6;">
         Si tu penses que c'est une erreur, n'hésite pas à soumettre à nouveau ta demande avec plus de détails.
       </p>`;

  await resend.emails.send({
    from: FROM,
    to: destinataireEmail,
    subject: sujet,
    html: layoutEmail(contenu),
  });
}
