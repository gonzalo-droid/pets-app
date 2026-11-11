-- Incorporación de albergues: una persona con cuenta registra su albergue.
-- Queda como responsable y el albergue empieza sin verificar (no visible en
-- el portal) hasta que la administración lo verifique. Nadie se autoverifica.
BEGIN;

CREATE OR REPLACE FUNCTION public.request_shelter(
  p_name text,
  p_description text,
  p_ubigeo text,
  p_whatsapp text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  v_role text;
  sid uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT role::text INTO v_role FROM profiles WHERE id = uid;
  -- Solo cuentas de la comunidad; un albergue por responsable en el MVP.
  IF v_role IS DISTINCT FROM 'user' THEN RAISE EXCEPTION 'Only community accounts can register a shelter'; END IF;
  IF EXISTS (SELECT 1 FROM shelters WHERE profile_id = uid) THEN RAISE EXCEPTION 'Shelter already registered'; END IF;
  IF length(trim(coalesce(p_name, ''))) NOT BETWEEN 2 AND 100 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF length(trim(coalesce(p_description, ''))) NOT BETWEEN 10 AND 1000 THEN RAISE EXCEPTION 'Invalid description'; END IF;
  IF p_ubigeo !~ '^\d{6}$' THEN RAISE EXCEPTION 'Invalid ubigeo'; END IF;
  IF p_whatsapp IS NOT NULL AND p_whatsapp !~ '^\d{9,15}$' THEN RAISE EXCEPTION 'Invalid whatsapp'; END IF;

  INSERT INTO shelters (profile_id, name, description, ubigeo, whatsapp, is_verified)
  VALUES (uid, trim(p_name), trim(p_description), p_ubigeo, p_whatsapp, false)
  RETURNING id INTO sid;
  UPDATE profiles SET role = 'shelter' WHERE id = uid;
  RETURN sid;
END $$;

REVOKE ALL ON FUNCTION public.request_shelter(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_shelter(text, text, text, text) TO authenticated;

COMMIT;
