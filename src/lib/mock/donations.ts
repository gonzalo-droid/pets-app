import type { Donation } from '@/types'

// ─── Datos mock de donaciones ─────────────────────────────────────────────────

export const MOCK_DONATIONS: Donation[] = [
  {
    id: 'don-001',
    campaign_id: 'campaign-001',
    donor_id: 'profile-user-020',
    amount: 50,
    currency: 'PEN',
    payment_provider: 'manual',
    payment_status: 'pending',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    is_anonymous: false,
    message: '¡Fuerza Zeus! 🐾',
    created_at: '2024-03-27T10:30:00Z',
    updated_at: '2024-03-27T10:30:00Z',
  },
  {
    id: 'don-002',
    campaign_id: 'campaign-001',
    donor_id: 'profile-user-021',
    amount: 100,
    currency: 'PEN',
    payment_provider: 'manual',
    payment_status: 'approved',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    is_anonymous: true,
    message: null,
    created_at: '2024-03-26T16:00:00Z',
    updated_at: '2024-03-26T18:00:00Z',
  },
  {
    id: 'don-003',
    campaign_id: 'campaign-002',
    donor_id: 'profile-user-022',
    amount: 20,
    currency: 'PEN',
    payment_provider: 'manual',
    payment_status: 'pending',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    is_anonymous: false,
    message: 'Pequeño aporte, gran causa.',
    created_at: '2024-03-28T09:00:00Z',
    updated_at: '2024-03-28T09:00:00Z',
  },
  {
    id: 'don-004',
    campaign_id: 'campaign-003',
    donor_id: 'profile-user-023',
    amount: 200,
    currency: 'PEN',
    payment_provider: 'manual',
    payment_status: 'approved',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    is_anonymous: false,
    message: 'Mucho ánimo para Huellas Lambayeque.',
    created_at: '2024-03-24T14:00:00Z',
    updated_at: '2024-03-24T16:00:00Z',
  },
  {
    id: 'don-005',
    campaign_id: 'campaign-001',
    donor_id: 'profile-user-024',
    amount: 30,
    currency: 'PEN',
    payment_provider: 'manual',
    payment_status: 'rejected',
    receipt_url: null,
    is_anonymous: false,
    message: null,
    created_at: '2024-03-25T11:00:00Z',
    updated_at: '2024-03-25T12:00:00Z',
  },
]

export const MOCK_DONOR_NAMES: Record<string, string> = {
  'profile-user-020': 'Lucía Torres',
  'profile-user-021': 'Anónimo',
  'profile-user-022': 'Pedro Llontop',
  'profile-user-023': 'Sandra Vásquez',
  'profile-user-024': 'Miguel Campos',
}

export const MOCK_CAMPAIGN_TITLES: Record<string, string> = {
  'campaign-001': 'Operación de Zeus',
  'campaign-002': 'Fondo de alimentación',
  'campaign-003': 'Renovación cuarentena',
}

// ─── Funciones async ──────────────────────────────────────────────────────────

export async function getDonationsByCampaigns(campaignIds: string[]): Promise<Donation[]> {
  return MOCK_DONATIONS.filter((d) => campaignIds.includes(d.campaign_id))
}

export async function getDonationById(id: string): Promise<Donation | null> {
  return MOCK_DONATIONS.find((d) => d.id === id) ?? null
}
