// Tipos derivados del schema de Supabase — alineados 1:1 con las tablas.
// Cuando conectemos Supabase CLI, este archivo será reemplazado por el generado
// con `supabase gen types typescript --local > src/types/database.ts`.

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'shelter' | 'admin'
export type AnimalSpecies = 'dog' | 'cat' | 'other'
export type AnimalSize = 'small' | 'medium' | 'large'
export type AnimalGender = 'male' | 'female' | 'unknown'

export type AnimalStatus =
  | 'available'
  | 'in_process'
  | 'adopted'
  | 'lost'
  | 'found'
  | 'reunited'

export type AdoptionStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'completed'

export type ReportType = 'lost' | 'found'
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded'
export type PaymentProvider = 'manual'
export type NotificationType =
  | 'adoption_approved'
  | 'adoption_rejected'
  | 'donation_confirmed'
  | 'new_sighting'
  | 'general'

// ─── Tablas de base de datos ──────────────────────────────────────────────────

export interface PeruLocation {
  id: string
  department: string
  province: string
  district: string
  ubigeo: string // código INEI 6 dígitos
}

export interface Profile {
  id: string // → auth.users.id
  full_name: string
  avatar_url: string | null
  phone: string | null
  ubigeo: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Shelter {
  id: string
  profile_id: string
  name: string
  description: string | null
  long_description: string | null   // historia / descripción larga
  address: string | null
  ubigeo: string
  phone: string | null
  email: string | null
  whatsapp: string | null           // número sin código de país
  instagram: string | null
  facebook: string | null
  tiktok: string | null             // handle sin @
  avatar_url: string | null
  banner_url: string | null
  is_verified: boolean
  // Datos de pago
  yape_number: string | null
  bank_account: string | null // CCI
  bank_name: string | null
  account_holder: string | null
  created_at: string
  updated_at: string
}

export interface Animal {
  id: string
  shelter_id: string
  posted_by: string // profile_id
  name: string
  species: AnimalSpecies
  breed: string | null
  age_months: number | null
  size: AnimalSize
  gender: AnimalGender
  color: string | null
  description: string | null
  is_vaccinated: boolean
  is_neutered: boolean
  is_microchipped: boolean
  status: AnimalStatus
  ubigeo: string
  slug: string
  created_at: string
  updated_at: string
}

export interface AnimalPhoto {
  id: string
  animal_id: string
  url: string
  is_cover: boolean
  order_index: number
}

export interface AdoptionRequest {
  id: string
  animal_id: string
  requester_id: string
  shelter_id: string
  message: string | null
  has_home: boolean // ¿tiene patio o espacio?
  has_other_pets: boolean
  has_children: boolean
  phone: string
  status: AdoptionStatus
  created_at: string
  updated_at: string
}

export interface LostFoundReport {
  id: string
  animal_id: string | null // puede ser un animal del sistema o externo
  reported_by: string // profile_id
  type: ReportType
  description: string
  last_seen_at: string // ISO date
  last_seen_address: string | null
  ubigeo: string
  reward_amount: number | null // en PEN
  contact_phone: string
  is_resolved: boolean
  photo_urls: string[] | null
  slug: string
  created_at: string
  updated_at: string
}

export interface LostFoundSighting {
  id: string
  report_id: string
  user_id: string
  message: string
  created_at: string
}

export interface DonationCampaign {
  id: string
  shelter_id: string
  animal_id: string | null // null = campaña general del albergue
  title: string
  description: string | null
  goal_amount: number // en PEN
  current_amount: number // en PEN
  currency: 'PEN'
  is_active: boolean
  ends_at: string | null // ISO date
  slug: string
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  campaign_id: string
  donor_id: string
  amount: number // en PEN
  currency: 'PEN'
  payment_provider: PaymentProvider
  payment_status: PaymentStatus
  receipt_url: string | null // Supabase Storage URL
  is_anonymous: boolean
  message: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null // jsonb
  is_read: boolean
  created_at: string
}

// ─── Tipos compuestos (joins frecuentes) ──────────────────────────────────────

export interface AnimalWithPhotos extends Animal {
  animal_photos: AnimalPhoto[]
}

export interface AnimalWithShelter extends AnimalWithPhotos {
  shelter: Pick<Shelter, 'id' | 'name' | 'avatar_url' | 'ubigeo' | 'is_verified'>
}

export interface CampaignWithShelter extends DonationCampaign {
  shelter: Pick<Shelter, 'id' | 'name' | 'avatar_url'>
  animal: Pick<Animal, 'id' | 'name' | 'species'> | null
}

export interface LostReportWithSightings extends LostFoundReport {
  sightings: LostFoundSighting[]
}

export interface ShelterPhoto {
  id: string
  shelter_id: string
  url: string
  order_index: number
}

export interface ShelterWithPhotos extends Shelter {
  shelter_photos: ShelterPhoto[]
}
