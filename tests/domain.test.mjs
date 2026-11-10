import test from "node:test";
import assert from "node:assert/strict";
import {
  canManage,
  money,
  safeRedirect,
  paymentState,
  isCampaignOpen,
  canTransitionRequest,
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

test("una campaña vencida o inactiva está cerrada", () => {
  const now = Date.parse("2026-11-10T12:00:00Z");
  assert.equal(isCampaignOpen({ is_active: true, ends_at: null }, now), true);
  assert.equal(isCampaignOpen({ is_active: true, ends_at: "2026-12-01T00:00:00Z" }, now), true);
  assert.equal(isCampaignOpen({ is_active: true, ends_at: "2026-11-01T00:00:00Z" }, now), false);
  assert.equal(isCampaignOpen({ is_active: false, ends_at: null }, now), false);
});

test("transiciones de solicitudes de adopción", () => {
  assert.equal(canTransitionRequest("pending", "approved"), true);
  assert.equal(canTransitionRequest("pending", "completed"), false);
  assert.equal(canTransitionRequest("approved", "completed"), true);
  assert.equal(canTransitionRequest("completed", "pending"), false);
  assert.equal(canTransitionRequest("rejected", "reviewing"), false);
});
