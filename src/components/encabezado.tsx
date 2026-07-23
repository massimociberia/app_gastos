import { cerrarSesion } from "@/app/auth/actions";

export default function Encabezado({ email }: { email?: string }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
        <p className="mt-0.5 text-xs break-all opacity-60">{email}</p>
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
  );
}
