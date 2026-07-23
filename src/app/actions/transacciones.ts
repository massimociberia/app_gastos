"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { esCategoriaValida } from "@/lib/categorias";
import { MONTO_MAXIMO, esFechaISO, parsearMonto } from "@/lib/formato";
import type { EstadoFormulario } from "@/lib/formulario";

const MAX_DESCRIPCION = 200;
const MAX_CUENTA = 60;

export async function crearTransaccion(
  formData: FormData,
): Promise<EstadoFormulario> {
  const errores: EstadoFormulario["errores"] = {};

  const monto = parsearMonto(String(formData.get("monto") ?? ""));
  if (monto === null) {
    errores.monto = "Poné un número.";
  } else if (monto <= 0) {
    errores.monto = "Tiene que ser mayor a cero.";
  } else if (monto > MONTO_MAXIMO) {
    errores.monto = "Demasiado grande.";
  }

  const descripcion = String(formData.get("descripcion") ?? "").trim();
  if (descripcion === "") {
    errores.descripcion = "No puede quedar vacía.";
  } else if (descripcion.length > MAX_DESCRIPCION) {
    errores.descripcion = `Máximo ${MAX_DESCRIPCION} caracteres.`;
  }

  const tipo = String(formData.get("tipo") ?? "");
  if (tipo !== "ingreso" && tipo !== "egreso") {
    errores.tipo = "Elegí ingreso o egreso.";
  }

  const categoria = String(formData.get("categoria") ?? "");
  if (!esCategoriaValida(categoria)) {
    errores.categoria = "Categoría desconocida.";
  }

  const cuenta = String(formData.get("cuenta") ?? "").trim();
  if (cuenta.length > MAX_CUENTA) {
    errores.cuenta = `Máximo ${MAX_CUENTA} caracteres.`;
  }

  const fecha = String(formData.get("fecha") ?? "");
  if (!esFechaISO(fecha)) {
    errores.fecha = "Fecha inválida.";
  }

  if (Object.keys(errores).length > 0) {
    return { ok: false, errores };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Se cerró tu sesión. Volvé a entrar." };
  }

  const { error } = await supabase.from("transacciones").insert({
    fecha,
    descripcion,
    monto,
    tipo,
    categoria,
    cuenta: cuenta === "" ? null : cuenta,
    origen: "manual",
    usuario_id: user.id,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function eliminarTransaccion(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (id === "") return;

  const supabase = await createClient();
  // La política de RLS ya limita el delete a las filas propias.
  await supabase.from("transacciones").delete().eq("id", id);

  revalidatePath("/");
}
