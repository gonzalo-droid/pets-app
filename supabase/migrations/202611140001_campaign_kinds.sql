-- Tipos de campaña: caso (un rescatado), fondo (gasto que se repite) y evento
-- (jornada de adopción, colecta, esterilización), con fecha y lugar para los
-- eventos y una foto propia opcional.
BEGIN;

ALTER TABLE public.donation_campaigns
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'fund',
  ADD COLUMN IF NOT EXISTS event_at timestamptz,
  ADD COLUMN IF NOT EXISTS event_place text,
  ADD COLUMN IF NOT EXISTS image_url text;

-- Las campañas que ya tienen un animal pasan a ser casos.
UPDATE public.donation_campaigns SET kind = 'case' WHERE animal_id IS NOT NULL AND kind = 'fund';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'campaign_kind_valid') THEN
    ALTER TABLE public.donation_campaigns ADD CONSTRAINT campaign_kind_valid CHECK (
      kind IN ('case', 'fund', 'event')
      AND (kind <> 'case' OR animal_id IS NOT NULL)
      AND (kind = 'event' OR (event_at IS NULL AND event_place IS NULL))
      AND (kind <> 'event' OR (event_at IS NOT NULL AND length(trim(coalesce(event_place, ''))) BETWEEN 2 AND 160))
      AND (image_url IS NULL OR length(image_url) <= 500)
    );
  END IF;
END $$;

GRANT INSERT (kind, event_at, event_place, image_url),
      UPDATE (kind, event_at, event_place, image_url)
  ON public.donation_campaigns TO authenticated;

COMMIT;
