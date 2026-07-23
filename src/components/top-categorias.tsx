import { colorDeCategoria } from "@/lib/categorias";
import { formatearARS } from "@/lib/formato";
import type { TotalCategoria } from "@/lib/agregados";

/** Las categorías donde más gastaste en el mes, con el total de cada una. */
export default function TopCategorias({
  totales,
  cantidad = 3,
}: {
  totales: TotalCategoria[];
  cantidad?: number;
}) {
  const top = totales.slice(0, cantidad);

  if (top.length === 0) {
    return (
      <p className="py-6 text-center text-sm opacity-60">
        Todavía no hay egresos para rankear.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {top.map((t, i) => (
        <li key={t.categoria} className="flex items-center gap-3">
          <span className="w-4 shrink-0 text-sm tabular-nums opacity-40">
            {i + 1}
          </span>
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: colorDeCategoria(t.categoria) }}
          />
          <span className="min-w-0 flex-1 truncate text-sm">{t.categoria}</span>
          <span className="shrink-0 text-sm font-medium tabular-nums">
            {formatearARS(t.monto)}
          </span>
        </li>
      ))}
    </ol>
  );
}
