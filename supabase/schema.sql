-- HUELLAS: instalación nueva. NO ejecutar sobre una base existente.
-- ============================================================
-- PawRescue — Schema inicial
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- ============================================================

-- ── Extensiones ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE user_role       AS ENUM ('user', 'shelter', 'admin');
CREATE TYPE animal_species  AS ENUM ('dog', 'cat', 'other');
CREATE TYPE animal_size     AS ENUM ('small', 'medium', 'large');
CREATE TYPE animal_gender   AS ENUM ('male', 'female', 'unknown');
CREATE TYPE animal_status   AS ENUM ('available', 'in_process', 'adopted', 'lost', 'found', 'reunited');
CREATE TYPE adoption_status AS ENUM ('pending', 'reviewing', 'approved', 'rejected', 'completed');
CREATE TYPE report_type     AS ENUM ('lost', 'found');
CREATE TYPE payment_status  AS ENUM ('pending', 'approved', 'rejected', 'refunded');

-- ── Trigger: updated_at automático ───────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── Tabla: profiles ──────────────────────────────────────────
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL,
  avatar_url  TEXT,
  phone       TEXT,
  ubigeo      CHAR(6),
  role        user_role   NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Tabla: shelters ──────────────────────────────────────────
CREATE TABLE shelters (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  description     TEXT,
  long_description TEXT,
  address         TEXT,
  ubigeo          CHAR(6)     NOT NULL,
  phone           TEXT,
  email           TEXT,
  whatsapp        TEXT,
  instagram       TEXT,
  facebook        TEXT,
  tiktok          TEXT,
  avatar_url      TEXT,
  banner_url      TEXT,
  is_verified     BOOLEAN     NOT NULL DEFAULT FALSE,
  yape_number     TEXT,
  bank_account    TEXT,
  bank_name       TEXT,
  account_holder  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_shelters_updated_at
  BEFORE UPDATE ON shelters
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Tabla: shelter_photos ────────────────────────────────────
CREATE TABLE shelter_photos (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id  UUID    NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
  url         TEXT    NOT NULL,
  order_index INT     NOT NULL DEFAULT 0
);

-- ── Tabla: animals ───────────────────────────────────────────
CREATE TABLE animals (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id      UUID            NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
  posted_by       UUID            NOT NULL REFERENCES profiles(id),
  name            TEXT            NOT NULL,
  species         animal_species  NOT NULL,
  breed           TEXT,
  age_months      INT,
  size            animal_size     NOT NULL,
  gender          animal_gender   NOT NULL DEFAULT 'unknown',
  color           TEXT,
  description     TEXT,
  is_vaccinated   BOOLEAN         NOT NULL DEFAULT FALSE,
  is_neutered     BOOLEAN         NOT NULL DEFAULT FALSE,
  is_microchipped BOOLEAN         NOT NULL DEFAULT FALSE,
  status          animal_status   NOT NULL DEFAULT 'available',
  ubigeo          CHAR(6)         NOT NULL,
  slug            TEXT            NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_animals_shelter_id ON animals(shelter_id);
CREATE INDEX idx_animals_status     ON animals(status);
CREATE INDEX idx_animals_species    ON animals(species);

CREATE TRIGGER trg_animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Tabla: animal_photos ─────────────────────────────────────
CREATE TABLE animal_photos (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id   UUID    NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  url         TEXT    NOT NULL,
  is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INT     NOT NULL DEFAULT 0
);

CREATE INDEX idx_animal_photos_animal_id ON animal_photos(animal_id);

-- ── Tabla: adoption_requests ─────────────────────────────────
CREATE TABLE adoption_requests (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id       UUID            NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  requester_id    UUID            NOT NULL REFERENCES profiles(id),
  shelter_id      UUID            NOT NULL REFERENCES shelters(id),
  message         TEXT,
  has_home        BOOLEAN         NOT NULL DEFAULT FALSE,
  has_other_pets  BOOLEAN         NOT NULL DEFAULT FALSE,
  has_children    BOOLEAN         NOT NULL DEFAULT FALSE,
  phone           TEXT            NOT NULL,
  status          adoption_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_adoption_requests_shelter_id   ON adoption_requests(shelter_id);
CREATE INDEX idx_adoption_requests_requester_id ON adoption_requests(requester_id);

CREATE TRIGGER trg_adoption_requests_updated_at
  BEFORE UPDATE ON adoption_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Tabla: lost_found_reports ────────────────────────────────
CREATE TABLE lost_found_reports (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id         UUID        REFERENCES animals(id),
  reported_by       UUID        NOT NULL REFERENCES profiles(id),
  type              report_type NOT NULL,
  description       TEXT        NOT NULL,
  last_seen_at      TIMESTAMPTZ NOT NULL,
  last_seen_address TEXT,
  ubigeo            CHAR(6)     NOT NULL,
  reward_amount     NUMERIC(10,2),
  contact_phone     TEXT        NOT NULL,
  is_resolved       BOOLEAN     NOT NULL DEFAULT FALSE,
  photo_urls        TEXT[],
  slug              TEXT        NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lost_reports_type        ON lost_found_reports(type);
CREATE INDEX idx_lost_reports_is_resolved ON lost_found_reports(is_resolved);
CREATE INDEX idx_lost_reports_reported_by ON lost_found_reports(reported_by);

CREATE TRIGGER trg_lost_reports_updated_at
  BEFORE UPDATE ON lost_found_reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Tabla: lost_found_sightings ──────────────────────────────
CREATE TABLE lost_found_sightings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   UUID        NOT NULL REFERENCES lost_found_reports(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id),
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sightings_report_id ON lost_found_sightings(report_id);

-- ── Tabla: donation_campaigns ────────────────────────────────
CREATE TABLE donation_campaigns (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id      UUID        NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
  animal_id       UUID        REFERENCES animals(id),
  title           TEXT        NOT NULL,
  description     TEXT,
  goal_amount     NUMERIC(10,2) NOT NULL CHECK (goal_amount > 0),
  current_amount  NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  ends_at         TIMESTAMPTZ,
  slug            TEXT        NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_shelter_id ON donation_campaigns(shelter_id);
CREATE INDEX idx_campaigns_is_active  ON donation_campaigns(is_active);

CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON donation_campaigns
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Tabla: donations ─────────────────────────────────────────
CREATE TABLE donations (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID           NOT NULL REFERENCES donation_campaigns(id),
  donor_id         UUID           NOT NULL REFERENCES profiles(id),
  amount           NUMERIC(10,2)  NOT NULL CHECK (amount > 0),
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  receipt_url      TEXT,
  is_anonymous     BOOLEAN        NOT NULL DEFAULT FALSE,
  message          TEXT,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX idx_donations_donor_id    ON donations(donor_id);

CREATE TRIGGER trg_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelters           ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelter_photos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_photos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations          ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_all"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE USING (auth.uid() = id);

-- shelters
CREATE POLICY "shelters_select_all"   ON shelters FOR SELECT USING (true);
CREATE POLICY "shelters_insert_own"   ON shelters FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "shelters_update_own"   ON shelters FOR UPDATE USING (auth.uid() = profile_id);

-- shelter_photos
CREATE POLICY "shelter_photos_select_all" ON shelter_photos FOR SELECT USING (true);
CREATE POLICY "shelter_photos_insert_own" ON shelter_photos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));
CREATE POLICY "shelter_photos_delete_own" ON shelter_photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));

-- animals
CREATE POLICY "animals_select_all"   ON animals FOR SELECT USING (true);
CREATE POLICY "animals_insert_own"   ON animals FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));
CREATE POLICY "animals_update_own"   ON animals FOR UPDATE
  USING (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));

