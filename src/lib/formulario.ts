/**
 * Resultado del alta de una transacción.
 * Vive acá y no en el archivo de server actions porque un módulo `"use server"`
 * sólo puede exportar funciones async.
 */
export type CampoFormulario =
  | "monto"
  | "descripcion"
  | "tipo"
  | "categoria"
  | "cuenta"
  | "fecha";

export type EstadoFormulario = {
  ok: boolean;
  /** Error general (sesión caída, falla de Supabase). */
  error?: string;
  /** Errores de validación, por campo. */
  errores?: Partial<Record<CampoFormulario, string>>;
};

export const ESTADO_INICIAL: EstadoFormulario = { ok: false };
