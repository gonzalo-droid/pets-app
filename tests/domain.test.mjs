import test from "node:test";
import assert from "node:assert/strict";
import {
  canManage,
  money,
  safeRedirect,
  paymentState,
} from "../src/lib/huellas/domain.ts";
test("aislamiento: un albergue no administra a otro", () => {
  const actor = { id: "a", role: "shelter", shelter_id: "s1" };
  assert.equal(canManage(actor, "s1"), true);
  assert.equal(canManage(actor, "s2"), false);
  assert.equal(canManage({ id: "d", role: "user" }, "s1"), false);
  assert.equal(canManage({ id: "admin", role: "admin" }, "s2"), true);
});
test("montos: límites, precisión y valores malformados", () => {
  for (const n of [-1, 0, NaN, Infinity, 100001, 1.001, "abc"])
    assert.throws(() => money(n));
  for (const n of [1, 10.25, 100000]) assert.equal(money(n), n);
});
test("redirecciones solo internas", () => {
  assert.equal(safeRedirect("/profile"), "/profile");
  for (const value of [
    "//evil.com",
    "https://evil.com",
    "/\\evil.com",
    "/\nattack",
    null,
  ])
    assert.equal(safeRedirect(value), "/");
});
test("un compromiso no es un pago aprobado", () =>
  assert.equal(paymentState(), "pending"));