-- animal_photos
CREATE POLICY "animal_photos_select_all" ON animal_photos FOR SELECT USING (true);
CREATE POLICY "animal_photos_insert_own" ON animal_photos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM animals a
    JOIN shelters s ON s.id = a.shelter_id
    WHERE a.id = animal_id AND s.profile_id = auth.uid()
  ));

-- adoption_requests
CREATE POLICY "requests_select_requester" ON adoption_requests FOR SELECT
  USING (auth.uid() = requester_id OR
         EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));
CREATE POLICY "requests_insert_auth"      ON adoption_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "requests_update_shelter"   ON adoption_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));

-- lost_found_reports
CREATE POLICY "reports_select_all"    ON lost_found_reports FOR SELECT USING (true);
CREATE POLICY "reports_insert_auth"   ON lost_found_reports FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "reports_update_own"    ON lost_found_reports FOR UPDATE USING (auth.uid() = reported_by);

-- lost_found_sightings
CREATE POLICY "sightings_select_all"  ON lost_found_sightings FOR SELECT USING (true);
CREATE POLICY "sightings_insert_auth" ON lost_found_sightings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- donation_campaigns
CREATE POLICY "campaigns_select_all"  ON donation_campaigns FOR SELECT USING (true);
CREATE POLICY "campaigns_insert_own"  ON donation_campaigns FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));
CREATE POLICY "campaigns_update_own"  ON donation_campaigns FOR UPDATE
  USING (EXISTS (SELECT 1 FROM shelters WHERE id = shelter_id AND profile_id = auth.uid()));

