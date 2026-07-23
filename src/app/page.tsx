import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "./auth/actions";
import FormularioTransaccion from "@/components/formulario-transaccion";
import ListaTransacciones from "@/components/lista-transacciones";
import ResumenMes from "@/components/resumen-mes";
import SelectorMes from "@/components/selector-mes";
import type { Transaccion } from "@/lib/types";
import { esMesValido, hoyISO, mesActual, rangoMes } from "@/lib/formato";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { mes: mesPedido } = await searchParams;
  const mesDeHoy = mesActual();
  const mes = esMesValido(mesPedido) ? mesPedido : mesDeHoy;
  const { desde, hasta } = rangoMes(mes);

  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .gte("fecha", desde)
    .lt("fecha", hasta)
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  // `numeric` puede llegar como string según el driver: lo normalizamos acá.
  const transacciones: Transaccion[] = (data ?? []).map((t) => ({
    ...t,
    monto: Number(t.monto),
  }));

  const ingresos = sumar(transacciones, "ingreso");
  const egresos = sumar(transacciones, "egreso");

  const cuentasConocidas = Array.from(
    new Set(transacciones.map((t) => t.cuenta).filter((c): c is string => !!c)),
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
          <p className="mt-0.5 text-xs break-all opacity-60">{user.email}</p>
        </div>
        <form action={cerrarSesion}>
          <button
            type="submit"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Salir
          </button>
        </form>
      </header>

      <SelectorMes mes={mes} mesDeHoy={mesDeHoy} />

      <ResumenMes ingresos={ingresos} egresos={egresos} />

      {/* key={mes}: al cambiar de mes el formulario se rearma con la fecha nueva. */}
      <FormularioTransaccion
        key={mes}
        fechaPorDefecto={mes === mesDeHoy ? hoyISO() : desde}
        cuentasConocidas={cuentasConocidas}
      />

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-500/30 p-4 text-sm text-rose-600 dark:text-rose-400"
        >
          No pudimos traer las transacciones: {error.message}
        </p>
      ) : (
        <ListaTransacciones transacciones={transacciones} />
      )}
    </main>
  );
}

function sumar(transacciones: Transaccion[], tipo: Transaccion["tipo"]): number {
  const total = transacciones
    .filter((t) => t.tipo === tipo)
    .reduce((acc, t) => acc + t.monto, 0);
  // Evita los 0.30000000000000004 de la suma en punto flotante.
  return Math.round(total * 100) / 100;
}
