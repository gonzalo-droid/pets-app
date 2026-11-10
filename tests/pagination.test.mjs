import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanSearch,
  fetchPage,
  ilikeAny,
  parsePage,
  queryWithoutPage,
  slicePage,
} from "../src/lib/pagination.ts";

test("número de página válido", () => {
  for (const [raw, page] of [
    [undefined, 1],
    ["", 1],
    ["0", 1],
    ["-3", 1],
    ["abc", 1],
    ["2.7", 2],
    ["5", 5],
  ])
    assert.equal(parsePage(raw), page, String(raw));
});

test("recorte en memoria y página fuera de rango", () => {
  const rows = Array.from({ length: 10 }, (_, i) => i);
  assert.deepEqual(slicePage(rows, 2, 4), {
    items: [4, 5, 6, 7],
    total: 10,
    page: 2,
    totalPages: 3,
  });
  assert.deepEqual(slicePage(rows, 99, 4).items, [8, 9]);
  assert.deepEqual(slicePage([], 3, 4), { items: [], total: 0, page: 1, totalPages: 1 });
});

test("consulta paginada pide solo el rango y corrige páginas fuera de rango", async () => {
  const rows = Array.from({ length: 7 }, (_, i) => i);
  const calls = [];
  const run = async (from, to) => {
    calls.push([from, to]);
    return { data: rows.slice(from, to + 1), count: rows.length, error: null };
  };
  assert.deepEqual(await fetchPage(run, 2, 3, "t"), {
    items: [3, 4, 5],
    total: 7,
    page: 2,
    totalPages: 3,
  });
  assert.deepEqual(calls, [[3, 5]]);
  const last = await fetchPage(run, 50, 3, "t");
  assert.equal(last.page, 3);
  assert.deepEqual(last.items, [6]);
  await assert.rejects(
    fetchPage(async () => ({ data: null, count: null, error: { message: "x" } }), 1, 3, "t"),
  );
  // Supabase real: una página fuera de rango responde error 416 (PGRST103).
  const strict = async (from, to) =>
    from >= rows.length
      ? { data: null, count: null, error: { message: "range", code: "PGRST103" } }
      : { data: rows.slice(from, to + 1), count: rows.length, error: null };
  const clamped = await fetchPage(strict, 99, 3, "t");
  assert.equal(clamped.page, 3);
  assert.deepEqual(clamped.items, [6]);
});

test("la búsqueda no puede inyectar filtros de PostgREST", () => {
  assert.equal(cleanSearch("  Rocky  "), "rocky");
  assert.equal(cleanSearch("a,status.eq.adopted)"), "a status.eq.adopted");
  assert.equal(cleanSearch("50%_*"), "50");
  assert.equal(cleanSearch(undefined), "");
  assert.equal(cleanSearch("x".repeat(200)).length, 80);
  assert.equal(ilikeAny(["name", "breed"], "rocky"), "name.ilike.%rocky%,breed.ilike.%rocky%");
});

test("los enlaces de página conservan los demás filtros", () => {
  assert.equal(queryWithoutPage({ species: "dog", q: "", page: "3", size: undefined }), "species=dog");
});
