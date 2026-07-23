/** Espejo en TypeScript de la tabla `transacciones` (ver supabase/schema.sql). */
export type Tipo = "ingreso" | "egreso";
export type Origen = "manual" | "pdf";

export type Transaccion = {
  id: string;
  fecha: string; // YYYY-MM-DD
  descripcion: string;
  monto: number;
  tipo: Tipo;
  categoria: string | null;
  cuenta: string | null;
  origen: Origen;
  usuario_id: string;
  created_at: string;
};
