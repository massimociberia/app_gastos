"use client";

import { useState } from "react";
import { nombreArchivoExport } from "@/lib/csv";
import { hoyISO } from "@/lib/formato";

const RUTA = "/api/exportar";
const TIPO = "text/csv";

type Estado = "listo" | "preparando" | "error";

/** `userAgentData` todavía no está en los tipos del DOM. */
type NavigatorConUA = Navigator & { userAgentData?: { mobile?: boolean } };

/**
 * Compartir sólo en dispositivos táctiles. Chrome de escritorio también tiene
 * Web Share (abre el panel de Windows), pero en la compu lo que se espera es
 * una descarga común y silenciosa.
 */
function convieneCompartir(): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;

  const ua = (navigator as NavigatorConUA).userAgentData;
  if (typeof ua?.mobile === "boolean") return ua.mobile;

  // Safari en iOS no tiene userAgentData: ahí decide el tipo de puntero.
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Es un <a> de verdad apuntando al endpoint: en la compu (y en cualquier
 * navegador sin Web Share) el browser descarga solo, sin JavaScript de por
 * medio. En el celular interceptamos el click y abrimos la hoja de compartir,
 * que es la forma natural de guardar o mandar un archivo ahí — sobre todo con
 * la PWA instalada, donde una descarga suelta es incómoda de encontrar.
 */
export default function BotonExportar() {
  const [estado, setEstado] = useState<Estado>("listo");

  async function alHacerClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!convieneCompartir()) return;

    e.preventDefault();
    setEstado("preparando");

    const nombre = nombreArchivoExport(hoyISO());
    let archivo: File;

    try {
      const respuesta = await fetch(RUTA);

      // Si venció la sesión, el proxy redirige al login: sin este chequeo
      // terminaríamos compartiendo el HTML del login con nombre .csv.
      if (respuesta.redirected) {
        window.location.href = respuesta.url;
        return;
      }
      if (!respuesta.ok) throw new Error(String(respuesta.status));

      archivo = new File([await respuesta.blob()], nombre, { type: TIPO });
    } catch {
      setEstado("error");
      return;
    }

    try {
      if (navigator.canShare({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: nombre });
      } else {
        descargar(archivo, nombre);
      }
    } catch (error) {
      // Cancelar la hoja de compartir no es un error.
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        // Safari a veces rechaza share() si perdió el gesto del usuario
        // mientras bajábamos el archivo: ahí lo guardamos igual.
        descargar(archivo, nombre);
      }
    }

    setEstado("listo");
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={RUTA}
        download
        onClick={alHacerClick}
        aria-busy={estado === "preparando"}
        className="rounded-lg border border-black/15 px-3 py-1.5 text-xs transition-colors hover:bg-black/5 aria-busy:opacity-60 dark:border-white/20 dark:hover:bg-white/10"
      >
        {estado === "preparando" ? "Preparando…" : "Exportar historial"}
      </a>
      {estado === "error" && (
        <span role="alert" className="text-xs text-rose-600 dark:text-rose-400">
          No se pudo exportar.
        </span>
      )}
    </div>
  );
}

function descargar(archivo: File, nombre: string) {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
