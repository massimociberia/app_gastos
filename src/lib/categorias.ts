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

/**
 * Color de cada categoría en los gráficos. El color sigue a la categoría, no a
 * su posición en el ranking: si un mes Comida deja de ser la más grande, sigue
 * siendo azul. Los valores están en globals.css (`.viz`), que resuelve claro y
 * oscuro. Si agregás una categoría, asignale el slot libre que sigue: los 8
 * tonos son un orden validado y no hay que inventar uno nuevo.
 */
export const COLOR_CATEGORIA: Record<Categoria, string> = {
  Comida: "var(--viz-1)",
  Transporte: "var(--viz-2)",
  Suscripciones: "var(--viz-3)",
  Alquiler: "var(--viz-4)",
  Servicios: "var(--viz-5)",
  Entretenimiento: "var(--viz-6)",
  Salud: "var(--viz-7)",
  Otros: "var(--viz-8)",
};

/** Color para categorías viejas o desconocidas que no están en la lista. */
export const COLOR_SIN_CATEGORIA = "var(--viz-resto)";

export function colorDeCategoria(categoria: string | null): string {
  return esCategoriaValida(categoria)
    ? COLOR_CATEGORIA[categoria]
    : COLOR_SIN_CATEGORIA;
}
