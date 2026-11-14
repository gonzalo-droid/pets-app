import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
const owner = "10000000-0000-4000-8000-000000000001",
  other = "10000000-0000-4000-8000-000000000002",
  donor = "20000000-0000-4000-8000-000000000001";
const s1 = "30000000-0000-4000-8000-000000000001",
  s2 = "30000000-0000-4000-8000-000000000002";
test("migraciones, seed y seguridad PostgreSQL", async (t) => {
  const db = new PGlite({ extensions: { pgcrypto, uuid_ossp } });
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,instance_id uuid,aud text,role text,email text,encrypted_password text,email_confirmed_at timestamptz,raw_app_meta_data jsonb,raw_user_meta_data jsonb,is_super_admin boolean,created_at timestamptz,updated_at timestamptz,confirmation_token text,email_change text,email_change_token_new text,recovery_token text);
 CREATE TABLE auth.identities(id uuid PRIMARY KEY,provider_id text,user_id uuid,identity_data jsonb,provider text,created_at timestamptz,updated_at timestamptz,UNIQUE(provider_id,provider));
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 GRANT USAGE ON SCHEMA public,auth TO anon,authenticated; GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated;`);
    for (const f of [
      "202611090001_legacy_baseline.sql",
      "202611090002_huellas.sql",
      "202611100001_huellas_fixes.sql",
      "202611100002_anon_sightings_read.sql",
      "202611100003_request_transitions.sql",
      "202611110001_photo_uploads.sql",
      "202611110002_shelter_onboarding.sql",
      "202611140001_campaign_kinds.sql",
    ])
      await db.exec(
        await readFile(
          new URL("../supabase/migrations/" + f, import.meta.url),
          "utf8",
        ),
      );
    await db.exec(
      await readFile(new URL("../supabase/seed.sql", import.meta.url), "utf8"),
    );
    async function asUser(id, fn) {
      await db.exec(
        `SET ROLE authenticated; SELECT set_config('request.jwt.claim.sub','${id}',false);`,
      );
      try {
        return await fn();
      } finally {
        await db.exec("RESET ROLE");
      }
    }
    await t.test("metadata no concede admin", async () => {
      const id = "90000000-0000-4000-8000-000000000001";
      await db.exec(
        `INSERT INTO auth.users(id,raw_user_meta_data)VALUES('${id}','{"role":"admin","full_name":"Intruso"}')`,
      );
      assert.equal(
        (await db.query(`SELECT role FROM profiles WHERE id='${id}'`)).rows[0]
          .role,
        "user",
      );
    });
    await t.test("no se puede ascender rol ni autoverificar", async () =>
      asUser(owner, async () => {
        await assert.rejects(
          db.exec(`UPDATE profiles SET role='admin' WHERE id='${owner}'`),
        );
        await assert.rejects(
          db.exec(`UPDATE shelters SET is_verified=true WHERE id='${s1}'`),
        );
        await assert.rejects(db.exec(`SELECT verify_shelter('${s1}',true)`));
      }),
    );
    await t.test(
      "aislamiento en escritura y privacidad de perfiles",
      async () =>
        asUser(owner, async () => {
          const result = await db.query(
            `UPDATE shelters SET name='Intrusión' WHERE id='${s2}' RETURNING id`,
          );
          assert.equal(result.rows.length, 0);
          assert.equal(
            (await db.query(`SELECT id FROM profiles WHERE id='${other}'`)).rows
              .length,
            0,
          );
          await assert.rejects(
            db.exec(
              `INSERT INTO needs(shelter_id,title,description,quantity)VALUES('${s2}','Invadido','Descripción de intrusión','1')`,
            ),
          );
        }),
    );
    await t.test('alta de animal y fotos es atómica y respeta el tenant', async () => asUser(owner, async () => {
      const animal={id:'70000000-0000-4000-8000-000000000001',shelter_id:s1,name:'Milo',species:'dog',size:'small',gender:'unknown',description:'Animal ficticio para verificar la función SQL.',age_months:8,slug:'milo-sql-test',ubigeo:'140101',is_vaccinated:true,is_neutered:false,is_microchipped:false};
      const result=await db.query('SELECT create_animal_with_photos($1::jsonb,$2::jsonb) AS id',[JSON.stringify(animal),JSON.stringify(['https://images.unsplash.com/test.jpg'])]);
      assert.equal(result.rows[0].id,animal.id);
      assert.equal((await db.query(`SELECT * FROM animal_photos WHERE animal_id='${animal.id}'`)).rows.length,1);
      const invalid={...animal,id:'70000000-0000-4000-8000-000000000002',slug:'milo-invalid'};
      await assert.rejects(db.query('SELECT create_animal_with_photos($1::jsonb,$2::jsonb)',[JSON.stringify(invalid),JSON.stringify(['http://invalid.example/photo.jpg'])]));
      assert.equal((await db.query(`SELECT * FROM animals WHERE id='${invalid.id}'`)).rows.length,0);
      await assert.rejects(db.query('SELECT create_animal_with_photos($1::jsonb,$2::jsonb)',[JSON.stringify({...invalid,shelter_id:s2}),JSON.stringify([])]));
    }));
    await t.test("tipos de campaña: caso, fondo y evento", async () =>
      asUser(owner, async () => {
        const ins = (slug, extra) =>
          db.query(
            `INSERT INTO donation_campaigns(shelter_id,title,goal_amount,slug,kind,animal_id,event_at,event_place)
             VALUES('${s1}','Prueba',100,'${slug}',$1,$2,$3,$4) RETURNING kind`,
            extra,
          );
        assert.equal((await ins("evento-ok", ["event", null, "2027-01-10T15:00:00Z", "Parque principal"])).rows[0].kind, "event");
        await assert.rejects(ins("evento-sin-lugar", ["event", null, "2027-01-10T15:00:00Z", null]));
        await assert.rejects(ins("caso-sin-animal", ["case", null, null, null]));
        await assert.rejects(ins("fondo-con-fecha", ["fund", null, "2027-01-10T15:00:00Z", "Parque"]));
        await assert.rejects(ins("tipo-raro", ["other", null, null, null]));
      }));
    const target = (
      await db.query(
        `SELECT id,slug FROM donation_campaigns WHERE shelter_id='${s1}' LIMIT 1`,
      )
    ).rows[0];
    let supportId;
    await t.test(
      "compromiso idempotente sin incrementar recaudación",
      async () =>
        asUser(donor, async () => {
          const q = `SELECT pledge_support('donation','${target.id}',null,30,'80000000-0000-4000-8000-000000000001') AS id`;
          supportId = (await db.query(q)).rows[0].id;
          assert.equal((await db.query(q)).rows[0].id, supportId);
          assert.equal(
            (
              await db.query(
                `SELECT status FROM support_intents WHERE id='${supportId}'`,
              )
            ).rows[0].status,
            "pending",
          );
          assert.equal(
            Number(
              (
                await db.query(
                  `SELECT current_amount FROM donation_campaigns WHERE id='${target.id}'`,
                )
              ).rows[0].current_amount,
            ),
            0,
          );
          await assert.rejects(
            db.exec(
              `UPDATE support_intents SET status='paid' WHERE id='${supportId}'`,
            ),
          );
          await assert.rejects(
            db.exec(
              `SELECT pledge_support('donation','${target.id}',null,-1,gen_random_uuid())`,
            ),
          );
        }),
    );
    await t.test("otro albergue no ve ni cancela el compromiso", async () =>
      asUser(other, async () => {
        assert.equal(
          (
            await db.query(
              `SELECT * FROM support_intents WHERE id='${supportId}'`,
            )
          ).rows.length,
          0,
        );
        await assert.rejects(db.exec(`SELECT cancel_support('${supportId}')`));
      }),
    );
    await t.test("donante puede cancelar su compromiso", async () =>
      asUser(donor, async () => {
        await db.exec(`SELECT cancel_support('${supportId}')`);
        assert.equal(
          (
            await db.query(
              `SELECT status FROM support_intents WHERE id='${supportId}'`,
            )
          ).rows[0].status,
          "cancelled",
        );
      }),
    );
    await t.test("solo una solicitud de adopción activa por animal", async () => {
      const animal = (
        await db.query(
          `SELECT id FROM animals WHERE shelter_id='${s1}' AND status='available' LIMIT 1`,
        )
      ).rows[0];
      const insert = (id) =>
        db.exec(`INSERT INTO adoption_requests(id,animal_id,shelter_id,requester_id,message,phone,status)
          VALUES('${id}','${animal.id}','${s1}','${donor}','Mensaje ficticio para la prueba de solicitudes.','999999999','pending')`);
      const first = "71000000-0000-4000-8000-000000000001";
      await asUser(donor, async () => {
        await insert(first);
        await assert.rejects(insert("71000000-0000-4000-8000-000000000002"));
      });
      await asUser(owner, () =>
        db.exec(`UPDATE adoption_requests SET status='rejected' WHERE id='${first}'`),
      );
      // Tras el rechazo puede volver a postular.
      await asUser(donor, () => insert("71000000-0000-4000-8000-000000000003"));
    });
    await t.test("solo cambios de estado permitidos en solicitudes", async () => {
      const animal = (
        await db.query(
          `SELECT id FROM animals WHERE shelter_id='${s1}' AND status='available' OFFSET 1 LIMIT 1`,
        )
      ).rows[0];
      const rid = "72000000-0000-4000-8000-000000000001";
      await asUser(donor, () =>
        db.exec(`INSERT INTO adoption_requests(id,animal_id,shelter_id,requester_id,message,phone,status)
          VALUES('${rid}','${animal.id}','${s1}','${donor}','Mensaje ficticio para probar transiciones de estado.','999999999','pending')`),
      );
      await asUser(owner, async () => {
        const set = (st) => db.exec(`UPDATE adoption_requests SET status='${st}' WHERE id='${rid}'`);
        await assert.rejects(set("completed")); // completar exige aprobar antes
        await set("approved");
        await set("completed");
        await assert.rejects(set("pending")); // completada es final
      });
    });
    await t.test("registro de albergue: queda sin verificar y no se repite", async () => {
      const nuevo = "93000000-0000-4000-8000-000000000001";
      await db.exec(
        `INSERT INTO auth.users(id,raw_user_meta_data)VALUES('${nuevo}','{"full_name":"Responsable"}')`,
      );
      const sid = await asUser(nuevo, async () =>
        (await db.query(
          "SELECT request_shelter('Refugio Nuevo','Rescatamos perros y gatos en la ciudad.','140101','987654321') AS id",
        )).rows[0].id,
      );
      const row = (await db.query(`SELECT is_verified, profile_id FROM shelters WHERE id='${sid}'`)).rows[0];
      assert.equal(row.is_verified, false);
      assert.equal(row.profile_id, nuevo);
      assert.equal((await db.query(`SELECT role FROM profiles WHERE id='${nuevo}'`)).rows[0].role, "shelter");
      await asUser(nuevo, async () => {
        // Ya es albergue: no puede registrar otro ni autoverificarse.
        await assert.rejects(db.query("SELECT request_shelter('Otro','Descripción suficientemente larga.','140101',null)"));
        await assert.rejects(db.exec(`UPDATE shelters SET is_verified=true WHERE id='${sid}'`));
      });
      // Un visitante anónimo no lo ve mientras no esté verificado.
      await db.exec("SET ROLE anon; SELECT set_config('request.jwt.claim.sub','',false);");
      try {
        assert.equal((await db.query(`SELECT id FROM shelters WHERE id='${sid}'`)).rows.length, 0);
      } finally {
        await db.exec("RESET ROLE");
      }
    });
  } finally {
    await db.close();
  }
});
