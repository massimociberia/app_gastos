import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { traerTransacciones } from "@/lib/consultas";
import { nombreArchivoExport, transaccionesACSV } from "@/lib/csv";
import { hoyISO } from "@/lib/formato";

/** Sin esto Excel abre el archivo en ANSI y rompe los acentos y la ñ. */
const BOM = "﻿";

/**
 * Descarga todo el historial del usuario logueado en CSV.
 * RLS ya limita las filas a las propias, pero igual chequeamos sesión para
 * devolver un 401 claro en vez de un archivo vacío.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No hay sesión." }, { status: 401 });
  }

  const { transacciones, error } = await traerTransacciones({
    ascendente: true,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const nombre = nombreArchivoExport(hoyISO());

  return new NextResponse(BOM + transaccionesACSV(transacciones), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombre}"`,
      "Cache-Control": "no-store",
    },
  });
}
