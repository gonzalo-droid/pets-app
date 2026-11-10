-- Cambios de estado permitidos en las solicitudes de adopción.
-- Igual que REQUEST_TRANSITIONS en src/lib/huellas/domain.ts.
BEGIN;
CREATE OR REPLACE FUNCTION public.check_request_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.status = OLD.status THEN RETURN NEW; END IF;
 IF NOT (
   (OLD.status = 'pending' AND NEW.status IN ('reviewing','approved','rejected')) OR
   (OLD.status = 'reviewing' AND NEW.status IN ('approved','rejected')) OR
   (OLD.status = 'approved' AND NEW.status IN ('completed','rejected'))
 ) THEN
   RAISE EXCEPTION 'Cambio de estado no permitido: % -> %', OLD.status, NEW.status;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS adoption_requests_transition ON public.adoption_requests;
CREATE TRIGGER adoption_requests_transition
  BEFORE UPDATE OF status ON public.adoption_requests
  FOR EACH ROW EXECUTE FUNCTION public.check_request_transition();
COMMIT;
