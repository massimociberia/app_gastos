/**
 * Categorías disponibles en el formulario.
 * Para agregar/sacar una, editá sólo esta lista: el selector, la validación
 * del server action y los colores de la lista salen todos de acá.
 */
export const CATEGORIAS = [
  "Comida",
  "Transporte",
  "Suscripciones",
  "Alquiler",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Otros",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Categoría preseleccionada en el formulario. */
export const CATEGORIA_POR_DEFECTO: Categoria = "Otros";

export function esCategoriaValida(valor: unknown): valor is Categoria {
  return (
    typeof valor === "string" && (CATEGORIAS as readonly string[]).includes(valor)
  );
}

/** Sugerencias iniciales para el campo Cuenta (es texto libre igual). */
export const CUENTAS_SUGERIDAS = ["Efectivo", "Tarjeta", "Débito", "Transferencia"];
