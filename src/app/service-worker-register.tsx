"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // En dev conviene no registrarlo para no pelear con el hot reload.
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Si falla, la app sigue funcionando como web normal.
    });
  }, []);

  return null;
}
