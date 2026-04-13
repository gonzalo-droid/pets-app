import type { Shelter } from '@/types'
import type { CampaignFilters } from '@/types'

// ─── Data mock de albergues en Lambayeque ─────────────────────────────────────

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: 'shelter-001',
    profile_id: 'profile-shelter-001',
    name: 'Patitas Chiclayo',
    description:
      'Albergue sin fines de lucro dedicado al rescate y adopción responsable de animales en Chiclayo. Operamos desde 2018 con voluntarios comprometidos.',
    address: 'Calle Los Mochicas 345, Urb. Santa Victoria',
    ubigeo: '140101', // Lambayeque / Chiclayo / Chiclayo
    phone: '979123456',
    email: 'patitaschiclayo@gmail.com',
    instagram: 'patitaschiclayo',
    facebook: 'patitaschiclayo',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=patitas',
    banner_url: null,
    is_verified: true,
    yape_number: '979123456',
    bank_account: '00219012345678901234', // CCI BCP ficticio
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
    address: 'Av. Ramón Castilla 890',
    ubigeo: '140301', // Lambayeque / Lambayeque / Lambayeque
    phone: '943678901',
    email: 'huellaslamb@gmail.com',
    instagram: 'huellasLambayeque',
    facebook: 'huellasLambayeque',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=huellas',
    banner_url: null,
    is_verified: true,
    yape_number: '943678901',
    bank_account: '00349087654321098765',
    bank_name: 'Interbank',
    account_holder: 'Huellas Lambayeque EIRL',
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-03-15T09:00:00Z',
  },
]

// ─── Funciones async — misma firma que usará Supabase ─────────────────────────

export async function getShelters(): Promise<Shelter[]> {
  return MOCK_SHELTERS.filter((s) => s.is_verified)
}

export async function getShelterById(id: string): Promise<Shelter | null> {
  return MOCK_SHELTERS.find((s) => s.id === id) ?? null
}
