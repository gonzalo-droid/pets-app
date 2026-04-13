import type { AdoptionRequest } from '@/types'

// ─── Datos mock de solicitudes de adopción ────────────────────────────────────

export const MOCK_REQUESTS: AdoptionRequest[] = [
  {
    id: 'req-001',
    animal_id: 'animal-001', // Rocky
    requester_id: 'profile-user-010',
    shelter_id: 'shelter-001',
    message: 'Siempre quise tener un perro mediano. Tengo patio grande y mi familia está emocionada. Puedo comprometer tiempo y recursos para su cuidado.',
    has_home: true,
    has_other_pets: false,
    has_children: true,
    phone: '978123400',
    status: 'pending',
    created_at: '2024-03-25T10:00:00Z',
    updated_at: '2024-03-25T10:00:00Z',
  },
  {
    id: 'req-002',
    animal_id: 'animal-001', // Rocky
    requester_id: 'profile-user-011',
    shelter_id: 'shelter-001',
    message: 'Trabajo desde casa y puedo darle toda la atención que necesita. Vivo solo, departamento pequeño pero salgo a caminar 2 veces al día.',
    has_home: false,
    has_other_pets: false,
    has_children: false,
    phone: '943556677',
    status: 'reviewing',
    created_at: '2024-03-26T14:00:00Z',
    updated_at: '2024-03-27T09:00:00Z',
  },
  {
    id: 'req-003',
    animal_id: 'animal-002', // Luna
    requester_id: 'profile-user-012',
    shelter_id: 'shelter-001',
    message: 'Mi gata anterior falleció hace 6 meses. Tengo experiencia con gatos y el hogar perfecto para Luna. Sin perros ni niños.',
    has_home: false,
    has_other_pets: false,
    has_children: false,
    phone: '912345000',
    status: 'approved',
    created_at: '2024-03-20T08:00:00Z',
    updated_at: '2024-03-22T11:00:00Z',
  },
  {
    id: 'req-004',
    animal_id: 'animal-005', // Zeus
    requester_id: 'profile-user-013',
    shelter_id: 'shelter-001',
    message: 'Tenemos experiencia con perros grandes. Casa amplia en zona residencial. Dispuestos a darle el tiempo que necesite para adaptarse.',
    has_home: true,
    has_other_pets: true,
    has_children: false,
    phone: '966778899',
    status: 'rejected',
    created_at: '2024-03-18T16:00:00Z',
    updated_at: '2024-03-19T10:00:00Z',
  },
]

// Datos de requester (mock — en Supabase sería un join con profiles)
export const MOCK_REQUESTER_NAMES: Record<string, string> = {
  'profile-user-010': 'María Fernández',
  'profile-user-011': 'Carlos Díaz',
  'profile-user-012': 'Ana Quispe',
  'profile-user-013': 'Roberto Sánchez',
}

// Nombre de animal por id (mock — en Supabase sería un join con animals)
export const MOCK_ANIMAL_NAMES: Record<string, string> = {
  'animal-001': 'Rocky',
  'animal-002': 'Luna',
  'animal-005': 'Zeus',
}

// ─── Funciones async ──────────────────────────────────────────────────────────

export async function getRequestsByShelter(shelterId: string): Promise<AdoptionRequest[]> {
  return MOCK_REQUESTS.filter((r) => r.shelter_id === shelterId)
}

export async function getRequestById(id: string): Promise<AdoptionRequest | null> {
  return MOCK_REQUESTS.find((r) => r.id === id) ?? null
}
