import type { MetadataRoute } from "next";

// Next genera /manifest.webmanifest y agrega el <link rel="manifest"> solo.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gastos — control de gastos personales",
    short_name: "Gastos",
    description:
      "App personal para registrar y controlar ingresos y egresos.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "es-AR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
