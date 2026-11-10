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
