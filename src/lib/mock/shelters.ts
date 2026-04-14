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
