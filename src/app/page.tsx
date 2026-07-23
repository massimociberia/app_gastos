import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "./auth/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-5 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
          <p className="mt-1 text-sm break-all opacity-70">{user.email}</p>
        </div>
        <form action={cerrarSesion}>
          <button
            type="submit"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Salir
          </button>
        </form>
      </header>

      <section className="rounded-xl border border-black/10 p-5 dark:border-white/15">
        <h2 className="text-sm font-medium">Fase 1 lista</h2>
        <ul className="mt-3 space-y-1.5 text-sm opacity-70">
          <li>Next.js + TypeScript + Tailwind</li>
          <li>Supabase conectado</li>
          <li>Login por magic link</li>
          <li>
            Tabla <code>transacciones</code> con RLS
          </li>
          <li>PWA instalable</li>
        </ul>
        <p className="mt-4 text-sm opacity-70">
          Carga de gastos, dashboard e importación de PDF vienen después.
        </p>
      </section>
    </main>
  );
}
