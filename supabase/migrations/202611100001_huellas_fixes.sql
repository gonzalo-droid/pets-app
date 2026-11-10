-- Correcciones tras el MVP HUELLAS. No destructivo. Aplicar en transacción.
BEGIN;
-- Una persona solo puede tener una solicitud activa por animal.
CREATE UNIQUE INDEX IF NOT EXISTS adoption_requests_one_active
  ON public.adoption_requests(animal_id, requester_id)
  WHERE status IN ('pending', 'reviewing', 'approved');
-- Verificar un albergue inexistente debe fallar, no "guardar" en silencio.
CREATE OR REPLACE FUNCTION public.verify_shelter(target uuid,verified boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
 UPDATE shelters SET is_verified=verified WHERE id=target;
 IF NOT FOUND THEN RAISE EXCEPTION 'Not found'; END IF;
END $$;
COMMIT;
