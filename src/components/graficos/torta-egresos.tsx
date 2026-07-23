"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatearARS } from "@/lib/formato";

export type PorcionCategoria = {
  categoria: string;
  monto: number;
  color: string;
};

/**
 * Torta (dona) de egresos por categoría.
 * El SVG va aria-hidden a propósito: la lista de abajo dice lo mismo con
 * palabras y números, así que es la que leen los lectores de pantalla. Esa
 * lista también es la "vista de tabla" del gráfico: ningún valor queda
 * accesible sólo pasando el mouse.
 */
export default function TortaEgresos({
  porciones,
  total,
}: {
  porciones: PorcionCategoria[];
  total: number;
}) {
  if (porciones.length === 0) {
    return (
      <p className="py-10 text-center text-sm opacity-60">
        No hay egresos en este mes.
      </p>
    );
  }

  return (
    <div>
      <div className="relative" aria-hidden>
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={porciones}
              dataKey="monto"
              nameKey="categoria"
              innerRadius="60%"
              outerRadius="90%"
              // Separación entre porciones: 2px de superficie, sin bordes.
              paddingAngle={porciones.length > 1 ? 2 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {porciones.map((p) => (
                <Cell key={p.categoria} fill={p.color} />
              ))}
            </Pie>
            <Tooltip content={<Globo total={total} />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] opacity-60">Total egresos</span>
          <span className="text-lg font-semibold">{formatearARS(total)}</span>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {porciones.map((p) => (
          <li key={p.categoria} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="min-w-0 flex-1 truncate">{p.categoria}</span>
            <span className="shrink-0 tabular-nums opacity-60">
              {porcentaje(p.monto, total)}
            </span>
            <span className="w-28 shrink-0 text-right tabular-nums">
              {formatearARS(p.monto)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function porcentaje(monto: number, total: number): string {
  if (total <= 0) return "—";
  return `${((monto / total) * 100).toLocaleString("es-AR", {
    maximumFractionDigits: 1,
  })}%`;
}

function Globo({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: readonly { name?: string | number; value?: number }[];
  total: number;
}) {
  const dato = payload?.[0];
  if (!active || !dato) return null;

  const monto = dato.value ?? 0;
  return (
    <div className="rounded-lg border border-black/10 bg-[var(--viz-surface)] px-3 py-2 text-xs shadow-sm dark:border-white/15">
      <div className="font-medium">{dato.name}</div>
      <div className="mt-0.5 tabular-nums opacity-70">
        {formatearARS(monto)} · {porcentaje(monto, total)}
      </div>
    </div>
  );
}
