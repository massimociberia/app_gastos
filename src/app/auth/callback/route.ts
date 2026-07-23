import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Destino del magic link con el template por defecto de Supabase (flujo PKCE):
 * Supabase redirige acá con ?code=... y lo canjeamos por una sesión en cookies.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Evitar open redirects: solo rutas internas.
  const destino = next.startsWith("/") ? next : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${destino}`);
    }
    return NextResponse.redirect(
      `${origin}/auth/error?motivo=${encodeURIComponent(error.message)}`,
    );
  }

  const errorDescription =
    searchParams.get("error_description") ?? "Falta el código de verificación.";
  return NextResponse.redirect(
    `${origin}/auth/error?motivo=${encodeURIComponent(errorDescription)}`,
  );
}
