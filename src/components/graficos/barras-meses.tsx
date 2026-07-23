"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatearARS, formatearCompacto } from "@/lib/formato";

export type BarraMes = {
  mes: string;
  etiqueta: string;
  ingresos: number;
  egresos: number;
};

/**
 * Ingresos vs egresos, barras agrupadas.
 * Verde/rojo es la convención del resto de la app, pero ese par queda justo en
 * el límite de separación para daltonismo (protan): por eso el orden es siempre
 * el mismo (ingreso a la izquierda), hay leyenda fija y la tabla de abajo tiene
 * los números. El color nunca es el único canal.
 */
export default function BarrasMeses({ datos }: { datos: BarraMes[] }) {
  return (
    <div>
      <ul className="mb-3 flex gap-4 text-xs">
        <ClaveLeyenda color="var(--viz-ingreso)" etiqueta="Ingresos" />
        <ClaveLeyenda color="var(--viz-egreso)" etiqueta="Egresos" />
      </ul>

      <div aria-hidden>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart
            data={datos}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            barGap={2}
            barCategoryGap="24%"
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--viz-grid)"
              strokeWidth={1}
            />
            <XAxis
              dataKey="etiqueta"
              tickLine={false}
              axisLine={{ stroke: "var(--viz-axis)" }}
              tick={{ fill: "var(--viz-muted)", fontSize: 11 }}
              interval={0}
            />
            <YAxis
              tickFormatter={formatearCompacto}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--viz-muted)", fontSize: 11 }}
              width={58}
            />
            <Tooltip
              cursor={{ fill: "var(--viz-grid)", fillOpacity: 0.4 }}
              content={<Globo />}
            />
            <Bar
              dataKey="ingresos"
              name="Ingresos"
              fill="var(--viz-ingreso)"
              radius={[4, 4, 0, 0]}
              maxBarSize={26}
              isAnimationActive={false}
            />
            <Bar
              dataKey="egresos"
              name="Egresos"
              fill="var(--viz-egreso)"
              radius={[4, 4, 0, 0]}
              maxBarSize={26}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs opacity-60 hover:opacity-100">
          Ver los números
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black/10 text-left dark:border-white/15">
                <th scope="col" className="py-1.5 pr-2 font-medium">
                  Mes
                </th>
                <th scope="col" className="py-1.5 pr-2 text-right font-medium">
                  Ingresos
                </th>
                <th scope="col" className="py-1.5 text-right font-medium">
                  Egresos
                </th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d) => (
                <tr
                  key={d.mes}
                  className="border-b border-black/5 last:border-0 dark:border-white/10"
                >
                  <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                    {d.etiqueta}
                  </th>
                  <td className="py-1.5 pr-2 text-right tabular-nums">
                    {formatearARS(d.ingresos)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatearARS(d.egresos)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function ClaveLeyenda({ color, etiqueta }: { color: string; etiqueta: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="opacity-70">{etiqueta}</span>
    </li>
  );
}

function Globo({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string | number;
  payload?: readonly { name?: string | number; value?: number; fill?: string }[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-black/10 bg-[var(--viz-surface)] px-3 py-2 text-xs shadow-sm dark:border-white/15">
      <div className="font-medium">{label}</div>
      {payload.map((serie) => (
        <div key={String(serie.name)} className="mt-0.5 flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: serie.fill }}
          />
          <span className="opacity-70">{serie.name}</span>
          <span className="tabular-nums">{formatearARS(serie.value ?? 0)}</span>
        </div>
      ))}
    </div>
  );
}
