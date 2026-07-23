import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Transaccion } from "@/lib/types";

const POR_PAGINA = 1000; // tope que devuelve PostgREST por request
const MAX_PAGINAS = 20;

/**
 * Trae las transacciones del rango [desde, hasta), paginando.
 * Sin la paginación, a partir de las 1000 filas PostgREST corta la respuesta
 * sin avisar y los totales darían mal de forma silenciosa.
 */
export async function traerTransacciones(
  desde: string,
  hasta: string,
): Promise<{ transacciones: Transaccion[]; error: string | null }> {
  const supabase = await createClient();
  const filas: Transaccion[] = [];

  for (let pagina = 0; pagina < MAX_PAGINAS; pagina++) {
    const inicio = pagina * POR_PAGINA;

    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .gte("fecha", desde)
      .lt("fecha", hasta)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false })
      .range(inicio, inicio + POR_PAGINA - 1);

    if (error) return { transacciones: filas, error: error.message };

    // `numeric` puede llegar como string según el driver: lo normalizamos acá.
    filas.push(...(data ?? []).map((t) => ({ ...t, monto: Number(t.monto) })));

    if ((data?.length ?? 0) < POR_PAGINA) break;
  }

  return { transacciones: filas, error: null };
}
