import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");

const FROM = "Barre de Cocktails <notifications@barredecocktails.fr>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cocktailsbar.vercel.app";

export async function envoyerNotifNouveauCocktail({
  destinataireEmail,
  destinatairePseudo,
  createurPseudo,
  cocktailNom,
  cocktailId,
}: {
  destinataireEmail: string;
  destinatairePseudo: string;
  createurPseudo: string;
  cocktailNom: string;
  cocktailId: string;
}) {
  const lien = `${BASE_URL}/cocktails/${cocktailId}`;

  await resend.emails.send({
    from: FROM,
    to: destinataireEmail,
    subject: `${createurPseudo} vient de publier : ${cocktailNom}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#E2231A;padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">
                BARRE DE COCKTAILS
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:14px;color:#888888;">
                Bonjour ${destinatairePseudo},
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
                <strong style="color:#ffffff;">${createurPseudo}</strong>, que tu suis, vient de publier une nouvelle recette :
              </p>
              <div style="background:#1a1a1a;border-left:3px solid #E2231A;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
                <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${cocktailNom}</p>
              </div>
              <a href="${lien}" style="display:inline-block;background:#E2231A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:700;font-size:15px;">
                Voir la recette →
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;font-size:12px;color:#555555;line-height:1.6;">
                Tu reçois cet email car tu as activé les notifications pour ${createurPseudo}.<br>
                Pour désactiver, rends-toi sur <a href="${BASE_URL}/profil" style="color:#E2231A;text-decoration:none;">son profil</a> et désactive la cloche 🔔.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
