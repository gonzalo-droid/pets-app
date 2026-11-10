-- Las páginas públicas de perdidos incluyen los avistamientos de cada reporte.
-- Sin este permiso, PostgREST rechaza la consulta completa para visitantes sin
-- sesión. La política sighting_read sigue mostrando solo los avistamientos
-- propios o de reportes propios, así que un visitante anónimo no ve ninguno.
GRANT SELECT ON public.lost_found_sightings TO anon;
