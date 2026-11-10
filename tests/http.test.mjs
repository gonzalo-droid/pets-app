import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const base = process.env.HUELLAS_TEST_URL;
// Ejecutar contra demo local aislada: HUELLAS_TEST_URL=http://127.0.0.1:3100 npm test
// Solo crea datos de prueba dentro de .huellas-demo.
test("flujo HTTP demo completo", { skip: !base }, async () => {
  let cookie = "";
  async function call(path, body) {
    const r = await fetch(base + path, {
      method: body ? "POST" : "GET",
      redirect: "manual",
      headers: {
        Origin: base,
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const set = r.headers.get("set-cookie");
    if (set) cookie = set.split(";")[0];
    return r;
  }
  assert.equal((await call("/api/manage", { action: "need" })).status, 401);
  assert.equal(
    (await call("/api/session", { demoRole: "shelter" })).status,
    200,
  );
  assert.equal((await call("/shelter/dashboard")).status, 200);
  assert.equal(
    (
      await call("/api/manage", {
        action: "need",
        shelter_id: "shelter-002",
        title: "Cruce de tenant",
        description: "No debe poder guardarse",
        quantity: "1",
      })
    ).status,
    403,
  );
  const marker = randomUUID().slice(0, 8);
  assert.equal(
    (
      await call("/api/manage", {
        action: "need",
        title: "Necesidad de prueba " + marker,
        description: "Registro creado por una prueba HTTP local.",
        quantity: "1 saco",
      })
    ).status,
    200,
  );
  assert.match(await (await call("/needs")).text(), new RegExp(marker));
  assert.equal(
    (
      await call("/api/manage", {
        action: "animal",
        name: "Prueba " + marker,
        species: "dog",
        size: "small",
        gender: "unknown",
        description: "Animal ficticio creado en una prueba local.",
        ubigeo: "140101",
        age_months: 4,
        photos: [],
      })
    ).status,
    200,
  );
  assert.match(await (await call("/adopt")).text(), new RegExp(marker));
  assert.equal(
    (
      await call("/api/manage", {
        action: "campaign",
        title: "Campaña de prueba " + marker,
        description: "Campaña ficticia para comprobar persistencia.",
        goal_amount: 100,
      })
    ).status,
    200,
  );
  await call("/api/session", { action: "logout" });
  await call("/api/session", { demoRole: "donor" });
  assert.equal((await call("/shelter/dashboard")).status, 307);
  const key = randomUUID(),
    payload = {
      kind: "sponsorship",
      slug: "rocky-mestizo-chiclayo",
      amount: 30,
      idempotency_key: key,
    };
  const first = await (await call("/api/support", payload)).json();
  const second = await (await call("/api/support", payload)).json();
  assert.equal(first.ok, true);
  assert.equal(first.id, second.id);
  assert.match(await (await call("/profile")).text(), new RegExp(first.id));
  assert.equal(
    (
      await call("/api/support", {
        kind: "donation",
        slug: "fondo-alimentacion-patitas-chiclayo",
        amount: -1,
        idempotency_key: randomUUID(),
      })
    ).status,
    400,
  );
  assert.equal(
    (await call("/api/support", { action: "cancel", id: first.id })).status,
    200,
  );
  assert.match(await (await call("/profile")).text(), /Cancelado/);
  await call("/api/session", { demoRole: "admin" });
  assert.equal((await call("/admin")).status, 200);
  const csrf = await fetch(base + "/api/session", {
    method: "POST",
    headers: {
      Origin: "https://otro.example",
      "Content-Type": "application/json",
    },
    body: '{"demoRole":"admin"}',
  });
  assert.equal(csrf.status, 403);
});
