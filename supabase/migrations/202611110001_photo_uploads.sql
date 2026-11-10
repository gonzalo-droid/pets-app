-- Subida de fotos: almacenamiento de imágenes y gestión de fotos de animales.
BEGIN;

-- Fotos de animales: el albergue puede quitar fotos y elegir la portada.
GRANT DELETE ON public.animal_photos TO authenticated;
GRANT UPDATE (is_cover, order_index) ON public.animal_photos TO authenticated;
DROP POLICY IF EXISTS animal_photo_edit ON public.animal_photos;
CREATE POLICY animal_photo_edit ON public.animal_photos FOR UPDATE
  USING (EXISTS (SELECT 1 FROM animals a WHERE a.id = animal_id AND public.manages(a.shelter_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM animals a WHERE a.id = animal_id AND public.manages(a.shelter_id)));
DROP POLICY IF EXISTS animal_photo_remove ON public.animal_photos;
CREATE POLICY animal_photo_remove ON public.animal_photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM animals a WHERE a.id = animal_id AND public.manages(a.shelter_id)));

-- Almacenamiento (solo existe en Supabase; se omite en bases sin el esquema storage).
DO $$
BEGIN
  IF to_regclass('storage.buckets') IS NULL THEN
    RETURN;
  END IF;
  -- Público para lectura; máximo 4 MB; solo JPG, PNG y WebP.
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('huellas', 'huellas', true, 4194304, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE
    SET public = true,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Rutas: shelters/<id del albergue>/<tipo>/<archivo>. Cada albergue solo
  -- escribe y borra dentro de su carpeta (o administración).
  EXECUTE 'DROP POLICY IF EXISTS huellas_upload ON storage.objects';
  EXECUTE $p$CREATE POLICY huellas_upload ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'huellas'
      AND (storage.foldername(name))[1] = 'shelters'
      AND public.manages(((storage.foldername(name))[2])::uuid)
    )$p$;
  EXECUTE 'DROP POLICY IF EXISTS huellas_remove ON storage.objects';
  EXECUTE $p$CREATE POLICY huellas_remove ON storage.objects FOR DELETE TO authenticated
    USING (
      bucket_id = 'huellas'
      AND (storage.foldername(name))[1] = 'shelters'
      AND public.manages(((storage.foldername(name))[2])::uuid)
    )$p$;
END $$;

COMMIT;
