import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// En Next 16 esta convención reemplaza a `middleware.ts`.
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas salvo:
     * - _next/static, _next/image, favicon
     * - archivos de la PWA (manifest, service worker, offline, íconos)
     * - imágenes estáticas
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|offline.html|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