-- donations
CREATE POLICY "donations_select_own_or_shelter" ON donations FOR SELECT
  USING (auth.uid() = donor_id OR
         EXISTS (SELECT 1 FROM donation_campaigns c
                 JOIN shelters s ON s.id = c.shelter_id
                 WHERE c.id = campaign_id AND s.profile_id = auth.uid()));
CREATE POLICY "donations_insert_auth" ON donations FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "donations_update_shelter" ON donations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM donation_campaigns c
                 JOIN shelters s ON s.id = c.shelter_id
                 WHERE c.id = campaign_id AND s.profile_id = auth.uid()));

-- Upgrade no destructivo del esquema PawRescue. Aplicar en transacción.
BEGIN;
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 INSERT INTO public.profiles(id,full_name,role) VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'full_name',''),80),'user');
 RETURN NEW;
END $$;
-- La metadata elegida por el usuario nunca concede un rol privilegiado.
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT EXISTS(SELECT 1 FROM profiles WHERE id=auth.uid() AND role='admin')
$$;
CREATE OR REPLACE FUNCTION public.manages(target uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT public.is_admin() OR EXISTS(SELECT 1 FROM shelters s JOIN profiles p ON p.id=s.profile_id WHERE s.id=target AND p.id=auth.uid() AND p.role='shelter')
$$;
CREATE OR REPLACE FUNCTION public.published(target uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT EXISTS(SELECT 1 FROM shelters WHERE id=target AND is_verified)
$$;
CREATE OR REPLACE FUNCTION public.can_read_profile(target uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT target=auth.uid() OR public.is_admin() $$;
-- Retira las políticas permisivas heredadas: las políticas se combinan por OR.
DO $$ DECLARE p record; BEGIN
 FOR p IN SELECT tablename,policyname FROM pg_policies WHERE schemaname='public' AND tablename IN ('profiles','shelters','shelter_photos','animals','animal_photos','adoption_requests','lost_found_reports','lost_found_sightings','donation_campaigns','donations') LOOP
 EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,p.tablename);
 END LOOP;
END $$;
REVOKE ALL ON profiles,shelters,shelter_photos,animals,animal_photos,adoption_requests,lost_found_reports,lost_found_sightings,donation_campaigns,donations FROM anon,authenticated;
GRANT SELECT ON profiles,shelters,shelter_photos,animals,animal_photos,donation_campaigns,lost_found_reports TO anon,authenticated;
GRANT SELECT ON adoption_requests,donations,lost_found_sightings TO authenticated;
GRANT UPDATE(full_name,avatar_url,phone,ubigeo) ON profiles TO authenticated;
GRANT UPDATE(name,description,long_description,address,phone,email,whatsapp,instagram,facebook,tiktok,avatar_url,banner_url) ON shelters TO authenticated;
GRANT INSERT ON animals,animal_photos,donation_campaigns,adoption_requests TO authenticated;
GRANT UPDATE(name,species,breed,age_months,size,gender,color,description,is_vaccinated,is_neutered,is_microchipped,status,ubigeo) ON animals TO authenticated;
GRANT UPDATE(title,description,goal_amount,is_active,ends_at) ON donation_campaigns TO authenticated;
GRANT UPDATE(status) ON adoption_requests TO authenticated;
CREATE POLICY profile_read ON profiles FOR SELECT USING(public.can_read_profile(id));
CREATE POLICY profile_edit ON profiles FOR UPDATE USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE POLICY shelter_read ON shelters FOR SELECT USING(is_verified OR public.manages(id));
CREATE POLICY shelter_edit ON shelters FOR UPDATE USING(public.manages(id)) WITH CHECK(public.manages(id));
CREATE POLICY shelter_photo_read ON shelter_photos FOR SELECT USING(public.published(shelter_id) OR public.manages(shelter_id));
CREATE POLICY animal_read ON animals FOR SELECT USING(public.published(shelter_id) OR public.manages(shelter_id));
CREATE POLICY animal_add ON animals FOR INSERT WITH CHECK(public.manages(shelter_id) AND posted_by=auth.uid());
CREATE POLICY animal_edit ON animals FOR UPDATE USING(public.manages(shelter_id)) WITH CHECK(public.manages(shelter_id));
CREATE POLICY animal_photo_read ON animal_photos FOR SELECT USING(EXISTS(SELECT 1 FROM animals a WHERE a.id=animal_id));
CREATE POLICY animal_photo_add ON animal_photos FOR INSERT WITH CHECK(EXISTS(SELECT 1 FROM animals a WHERE a.id=animal_id AND public.manages(a.shelter_id)));
CREATE POLICY campaign_read ON donation_campaigns FOR SELECT USING(public.published(shelter_id) OR public.manages(shelter_id));
CREATE POLICY campaign_add ON donation_campaigns FOR INSERT WITH CHECK(public.manages(shelter_id) AND current_amount=0 AND (animal_id IS NULL OR EXISTS(SELECT 1 FROM animals a WHERE a.id=animal_id AND a.shelter_id=donation_campaigns.shelter_id)));
CREATE POLICY campaign_edit ON donation_campaigns FOR UPDATE USING(public.manages(shelter_id)) WITH CHECK(public.manages(shelter_id));
CREATE POLICY request_read ON adoption_requests FOR SELECT USING(requester_id=auth.uid() OR public.manages(shelter_id));
CREATE POLICY request_add ON adoption_requests FOR INSERT WITH CHECK(requester_id=auth.uid() AND status='pending' AND EXISTS(SELECT 1 FROM animals a WHERE a.id=animal_id AND a.shelter_id=adoption_requests.shelter_id AND a.status='available' AND public.published(a.shelter_id)));
CREATE POLICY request_edit ON adoption_requests FOR UPDATE USING(public.manages(shelter_id)) WITH CHECK(public.manages(shelter_id));
CREATE POLICY legacy_donation_read ON donations FOR SELECT USING(donor_id=auth.uid() OR EXISTS(SELECT 1 FROM donation_campaigns c WHERE c.id=campaign_id AND public.manages(c.shelter_id)));
-- Módulo heredado de perdidos: lectura, sin formularios que finjan guardar.
CREATE POLICY report_read ON lost_found_reports FOR SELECT USING(true);
CREATE POLICY sighting_read ON lost_found_sightings FOR SELECT USING(user_id=auth.uid() OR EXISTS(SELECT 1 FROM lost_found_reports r WHERE r.id=report_id AND r.reported_by=auth.uid()));
CREATE TABLE public.needs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), shelter_id uuid NOT NULL REFERENCES shelters(id),
 title text NOT NULL CHECK(length(title) BETWEEN 4 AND 120), description text NOT NULL CHECK(length(description) BETWEEN 10 AND 1000),
 quantity text NOT NULL CHECK(length(quantity) BETWEEN 1 AND 80), fulfilled boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX needs_shelter ON needs(shelter_id);
ALTER TABLE needs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON needs TO anon,authenticated;
GRANT INSERT ON needs TO authenticated;
GRANT UPDATE(title,description,quantity,fulfilled) ON needs TO authenticated;
CREATE POLICY need_read ON needs FOR SELECT USING(public.published(shelter_id) OR public.manages(shelter_id));
CREATE POLICY need_add ON needs FOR INSERT WITH CHECK(public.manages(shelter_id));
CREATE POLICY need_edit ON needs FOR UPDATE USING(public.manages(shelter_id)) WITH CHECK(public.manages(shelter_id));
CREATE TABLE public.support_intents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), donor_id uuid NOT NULL REFERENCES profiles(id),
 shelter_id uuid NOT NULL REFERENCES shelters(id), campaign_id uuid REFERENCES donation_campaigns(id), animal_id uuid REFERENCES animals(id),
 kind text NOT NULL CHECK(kind IN ('donation','sponsorship')),
 amount numeric(12,2) NOT NULL CHECK(amount BETWEEN 1 AND 100000),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','cancelled')),
 idempotency_key uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(donor_id,idempotency_key),
 CHECK((kind='donation' AND campaign_id IS NOT NULL AND animal_id IS NULL) OR (kind='sponsorship' AND animal_id IS NOT NULL AND campaign_id IS NULL))
);
CREATE INDEX support_shelter ON support_intents(shelter_id);
ALTER TABLE support_intents ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON support_intents TO authenticated;
REVOKE INSERT,UPDATE,DELETE ON support_intents FROM anon,authenticated;
CREATE POLICY support_read ON support_intents FOR SELECT USING(donor_id=auth.uid() OR public.manages(shelter_id));
CREATE OR REPLACE FUNCTION public.pledge_support(p_kind text,p_campaign uuid,p_animal uuid,p_amount numeric,p_key uuid) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE sid uuid; result uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 IF p_amount IS NULL OR p_amount<1 OR p_amount>100000 OR p_amount<>round(p_amount,2) OR p_key IS NULL THEN RAISE EXCEPTION 'Invalid amount/key'; END IF;
 IF p_kind='donation' AND p_animal IS NULL THEN
 SELECT shelter_id INTO sid FROM donation_campaigns WHERE id=p_campaign AND is_active AND (ends_at IS NULL OR ends_at>now());
 ELSIF p_kind='sponsorship' AND p_campaign IS NULL THEN
 SELECT shelter_id INTO sid FROM animals WHERE id=p_animal AND status<>'adopted';
 END IF;
 IF sid IS NULL OR NOT public.published(sid) THEN RAISE EXCEPTION 'Invalid target'; END IF;
 INSERT INTO support_intents(donor_id,shelter_id,campaign_id,animal_id,kind,amount,idempotency_key)
 VALUES(auth.uid(),sid,p_campaign,p_animal,p_kind,p_amount,p_key)
 ON CONFLICT(donor_id,idempotency_key) DO NOTHING RETURNING id INTO result;
 IF result IS NULL THEN SELECT id INTO result FROM support_intents WHERE donor_id=auth.uid() AND idempotency_key=p_key; END IF;
 RETURN result;
