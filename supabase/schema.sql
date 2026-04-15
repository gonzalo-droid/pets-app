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
