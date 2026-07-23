import { test } from "node:test";
import assert from "node:assert/strict";
import {
  totalPorTipo,
  egresosPorCategoria,
  agruparCola,
  totalesPorMes,
} from "../src/lib/agregados.ts";

let id = 0;
const t = (fecha, tipo, monto, categoria = "Otros") => ({
  id: String(++id),
  fecha,
  descripcion: "x",
  monto,
  tipo,
  categoria,
  cuenta: null,
  origen: "manual",
  usuario_id: "u",
  created_at: "",
});

test("totalPorTipo suma sólo el tipo pedido", () => {
  const datos = [
    t("2026-07-01", "egreso", 100),
    t("2026-07-02", "ingreso", 500),
    t("2026-07-03", "egreso", 50.5),
  ];
  assert.equal(totalPorTipo(datos, "egreso"), 150.5);
  assert.equal(totalPorTipo(datos, "ingreso"), 500);
  assert.equal(totalPorTipo([], "egreso"), 0);
});

test("totalPorTipo no arrastra error de punto flotante", () => {
  const datos = [
    t("2026-07-01", "egreso", 0.1),
    t("2026-07-02", "egreso", 0.2),
  ];
  assert.equal(totalPorTipo(datos, "egreso"), 0.3);
});

test("egresosPorCategoria agrupa, ordena y descarta ingresos", () => {
  const datos = [
    t("2026-07-01", "egreso", 100, "Comida"),
    t("2026-07-02", "egreso", 300, "Alquiler"),
    t("2026-07-03", "egreso", 50, "Comida"),
    t("2026-07-04", "ingreso", 9999, "Comida"),
  ];
  assert.deepEqual(egresosPorCategoria(datos), [
    { categoria: "Alquiler", monto: 300 },
    { categoria: "Comida", monto: 150 },
  ]);
});

test("egresosPorCategoria no pierde las filas sin categoría", () => {
  const sinCategoria = { ...t("2026-07-01", "egreso", 80), categoria: null };
  assert.deepEqual(egresosPorCategoria([sinCategoria]), [
    { categoria: "Sin categoría", monto: 80 },
  ]);
});

test("agruparCola deja pasar las listas cortas", () => {
  const totales = [
    { categoria: "A", monto: 3 },
    { categoria: "B", monto: 2 },
  ];
  assert.deepEqual(agruparCola(totales, 6), { visibles: totales, agrupadas: 0 });
});

test("agruparCola junta la cola en una sola porción", () => {
  const totales = [
    { categoria: "A", monto: 10 },
    { categoria: "B", monto: 8 },
    { categoria: "C", monto: 6 },
    { categoria: "D", monto: 4 },
    { categoria: "E", monto: 2 },
  ];
  const { visibles, agrupadas } = agruparCola(totales, 3);

  assert.equal(agrupadas, 3);
  assert.equal(visibles.length, 3);
  assert.deepEqual(visibles[2], {
    categoria: "Otras (3)",
    monto: 12,
    esResto: true,
  });
  // El total no se pierde en el camino.
  const suma = visibles.reduce((acc, v) => acc + v.monto, 0);
  assert.equal(suma, 30);
});

test("totalesPorMes devuelve un cero por cada mes vacío", () => {
  const meses = ["2026-05", "2026-06", "2026-07"];
  const datos = [
    t("2026-05-15", "ingreso", 1000),
    t("2026-07-02", "egreso", 250),
    t("2026-07-20", "egreso", 250),
  ];
  assert.deepEqual(totalesPorMes(datos, meses), [
    { mes: "2026-05", ingresos: 1000, egresos: 0 },
    { mes: "2026-06", ingresos: 0, egresos: 0 },
    { mes: "2026-07", ingresos: 0, egresos: 500 },
  ]);
});

test("totalesPorMes ignora lo que cae fuera del rango", () => {
  const datos = [t("2026-01-10", "egreso", 999)];
  assert.deepEqual(totalesPorMes(datos, ["2026-07"]), [
    { mes: "2026-07", ingresos: 0, egresos: 0 },
  ]);
});
