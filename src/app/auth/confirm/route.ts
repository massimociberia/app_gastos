import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Alternativa al flujo PKCE: sirve si editás el template de email de Supabase
 * para que apunte a {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
 * Ventaja: el link funciona aunque lo abras en otro navegador o dispositivo.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const destino = next.startsWith("/") ? next : "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${destino}`);
    }
    return NextResponse.redirect(
      `${origin}/auth/error?motivo=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/error?motivo=${encodeURIComponent("Link inválido o incompleto.")}`,
  );
}
