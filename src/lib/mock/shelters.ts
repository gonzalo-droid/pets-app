import type { Shelter, ShelterWithPhotos, ShelterPhoto } from '@/types'

// ─── Data mock de albergues en Lambayeque ─────────────────────────────────────

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: 'shelter-001',
    profile_id: 'profile-shelter-001',
    name: 'Patitas Chiclayo',
    description:
      'Albergue sin fines de lucro dedicado al rescate y adopción responsable de animales en Chiclayo. Operamos desde 2018 con voluntarios comprometidos.',
    long_description:
      'Patitas Chiclayo nació en 2018 de la mano de un grupo de voluntarios que encontraron a más de 20 perros en situación de abandono en el distrito de Santa Victoria. Lo que empezó como un rescate de emergencia se convirtió en una organización sin fines de lucro registrada ante los Registros Públicos de Lambayeque.\n\nHoy contamos con un albergue propio con capacidad para 60 animales, un equipo de 15 voluntarios permanentes y alianzas con 3 clínicas veterinarias de Chiclayo que nos brindan atención a precio social.\n\nNuestra misión es rescatar, rehabilitar y encontrar hogares responsables para perros y gatos en situación de riesgo en la región Lambayeque. Creemos en la adopción responsable y acompañamos a las familias antes y después del proceso.',
    address: 'Calle Los Mochicas 345, Urb. Santa Victoria',
    ubigeo: '140101',
    phone: '979123456',
    email: 'patitaschiclayo@gmail.com',
    whatsapp: '979123456',
    instagram: 'patitaschiclayo',
    facebook: 'patitaschiclayo',
    tiktok: 'patitaschiclayo',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=patitas',
    banner_url: 'https://picsum.photos/seed/patitas-banner/1200/400',
    is_verified: true,
    yape_number: '979123456',
    bank_account: '00219012345678901234',
    bank_name: 'BCP',
    account_holder: 'Asociación Patitas Chiclayo',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'shelter-002',
    profile_id: 'profile-shelter-002',
    name: 'Huellas Lambayeque',
    description:
      'Refugio familiar en Lambayeque ciudad. Acogemos perros y gatos maltratados o abandonados y buscamos hogares responsables en toda la región.',
    long_description:
      'Huellas Lambayeque es un refugio familiar que funciona desde 2020 en la ciudad de Lambayeque. Somos una familia que decidió abrir las puertas de nuestra casa para acoger animales en situación de maltrato o abandono.\n\nA diferencia de los albergues grandes, nosotros operamos en un modelo de casa-hogar donde los animales conviven con personas en un ambiente familiar. Esto nos permite rehabilitar casos de trauma y maltrato con mejores resultados.\n\nTenemos capacidad para 25 animales y trabajamos con la Municipalidad Provincial de Lambayeque en campañas de esterilización y adopción masiva.',
    address: 'Av. Ramón Castilla 890',
    ubigeo: '140301',
    phone: '943678901',
    email: 'huellaslamb@gmail.com',
    whatsapp: '943678901',
    instagram: 'huellasLambayeque',
    facebook: 'huellasLambayeque',
    tiktok: null,
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=huellas',
    banner_url: 'https://picsum.photos/seed/huellas-banner/1200/400',
    is_verified: true,
    yape_number: '943678901',
    bank_account: '00349087654321098765',
    bank_name: 'Interbank',
    account_holder: 'Huellas Lambayeque EIRL',
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-03-15T09:00:00Z',
  },
  // ─── Albergues extra para probar paginación ──────────────────────────────────
  {
    id: 'shelter-003', profile_id: 'profile-shelter-003',
    name: 'Refugio San Isidro', description: 'Refugio comunitario en Ferreñafe especializado en rescate de animales en situación de maltrato y abandono.',
    long_description: null, address: 'Av. Bolognesi 120, Ferreñafe', ubigeo: '140201',
    phone: '956112233', email: 'refugiosanisidro@gmail.com', whatsapp: '956112233',
    instagram: 'refugiosanisidro', facebook: 'refugiosanisidro', tiktok: null,
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sanisidro', banner_url: null,
    is_verified: true, yape_number: '956112233', bank_account: null, bank_name: null, account_holder: null,
    created_at: '2024-02-01T10:00:00Z', updated_at: '2024-03-10T10:00:00Z',
  },
  {
    id: 'shelter-004', profile_id: 'profile-shelter-004',
    name: 'Amigos Peludos Chiclayo', description: 'Organización de rescatistas independientes que trabajan en red para colocar animales callejeros en hogares temporales.',
    long_description: null, address: 'Urb. Patasca, Chiclayo', ubigeo: '140101',
    phone: '921456789', email: 'amigospeludos@gmail.com', whatsapp: '921456789',
    instagram: 'amigospeludoschi', facebook: 'amigospeludoschi', tiktok: 'amigospeludoschi',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=amigospeludos', banner_url: null,
    is_verified: true, yape_number: '921456789', bank_account: null, bank_name: null, account_holder: null,
    created_at: '2024-02-15T10:00:00Z', updated_at: '2024-03-20T10:00:00Z',
  },
  {
    id: 'shelter-005', profile_id: 'profile-shelter-005',
    name: 'Gatitos Felices Lambayeque', description: 'Albergue especializado en gatos domésticos y callejeros. Contamos con área de socialización y seguimiento post-adopción.',
    long_description: null, address: 'Calle Dos de Mayo 456, Lambayeque', ubigeo: '140301',
    phone: '934567890', email: 'gatitosfelices@gmail.com', whatsapp: '934567890',
    instagram: 'gatitosfeliceslam', facebook: null, tiktok: null,
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=gatitos', banner_url: null,
    is_verified: true, yape_number: '934567890', bank_account: null, bank_name: null, account_holder: null,
    created_at: '2024-03-01T10:00:00Z', updated_at: '2024-03-25T10:00:00Z',
  },
  {
    id: 'shelter-006', profile_id: 'profile-shelter-006',
    name: 'Rescate Moshoqueque', description: 'Grupo de voluntarios que rescatan animales del mercado Moshoqueque y zonas aledañas de José Leonardo Ortiz.',
    long_description: null, address: 'Av. César Vallejo 890, J.L.O.', ubigeo: '140108',
    phone: '945678901', email: 'rescatemoshoqueque@gmail.com', whatsapp: '945678901',
    instagram: 'rescatemosho', facebook: 'rescatemosho', tiktok: null,
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=moshoqueque', banner_url: null,
    is_verified: true, yape_number: '945678901', bank_account: null, bank_name: null, account_holder: null,
    created_at: '2024-03-05T10:00:00Z', updated_at: '2024-03-22T10:00:00Z',
  },
  {
    id: 'shelter-007', profile_id: 'profile-shelter-007',
    name: 'Patas y Colas Ferreñafe', description: 'Pequeño refugio familiar en Ferreñafe con énfasis en adopciones responsables y seguimiento post-adopción.',
    long_description: null, address: 'Calle Unión 340, Ferreñafe', ubigeo: '140201',
    phone: '912345678', email: 'patasycolas@gmail.com', whatsapp: '912345678',
    instagram: null, facebook: 'patasycolas', tiktok: null,
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=patasycolas', banner_url: null,
    is_verified: true, yape_number: null, bank_account: '00219099887766554433', bank_name: 'BCP', account_holder: 'Patas y Colas',
    created_at: '2024-03-08T10:00:00Z', updated_at: '2024-03-28T10:00:00Z',
  },
  {
    id: 'shelter-008', profile_id: 'profile-shelter-008',
    name: 'La Victoria Animal Rescue', description: 'Rescatistas del distrito de La Victoria. Especializados en perros medianos y grandes con historial de maltrato.',
    long_description: null, address: 'Av. Grau 567, La Victoria', ubigeo: '140110',
    phone: '967890123', email: 'lavictoriarescue@gmail.com', whatsapp: '967890123',
    instagram: 'lavictoriarescue', facebook: 'lavictoriarescue', tiktok: 'lavictoriarescue',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=lavictoria', banner_url: null,
    is_verified: true, yape_number: '967890123', bank_account: null, bank_name: null, account_holder: null,
    created_at: '2024-03-12T10:00:00Z', updated_at: '2024-03-29T10:00:00Z',
  },
]

