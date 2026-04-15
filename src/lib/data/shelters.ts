import { createClient } from '@/lib/supabase/server'
import type { Shelter, ShelterWithPhotos } from '@/types'

export async function getShelters(): Promise<Shelter[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .eq('is_verified', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[data/shelters] getShelters:', error.message)
    return []
  }

  return (data ?? []) as Shelter[]
}

export async function getShelterById(id: string): Promise<Shelter | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[data/shelters] getShelterById:', error.message)
    }
    return null
  }

  return data as Shelter
}

export async function getShelterWithPhotos(id: string): Promise<ShelterWithPhotos | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shelters')
    .select('*, shelter_photos(*)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[data/shelters] getShelterWithPhotos:', error.message)
    }
    return null
  }

  // Ordenar fotos por order_index
  const shelter = data as ShelterWithPhotos
  shelter.shelter_photos = (shelter.shelter_photos ?? []).sort(
    (a, b) => a.order_index - b.order_index
  )

  return shelter
}
