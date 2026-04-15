-- ============================================================
-- PawRescue — Seed de datos (desarrollo)
-- Ejecutar DESPUÉS de schema.sql en el SQL Editor de Supabase
-- IMPORTANTE: crea usuarios de auth directamente — solo para dev
-- ============================================================

BEGIN;

-- ── 1. Auth users ─────────────────────────────────────────────
-- Contraseña para todos: PawRescue2024!

INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
  -- Albergues
  ('10000000-0000-4000-8000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'patitaschiclayo@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Patitas Chiclayo","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'huellaslamb@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Huellas Lambayeque","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'refugiosanisidro@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Refugio San Isidro","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'amigospeludos@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Amigos Peludos Chiclayo","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'gatitosfelices@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Gatitos Felices Lambayeque","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'rescatemoshoqueque@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Rescate Moshoqueque","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'patasycolas@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Patas y Colas Ferreñafe","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('10000000-0000-4000-8000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'lavictoriarescue@gmail.com', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"La Victoria Animal Rescue","role":"shelter"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  -- Usuarios adoptantes
  ('20000000-0000-4000-8000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'usuario1@pawrescue.pe', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"María García","role":"user"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('20000000-0000-4000-8000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'usuario2@pawrescue.pe', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Carlos López","role":"user"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('20000000-0000-4000-8000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'usuario3@pawrescue.pe', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Ana Torres","role":"user"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('20000000-0000-4000-8000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'usuario4@pawrescue.pe', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Pedro Díaz","role":"user"}',
   FALSE, NOW(), NOW(), '', '', '', ''),
  ('20000000-0000-4000-8000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'usuario5@pawrescue.pe', crypt('PawRescue2024!', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Rosa Mendoza","role":"user"}',
   FALSE, NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Profiles (el trigger handle_new_user los crea automáticamente,
--    pero si el trigger no corrió, los insertamos manualmente) ──────
INSERT INTO profiles (id, full_name, role, phone, ubigeo, created_at, updated_at)
VALUES
  ('10000000-0000-4000-8000-000000000001','Patitas Chiclayo',          'shelter','979123456','140101', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000002','Huellas Lambayeque',        'shelter','943678901','140301', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000003','Refugio San Isidro',        'shelter','956112233','140201', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000004','Amigos Peludos Chiclayo',   'shelter','921456789','140101', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000005','Gatitos Felices Lambayeque','shelter','934567890','140301', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000006','Rescate Moshoqueque',       'shelter','945678901','140108', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000007','Patas y Colas Ferreñafe',   'shelter','912345678','140201', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000008','La Victoria Animal Rescue', 'shelter','967890123','140110', NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000001','María García',  'user','955321456','140101', NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000002','Carlos López',  'user','943111222','140101', NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000003','Ana Torres',    'user','966789012','140201', NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000004','Pedro Díaz',    'user','912345678','140301', NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000005','Rosa Mendoza',  'user','999001122','140101', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ── 3. Shelters ───────────────────────────────────────────────
INSERT INTO shelters (
  id, profile_id, name, description, long_description,
  address, ubigeo, phone, email, whatsapp, instagram, facebook, tiktok,
  avatar_url, banner_url, is_verified,
  yape_number, bank_account, bank_name, account_holder,
  created_at, updated_at
) VALUES
  (
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Patitas Chiclayo',
    'Albergue sin fines de lucro dedicado al rescate y adopción responsable de animales en Chiclayo. Operamos desde 2018 con voluntarios comprometidos.',
    'Patitas Chiclayo nació en 2018 de la mano de un grupo de voluntarios que encontraron a más de 20 perros en situación de abandono en el distrito de Santa Victoria. Lo que empezó como un rescate de emergencia se convirtió en una organización sin fines de lucro registrada ante los Registros Públicos de Lambayeque.

Hoy contamos con un albergue propio con capacidad para 60 animales, un equipo de 15 voluntarios permanentes y alianzas con 3 clínicas veterinarias de Chiclayo que nos brindan atención a precio social.

Nuestra misión es rescatar, rehabilitar y encontrar hogares responsables para perros y gatos en situación de riesgo en la región Lambayeque.',
    'Calle Los Mochicas 345, Urb. Santa Victoria', '140101',
    '979123456','patitaschiclayo@gmail.com','979123456',
    'patitaschiclayo','patitaschiclayo','patitaschiclayo',
    'https://api.dicebear.com/7.x/shapes/svg?seed=patitas',
    'https://picsum.photos/seed/patitas-banner/1200/400',
    TRUE, '979123456','00219012345678901234','BCP','Asociación Patitas Chiclayo',
    '2024-01-15T10:00:00Z','2024-03-01T10:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'Huellas Lambayeque',
    'Refugio familiar en Lambayeque ciudad. Acogemos perros y gatos maltratados o abandonados y buscamos hogares responsables en toda la región.',
    'Huellas Lambayeque es un refugio familiar que funciona desde 2020 en la ciudad de Lambayeque. Somos una familia que decidió abrir las puertas de nuestra casa para acoger animales en situación de maltrato o abandono.

A diferencia de los albergues grandes, nosotros operamos en un modelo de casa-hogar donde los animales conviven con personas en un ambiente familiar.

Tenemos capacidad para 25 animales y trabajamos con la Municipalidad Provincial de Lambayeque en campañas de esterilización y adopción masiva.',
    'Av. Ramón Castilla 890', '140301',
    '943678901','huellaslamb@gmail.com','943678901',
    'huellasLambayeque','huellasLambayeque', NULL,
    'https://api.dicebear.com/7.x/shapes/svg?seed=huellas',
    'https://picsum.photos/seed/huellas-banner/1200/400',
    TRUE, '943678901','00349087654321098765','Interbank','Huellas Lambayeque EIRL',
    '2024-02-10T09:00:00Z','2024-03-15T09:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    'Refugio San Isidro',
    'Refugio comunitario en Ferreñafe especializado en rescate de animales en situación de maltrato y abandono.',
    NULL, 'Av. Bolognesi 120, Ferreñafe', '140201',
    '956112233','refugiosanisidro@gmail.com','956112233',
    'refugiosanisidro','refugiosanisidro', NULL,
    'https://api.dicebear.com/7.x/shapes/svg?seed=sanisidro', NULL,
    TRUE, '956112233', NULL, NULL, NULL,
    '2024-02-01T10:00:00Z','2024-03-10T10:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000004',
    'Amigos Peludos Chiclayo',
    'Organización de rescatistas independientes que trabajan en red para colocar animales callejeros en hogares temporales.',
    NULL, 'Urb. Patasca, Chiclayo', '140101',
    '921456789','amigospeludos@gmail.com','921456789',
    'amigospeludoschi','amigospeludoschi','amigospeludoschi',
    'https://api.dicebear.com/7.x/shapes/svg?seed=amigospeludos', NULL,
    TRUE, '921456789', NULL, NULL, NULL,
    '2024-02-15T10:00:00Z','2024-03-20T10:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000005',
    'Gatitos Felices Lambayeque',
    'Albergue especializado en gatos domésticos y callejeros. Contamos con área de socialización y seguimiento post-adopción.',
    NULL, 'Calle Dos de Mayo 456, Lambayeque', '140301',
    '934567890','gatitosfelices@gmail.com','934567890',
    'gatitosfeliceslam', NULL, NULL,
    'https://api.dicebear.com/7.x/shapes/svg?seed=gatitos', NULL,
    TRUE, '934567890', NULL, NULL, NULL,
    '2024-03-01T10:00:00Z','2024-03-25T10:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000006',
    'Rescate Moshoqueque',
    'Grupo de voluntarios que rescatan animales del mercado Moshoqueque y zonas aledañas de José Leonardo Ortiz.',
    NULL, 'Av. César Vallejo 890, J.L.O.', '140108',
    '945678901','rescatemoshoqueque@gmail.com','945678901',
    'rescatemosho','rescatemosho', NULL,
    'https://api.dicebear.com/7.x/shapes/svg?seed=moshoqueque', NULL,
    TRUE, '945678901', NULL, NULL, NULL,
    '2024-03-05T10:00:00Z','2024-03-22T10:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000007',
    '10000000-0000-4000-8000-000000000007',
    'Patas y Colas Ferreñafe',
    'Pequeño refugio familiar en Ferreñafe con énfasis en adopciones responsables y seguimiento post-adopción.',
    NULL, 'Calle Unión 340, Ferreñafe', '140201',
    '912345678','patasycolas@gmail.com','912345678',
    NULL,'patasycolas', NULL,
    'https://api.dicebear.com/7.x/shapes/svg?seed=patasycolas', NULL,
    TRUE, NULL,'00219099887766554433','BCP','Patas y Colas',
    '2024-03-08T10:00:00Z','2024-03-28T10:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000008',
    '10000000-0000-4000-8000-000000000008',
    'La Victoria Animal Rescue',
    'Rescatistas del distrito de La Victoria. Especializados en perros medianos y grandes con historial de maltrato.',
    NULL, 'Av. Grau 567, La Victoria', '140110',
    '967890123','lavictoriarescue@gmail.com','967890123',
    'lavictoriarescue','lavictoriarescue','lavictoriarescue',
    'https://api.dicebear.com/7.x/shapes/svg?seed=lavictoria', NULL,
    TRUE, '967890123', NULL, NULL, NULL,
    '2024-03-12T10:00:00Z','2024-03-29T10:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ── 4. Shelter photos ─────────────────────────────────────────
INSERT INTO shelter_photos (id, shelter_id, url, order_index) VALUES
  ('60000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','https://picsum.photos/seed/patitas1/600/400',0),
  ('60000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000001','https://picsum.photos/seed/patitas2/600/400',1),
  ('60000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000001','https://picsum.photos/seed/patitas3/600/400',2),
  ('60000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000001','https://picsum.photos/seed/patitas4/600/400',3),
  ('60000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000001','https://picsum.photos/seed/patitas5/600/400',4),
  ('60000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000002','https://picsum.photos/seed/huellas1/600/400',0),
  ('60000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000002','https://picsum.photos/seed/huellas2/600/400',1),
  ('60000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000002','https://picsum.photos/seed/huellas3/600/400',2),
  ('60000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000002','https://picsum.photos/seed/huellas4/600/400',3)
ON CONFLICT (id) DO NOTHING;

-- ── 5. Animals ────────────────────────────────────────────────
INSERT INTO animals (
  id, shelter_id, posted_by, name, species, breed, age_months,
  size, gender, color, description,
  is_vaccinated, is_neutered, is_microchipped,
  status, ubigeo, slug, created_at, updated_at
) VALUES
  ('40000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Rocky','dog','Mestizo',18,'medium','male','Café con blanco',
   'Rocky es un perro muy juguetón y cariñoso. Le encanta correr y jugar con pelotas. Está listo para un hogar con espacio para correr. Se lleva bien con niños mayores de 6 años.',
   TRUE,TRUE,FALSE,'available','140101','rocky-mestizo-chiclayo','2024-03-01T10:00:00Z','2024-03-01T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Luna','cat','Doméstico de pelo corto',8,'small','female','Naranja atigrada',
   'Luna llegó siendo una gatita callejera y ahora es completamente doméstica. Es tranquila, independiente y perfecta para departamentos. Busca un hogar sin perros.',
   TRUE,FALSE,FALSE,'available','140101','luna-gata-naranja-chiclayo','2024-03-05T11:00:00Z','2024-03-05T11:00:00Z'),

  ('40000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Toby','dog','Beagle mestizo',36,'small','male','Tricolor (negro, café, blanco)',
   'Toby tiene 3 años y es ideal para familias. Es muy obediente, ya tiene entrenamiento básico. Le gustan los paseos largos y es amigable con otros perros.',
   TRUE,TRUE,TRUE,'available','140301','toby-beagle-lambayeque','2024-03-08T09:00:00Z','2024-03-08T09:00:00Z'),

  ('40000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Mochi','cat','Persa mestizo',24,'small','female','Blanca con manchas grises',
   'Mochi es una gata muy afectuosa. Le encanta el regazo humano y ronronea constantemente. Perfecta para personas que buscan compañía tranquila. Convive bien con otras gatas.',
   TRUE,TRUE,FALSE,'in_process','140110','mochi-gata-persa-la-victoria','2024-03-10T14:00:00Z','2024-03-20T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Zeus','dog','Labrador mestizo',60,'large','male','Negro',
   'Zeus tiene 5 años y fue rescatado de maltrato. Ya está recuperado física y emocionalmente. Necesita un hogar paciente con adultos o adolescentes. Adora a sus humanos una vez que confía.',
   TRUE,TRUE,FALSE,'available','140301','zeus-labrador-lambayeque','2024-03-12T08:00:00Z','2024-03-12T08:00:00Z'),

  ('40000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Piolín','other','Conejo doméstico',12,'small','male','Blanco con manchas marrones',
   'Piolín es un conejo doméstico muy dócil. Vive en jaula pero le encanta salir a explorar. Ideal para familias con niños que quieran una mascota diferente. Se alimenta de heno y verduras frescas.',
   FALSE,FALSE,FALSE,'available','140101','piolin-conejo-chiclayo','2024-03-15T16:00:00Z','2024-03-15T16:00:00Z'),

  ('40000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Bella','dog','Cocker spaniel mestizo',14,'small','female','Miel',
   'Bella es dulce y muy cariñosa. Le encanta jugar y es ideal para familias con niños.',
   TRUE,FALSE,FALSE,'available','140101','bella-cocker-chiclayo','2024-03-16T10:00:00Z','2024-03-16T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Simba','cat','Maine coon mestizo',30,'medium','male','Naranja y blanco',
   'Simba es un gato grande y majestuoso. Tranquilo y muy cariñoso con sus humanos.',
   TRUE,TRUE,TRUE,'available','140301','simba-maine-coon-lambayeque','2024-03-17T10:00:00Z','2024-03-17T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Canela','dog','Salchicha mestizo',24,'small','female','Canela',
   'Canela es juguetona y muy lista. Ya sabe algunos trucos básicos. Busca un hogar activo.',
   TRUE,TRUE,FALSE,'available','140110','canela-salchicha-la-victoria','2024-03-18T10:00:00Z','2024-03-18T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Max','dog','Pastor alemán mestizo',48,'large','male','Negro con café',
   'Max es leal y protector. Tiene entrenamiento de obediencia básica. Ideal para casas con patio.',
   TRUE,FALSE,TRUE,'available','140301','max-pastor-aleman-lambayeque','2024-03-19T10:00:00Z','2024-03-19T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Nieve','cat','Angora mestizo',10,'small','female','Blanca',
   'Nieve es una gatita pura y muy tranquila. Se lleva bien con otras gatas y con niños tranquilos.',
   TRUE,FALSE,FALSE,'available','140101','nieve-angora-chiclayo','2024-03-20T10:00:00Z','2024-03-20T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Duque','dog','Boxer mestizo',36,'large','male','Leonado con blanco',
   'Duque es enérgico y juguetón. Necesita espacio para correr. Muy amigable con niños grandes.',
   TRUE,TRUE,FALSE,'available','140201','duque-boxer-ferrenafe','2024-03-21T10:00:00Z','2024-03-21T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Perla','cat','Siamés mestizo',18,'small','female','Crema con puntas oscuras',
   'Perla es vocal y muy expresiva. Establece vínculos fuertes con su dueño. Le gusta la rutina.',
   TRUE,TRUE,FALSE,'available','140101','perla-siames-chiclayo','2024-03-22T10:00:00Z','2024-03-22T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Thor','dog','Husky mestizo',20,'medium','male','Gris y blanco',
   'Thor es activo e inteligente. Necesita ejercicio diario y estimulación mental. Muy sociable.',
   TRUE,FALSE,TRUE,'available','140301','thor-husky-lambayeque','2024-03-23T10:00:00Z','2024-03-23T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
   'Kira','dog','Labrador mestizo',12,'medium','female','Amarilla',
   'Kira es curiosa y muy cariñosa. Ama a todos los humanos. Está lista para una familia activa.',
   TRUE,FALSE,FALSE,'available','140108','kira-labrador-jlo','2024-03-24T10:00:00Z','2024-03-24T10:00:00Z'),

  ('40000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',
   'Oliver','cat','Doméstico pelo largo',36,'medium','male','Negro',
   'Oliver es elegante y reservado. Tarda en confiar pero cuando lo hace es sumamente fiel y cariñoso.',
   TRUE,TRUE,FALSE,'available','140301','oliver-gato-negro-lambayeque','2024-03-25T10:00:00Z','2024-03-25T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── 6. Animal photos ──────────────────────────────────────────
INSERT INTO animal_photos (id, animal_id, url, is_cover, order_index) VALUES
  ('50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001','https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000001','https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80',FALSE,1),
  ('50000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000002','https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000003','https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000004','https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000006','40000000-0000-4000-8000-000000000005','https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000007','40000000-0000-4000-8000-000000000006','https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000008','40000000-0000-4000-8000-000000000007','https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000009','40000000-0000-4000-8000-000000000008','https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000010','40000000-0000-4000-8000-000000000009','https://images.unsplash.com/photo-1537123547273-e59f4a9b8570?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000011','40000000-0000-4000-8000-000000000010','https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000012','40000000-0000-4000-8000-000000000011','https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000013','40000000-0000-4000-8000-000000000012','https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000014','40000000-0000-4000-8000-000000000013','https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000015','40000000-0000-4000-8000-000000000014','https://images.unsplash.com/photo-1605639648730-e2b0db5f5776?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000016','40000000-0000-4000-8000-000000000015','https://images.unsplash.com/photo-1504826260979-242151ee45b7?w=600&q=80',TRUE,0),
  ('50000000-0000-4000-8000-000000000017','40000000-0000-4000-8000-000000000016','https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',TRUE,0)
ON CONFLICT (id) DO NOTHING;

-- ── 7. Lost/found reports ─────────────────────────────────────
INSERT INTO lost_found_reports (
  id, animal_id, reported_by, type, description,
  last_seen_at, last_seen_address, ubigeo,
  reward_amount, contact_phone, is_resolved, photo_urls, slug,
  created_at, updated_at
) VALUES
  ('70000000-0000-4000-8000-000000000001', NULL, '20000000-0000-4000-8000-000000000001',
   'lost',
   'Cachorro macho, mestizo, color negro con patas blancas. Collar azul con placa "Coco". Se perdió cerca del mercado Moshoqueque. Es muy amigable y se acerca a las personas.',
   '2024-03-20T14:00:00Z','Mercado Moshoqueque, av. César Vallejo, José Leonardo Ortiz','140108',
   100,'955321456',FALSE,
   ARRAY['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80','https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80'],
   'coco-cachorro-negro-jose-leonardo-ortiz','2024-03-20T16:00:00Z','2024-03-20T16:00:00Z'),

  ('70000000-0000-4000-8000-000000000002', NULL, '20000000-0000-4000-8000-000000000002',
   'found',
   'Encontré una gata adulta, color gris perla, pelo corto, muy dócil y limpia. Parece ser mascota doméstica. La tengo en casa temporalmente. Si es tuya, contáctame.',
   '2024-03-22T10:00:00Z','Urb. Los Parques, calle Los Cerezos, Chiclayo','140101',
   NULL,'943111222',FALSE,
   ARRAY['https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=80'],
   'gata-gris-encontrada-los-parques-chiclayo','2024-03-22T11:00:00Z','2024-03-22T11:00:00Z'),

  ('70000000-0000-4000-8000-000000000003', NULL, '20000000-0000-4000-8000-000000000003',
   'lost',
   'Perra adulta, raza golden retriever, pelo largo dorado, muy obediente. Responde al nombre "Nala". Desapareció durante un paseo. Lleva microchip. Recompensa para quien ayude a encontrarla.',
   '2024-03-18T07:00:00Z','Parque principal de Ferreñafe, frente a la Municipalidad','140201',
   300,'966789012',FALSE,
   ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80','https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80','https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80'],
   'nala-golden-retriever-ferrenafe','2024-03-18T09:00:00Z','2024-03-18T09:00:00Z'),

  ('70000000-0000-4000-8000-000000000004', NULL, '20000000-0000-4000-8000-000000000004',
   'lost',
   'Gato macho, atigrado naranja, 3 años aprox, castrado. Le falta una oreja (señal de rescate previo). Se llama Manchas. Escapó por la ventana, vive en el 4to piso.',
   '2024-03-25T20:00:00Z','Calle San José 567, Lambayeque ciudad','140301',
   50,'912345678',FALSE, NULL,
   'manchas-gato-atigrado-lambayeque','2024-03-25T21:00:00Z','2024-03-25T21:00:00Z'),

  ('70000000-0000-4000-8000-000000000005', NULL, '20000000-0000-4000-8000-000000000005',
   'lost',
   'Perro pequeño, raza Pomerania, color crema, responde al nombre "Cuki". Collar rosa con cascabel. Se perdió en el parque Infantil de Chiclayo.',
   '2024-03-26T16:00:00Z','Parque Infantil, Chiclayo','140101',
   150,'999001122',FALSE,
   ARRAY['https://images.unsplash.com/photo-1617526738882-1ea945ce3ff5?w=600&q=80'],
   'cuki-pomerania-parque-infantil-chiclayo','2024-03-26T17:00:00Z','2024-03-26T17:00:00Z'),

  ('70000000-0000-4000-8000-000000000006', NULL, '20000000-0000-4000-8000-000000000001',
   'found',
   'Encontré un perro adulto, mestizo grande, color negro opaco, sin collar. Muy asustado pero no agresivo. Lo tengo en casa de paso.',
   '2024-03-27T08:00:00Z','Av. Salaverry, La Victoria','140110',
   NULL,'987334455',FALSE,
   ARRAY['https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=600&q=80'],
   'perro-negro-encontrado-la-victoria','2024-03-27T09:00:00Z','2024-03-27T09:00:00Z'),

  ('70000000-0000-4000-8000-000000000007', NULL, '20000000-0000-4000-8000-000000000002',
   'lost',
   'Tortuga terrestre, caparazón marrón con manchas amarillas, 20 cm aprox. Se llama "Tuga". Escapó del jardín de casa durante el riego.',
   '2024-03-24T11:00:00Z','Urb. Santa Victoria, Chiclayo','140101',
   30,'955667788',FALSE, NULL,
   'tuga-tortuga-santa-victoria-chiclayo','2024-03-24T12:00:00Z','2024-03-24T12:00:00Z'),

  ('70000000-0000-4000-8000-000000000008', NULL, '20000000-0000-4000-8000-000000000003',
   'lost',
   'Gata adulta, siamesa, ojos azules, muy delgada. Collar celeste. Responde al nombre "Azul". Desapareció de azotea.',
   '2024-03-22T20:00:00Z','Calle Leoncio Prado, Ferreñafe','140201',
   80,'933445566',FALSE,
   ARRAY['https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&q=80'],
   'azul-gata-siamesa-ferrenafe','2024-03-22T21:00:00Z','2024-03-22T21:00:00Z'),

  ('70000000-0000-4000-8000-000000000009', NULL, '20000000-0000-4000-8000-000000000004',
   'found',
   'Encontré un cachorro mestizo, macho, color café rojizo, aproximadamente 3 meses. Estaba solo y llorando. Lo rescaté y busco a sus dueños o un hogar temporal.',
   '2024-03-28T14:00:00Z','Av. Progreso, Lambayeque ciudad','140301',
   NULL,'978123456',FALSE,
   ARRAY['https://images.unsplash.com/photo-1591160690555-5d7e4a9b0b7e?w=600&q=80','https://images.unsplash.com/photo-1503256207526-0d5523f31580?w=600&q=80'],
   'cachorro-cafe-encontrado-lambayeque','2024-03-28T15:00:00Z','2024-03-28T15:00:00Z'),

  ('70000000-0000-4000-8000-000000000010', NULL, '20000000-0000-4000-8000-000000000005',
   'lost',
   'Perro adulto, raza Schnauzer miniatura, color gris sal y pimienta. Collar naranja. Responde a "Pepe". Muy nervioso con extraños.',
   '2024-03-27T19:00:00Z','Urb. Los Parques, Chiclayo','140101',
   200,'912233445',FALSE,
   ARRAY['https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600&q=80'],
   'pepe-schnauzer-los-parques-chiclayo','2024-03-27T20:00:00Z','2024-03-27T20:00:00Z'),

  ('70000000-0000-4000-8000-000000000011', NULL, '20000000-0000-4000-8000-000000000001',
   'lost',
   'Conejo doméstico blanco con manchas negras, orejas largas. Se llama "Pintas". Escapó por la puerta entreabierta. Es muy dócil.',
   '2024-03-29T10:00:00Z','Jr. Bolívar, J.L.O.','140108',
   50,'956234567',FALSE, NULL,
   'pintas-conejo-jlo','2024-03-29T11:00:00Z','2024-03-29T11:00:00Z'),

  ('70000000-0000-4000-8000-000000000012', NULL, '20000000-0000-4000-8000-000000000002',
   'found',
   'Encontré un gato adulto, atigrado gris, bien cuidado, con signos de haber tenido dueño. Sin collar pero muy amigable. Lo tengo temporalmente.',
   '2024-03-29T15:00:00Z','Av. Augusto B. Leguía, Chiclayo','140101',
   NULL,'934123456',FALSE,
   ARRAY['https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&q=80'],
   'gato-atigrado-encontrado-chiclayo','2024-03-29T16:00:00Z','2024-03-29T16:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── 8. Sightings ──────────────────────────────────────────────
INSERT INTO lost_found_sightings (id, report_id, user_id, message, created_at) VALUES
  ('80000000-0000-4000-8000-000000000001','70000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',
   'Vi un perro parecido ayer cerca de la av. Chiclayo, cruzando hacia La Victoria. Tenía collar azul.',
   '2024-03-21T09:00:00Z'),
  ('80000000-0000-4000-8000-000000000002','70000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000004',
   'La vi corriendo por la carretera a Pítipo el domingo en la mañana. Iba sola.',
   '2024-03-19T08:00:00Z'),
  ('80000000-0000-4000-8000-000000000003','70000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000005',
   'Hay un vecino en Pítipo que encontró una perra parecida, pregunta por la plaza.',
   '2024-03-20T12:00:00Z'),
  ('80000000-0000-4000-8000-000000000004','70000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000004',
   'Vi una gata parecida en la calle Lora y Lora ayer por la noche.',
   '2024-03-23T07:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── 9. Donation campaigns ─────────────────────────────────────
INSERT INTO donation_campaigns (
  id, shelter_id, animal_id, title, description,
  goal_amount, current_amount, is_active, ends_at, slug,
  created_at, updated_at
) VALUES
  (
    '90000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000005',
    'Operación de Zeus — fractura de cadera',
    'Zeus fue rescatado con una fractura de cadera producto del maltrato. Necesita una operación urgente y fisioterapia. Cada sol ayuda a que pueda volver a caminar sin dolor y encontrar un hogar.',
    1200, 780, TRUE, '2024-05-31T23:59:59Z',
    'operacion-zeus-fractura-cadera',
    '2024-03-12T08:30:00Z','2024-03-28T15:00:00Z'
  ),
  (
    '90000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000001',
    NULL,
    'Fondo de alimentación mensual — Patitas Chiclayo',
    'Mantenemos más de 30 animales en nuestro albergue. El costo de alimentación mensual es de S/ 800. Tu donación asegura que ningún animal pase hambre mientras encuentra familia.',
    800, 430, TRUE, NULL,
    'fondo-alimentacion-patitas-chiclayo',
    '2024-03-01T09:00:00Z','2024-03-25T10:00:00Z'
  ),
  (
    '90000000-0000-4000-8000-000000000003',
    '30000000-0000-4000-8000-000000000002',
    NULL,
    'Renovación del área de cuarentena — Huellas Lambayeque',
    'Necesitamos mejorar nuestra área de cuarentena para recibir animales enfermos de forma segura. La inversión incluye jaulas nuevas, sistema de ventilación y desinfectante mensual.',
    2500, 1850, TRUE, '2024-06-30T23:59:59Z',
    'renovacion-cuarentena-huellas-lambayeque',
    '2024-02-20T11:00:00Z','2024-03-26T09:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ============================================================
-- Resumen de accesos creados:
--
-- Albergues (rol: shelter) — contraseña: PawRescue2024!
--   patitaschiclayo@gmail.com   → Patitas Chiclayo
--   huellaslamb@gmail.com       → Huellas Lambayeque
--   refugiosanisidro@gmail.com  → Refugio San Isidro
--   amigospeludos@gmail.com     → Amigos Peludos Chiclayo
--   gatitosfelices@gmail.com    → Gatitos Felices Lambayeque
--   rescatemoshoqueque@gmail.com→ Rescate Moshoqueque
--   patasycolas@gmail.com       → Patas y Colas Ferreñafe
--   lavictoriarescue@gmail.com  → La Victoria Animal Rescue
--
-- Usuarios adoptantes (rol: user) — contraseña: PawRescue2024!
--   usuario1@pawrescue.pe → María García
--   usuario2@pawrescue.pe → Carlos López
--   usuario3@pawrescue.pe → Ana Torres
--   usuario4@pawrescue.pe → Pedro Díaz
--   usuario5@pawrescue.pe → Rosa Mendoza
-- ============================================================
