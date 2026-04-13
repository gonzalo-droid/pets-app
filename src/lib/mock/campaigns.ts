import type { CampaignWithShelter, CampaignFilters } from '@/types'

// ─── Data mock de campañas de donación ────────────────────────────────────────

export const MOCK_CAMPAIGNS: CampaignWithShelter[] = [
  {
    id: 'campaign-001',
    shelter_id: 'shelter-001',
    animal_id: 'animal-005', // Campaña por Zeus (recuperación)
    title: 'Operación de Zeus — fractura de cadera',
    description:
      'Zeus fue rescatado con una fractura de cadera producto del maltrato. Necesita una operación urgente y fisioterapia. Cada sol ayuda a que pueda volver a caminar sin dolor y encontrar un hogar.',
    goal_amount: 1200,
    current_amount: 780,
    currency: 'PEN',
    is_active: true,
    ends_at: '2024-05-31T23:59:59Z',
    slug: 'operacion-zeus-fractura-cadera',
    created_at: '2024-03-12T08:30:00Z',
    updated_at: '2024-03-28T15:00:00Z',
    shelter: {
      id: 'shelter-001',
      name: 'Patitas Chiclayo',
      avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=patitas',
    },
    animal: {
      id: 'animal-005',
      name: 'Zeus',
      species: 'dog',
    },
  },
  {
    id: 'campaign-002',
    shelter_id: 'shelter-001',
    animal_id: null, // Campaña general
    title: 'Fondo de alimentación mensual — Patitas Chiclayo',
    description:
      'Mantenemos más de 30 animales en nuestro albergue. El costo de alimentación mensual es de S/ 800. Tu donación asegura que ningún animal pase hambre mientras encuentra familia.',
    goal_amount: 800,
    current_amount: 430,
    currency: 'PEN',
    is_active: true,
    ends_at: null, // Campaña recurrente sin fecha de cierre
    slug: 'fondo-alimentacion-patitas-chiclayo',
    created_at: '2024-03-01T09:00:00Z',
    updated_at: '2024-03-25T10:00:00Z',
    shelter: {
      id: 'shelter-001',
      name: 'Patitas Chiclayo',
      avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=patitas',
    },
    animal: null,
  },
  {
    id: 'campaign-003',
    shelter_id: 'shelter-002',
    animal_id: null,
    title: 'Renovación del área de cuarentena — Huellas Lambayeque',
    description:
      'Necesitamos mejorar nuestra área de cuarentena para recibir animales enfermos de forma segura. La inversión incluye jaulas nuevas, sistema de ventilación y desinfectante mensual.',
    goal_amount: 2500,
    current_amount: 1850,
    currency: 'PEN',
    is_active: true,
    ends_at: '2024-06-30T23:59:59Z',
    slug: 'renovacion-cuarentena-huellas-lambayeque',
    created_at: '2024-02-20T11:00:00Z',
    updated_at: '2024-03-26T09:00:00Z',
    shelter: {
      id: 'shelter-002',
      name: 'Huellas Lambayeque',
      avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=huellas',
    },
    animal: null,
  },
]

// ─── Funciones async — misma firma que usará Supabase ─────────────────────────

export async function getCampaigns(
  filters?: CampaignFilters
): Promise<CampaignWithShelter[]> {
  return MOCK_CAMPAIGNS.filter((c) => {
    if (filters?.is_active !== undefined && c.is_active !== filters.is_active) return false
    if (filters?.shelter_id && c.shelter_id !== filters.shelter_id) return false
    if (filters?.animal_id && c.animal_id !== filters.animal_id) return false
    return true
  })
}

export async function getCampaignBySlug(
  slug: string
): Promise<CampaignWithShelter | null> {
  return MOCK_CAMPAIGNS.find((c) => c.slug === slug) ?? null
}