// ─── Fotos de galería mock ─────────────────────────────────────────────────────

export const MOCK_SHELTER_PHOTOS: ShelterPhoto[] = [
  { id: 'sp-001', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas1/600/400', order_index: 0 },
  { id: 'sp-002', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas2/600/400', order_index: 1 },
  { id: 'sp-003', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas3/600/400', order_index: 2 },
  { id: 'sp-004', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas4/600/400', order_index: 3 },
  { id: 'sp-005', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas5/600/400', order_index: 4 },
  { id: 'sp-006', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas1/600/400', order_index: 0 },
  { id: 'sp-007', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas2/600/400', order_index: 1 },
  { id: 'sp-008', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas3/600/400', order_index: 2 },
  { id: 'sp-009', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas4/600/400', order_index: 3 },
]

// ─── Funciones async — misma firma que usará Supabase ─────────────────────────

export async function getShelters(): Promise<Shelter[]> {
  return MOCK_SHELTERS.filter((s) => s.is_verified)
}

export async function getShelterById(id: string): Promise<Shelter | null> {
  return MOCK_SHELTERS.find((s) => s.id === id) ?? null
}

export async function getShelterWithPhotos(id: string): Promise<ShelterWithPhotos | null> {
  const shelter = MOCK_SHELTERS.find((s) => s.id === id)
  if (!shelter) return null
  const photos = MOCK_SHELTER_PHOTOS
    .filter((p) => p.shelter_id === id)
    .sort((a, b) => a.order_index - b.order_index)
  return { ...shelter, shelter_photos: photos }
}
