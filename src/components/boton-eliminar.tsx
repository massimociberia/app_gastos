"use client";

import { useFormStatus } from "react-dom";
import { eliminarTransaccion } from "@/app/actions/transacciones";

export default function BotonEliminar({
  id,
  descripcion,
}: {
  id: string;
  descripcion: string;
}) {
  return (
    <form
      action={eliminarTransaccion}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar "${descripcion}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Boton descripcion={descripcion} />
    </form>
  );
}

function Boton({ descripcion }: { descripcion: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Eliminar ${descripcion}`}
      title="Eliminar"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-base leading-none opacity-40 transition hover:bg-rose-500/10 hover:text-rose-600 hover:opacity-100 disabled:opacity-20 dark:hover:text-rose-400"
    >
      {pending ? "…" : "×"}
    </button>
  );
}