END $$;
CREATE OR REPLACE FUNCTION public.cancel_support(target uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN UPDATE support_intents SET status='cancelled' WHERE id=target AND donor_id=auth.uid() AND status='pending'; IF NOT FOUND THEN RAISE EXCEPTION 'Not found'; END IF; END $$;
CREATE OR REPLACE FUNCTION public.verify_shelter(target uuid,verified boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN IF NOT public.is_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF; UPDATE shelters SET is_verified=verified WHERE id=target; END $$;
CREATE OR REPLACE FUNCTION public.create_animal_with_photos(animal jsonb,photos jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE aid uuid; photo text; i int:=0;
BEGIN
 IF jsonb_array_length(photos)>3 THEN RAISE EXCEPTION 'Too many photos'; END IF;
 INSERT INTO animals(id,shelter_id,posted_by,name,species,breed,age_months,size,gender,color,description,is_vaccinated,is_neutered,is_microchipped,status,ubigeo,slug)
 VALUES((animal->>'id')::uuid,(animal->>'shelter_id')::uuid,auth.uid(),animal->>'name',(animal->>'species')::animal_species,animal->>'breed',(animal->>'age_months')::int,(animal->>'size')::animal_size,(animal->>'gender')::animal_gender,animal->>'color',animal->>'description',(animal->>'is_vaccinated')::boolean,(animal->>'is_neutered')::boolean,(animal->>'is_microchipped')::boolean,'available',animal->>'ubigeo',animal->>'slug') RETURNING id INTO aid;
 FOR photo IN SELECT jsonb_array_elements_text(photos) LOOP
 IF photo NOT LIKE 'https://%' THEN RAISE EXCEPTION 'Invalid photo URL'; END IF;
 INSERT INTO animal_photos(animal_id,url,is_cover,order_index) VALUES(aid,photo,i=0,i); i:=i+1;
 END LOOP; RETURN aid;
END $$;
-- Roles y verificación solo por consola administrativa/función verificada.
-- Un owner puede gestionar un albergue; la UI resuelve uno por cuenta en el MVP.
CREATE INDEX shelters_owner ON shelters(profile_id);
REVOKE ALL ON FUNCTION public.handle_new_user(),public.is_admin(),public.manages(uuid),public.published(uuid),public.can_read_profile(uuid),public.pledge_support(text,uuid,uuid,numeric,uuid),public.cancel_support(uuid),public.verify_shelter(uuid,boolean),public.create_animal_with_photos(jsonb,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(),public.manages(uuid),public.published(uuid),public.can_read_profile(uuid) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.pledge_support(text,uuid,uuid,numeric,uuid),public.cancel_support(uuid),public.verify_shelter(uuid,boolean),public.create_animal_with_photos(jsonb,jsonb) TO authenticated;
COMMIT;
