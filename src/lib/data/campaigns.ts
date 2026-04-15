import { createClient } from '@/lib/supabase/server'
import type { CampaignWithShelter, CampaignFilters } from '@/types'

// Supabase devuelve los datos con snake_case. El campo `currency` no existe en la
// tabla (siempre es PEN), así que lo inyectamos al mapear.
type RawCampaign = Omit<CampaignWithShelter, 'currency' | 'animal'> & {
  currency?: never
  shelter: { id: string; name: string; avatar_url: string | null }
  animal: { id: string; name: string; species: string } | null
}

function mapCampaign(raw: RawCampaign): CampaignWithShelter {
  return {
    ...raw,
    currency: 'PEN',
    animal: raw.animal
      ? { id: raw.animal.id, name: raw.animal.name, species: raw.animal.species as import('@/types').AnimalSpecies }
      : null,
  }
}

export async function getCampaigns(
  filters?: CampaignFilters
): Promise<CampaignWithShelter[]> {
  const supabase = await createClient()

  let query = supabase
    .from('donation_campaigns')
    .select(`
      *,
      shelter:shelters ( id, name, avatar_url ),
      animal:animals ( id, name, species )
    `)
    .order('created_at', { ascending: false })

  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active)
  if (filters?.shelter_id) query = query.eq('shelter_id', filters.shelter_id)
  if (filters?.animal_id) query = query.eq('animal_id', filters.animal_id)

  const { data, error } = await query

  if (error) {
    console.error('[data/campaigns] getCampaigns:', error.message)
    return []
  }

  return (data ?? []).map((c) => mapCampaign(c as RawCampaign))
}

export async function getCampaignBySlug(
  slug: string
): Promise<CampaignWithShelter | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('donation_campaigns')
    .select(`
      *,
      shelter:shelters ( id, name, avatar_url ),
      animal:animals ( id, name, species )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[data/campaigns] getCampaignBySlug:', error.message)
    }
    return null
  }

  return mapCampaign(data as RawCampaign)
}
