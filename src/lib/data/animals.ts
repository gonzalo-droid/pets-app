import { createClient } from '@/lib/supabase/server'
import type { AnimalWithPhotos, AnimalFilters } from '@/types'

export async function getAnimals(filters?: AnimalFilters): Promise<AnimalWithPhotos[]> {
  const supabase = await createClient()

  let query = supabase
    .from('animals')
    .select('*, animal_photos(*)')
    .order('created_at', { ascending: false })

  if (filters?.species) query = query.eq('species', filters.species)
  if (filters?.size) query = query.eq('size', filters.size)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.ubigeo) query = query.eq('ubigeo', filters.ubigeo)
  if (filters?.department) {
    // Los ubigeos de Lambayeque empiezan en '14'
    const deptCode = filters.department === 'Lambayeque' ? '14' : null
    if (deptCode) query = query.like('ubigeo', `${deptCode}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[data/animals] getAnimals:', error.message)
    return []
  }

  return (data ?? []) as AnimalWithPhotos[]
}

export async function getAnimalBySlug(slug: string): Promise<AnimalWithPhotos | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('animals')
    .select('*, animal_photos(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[data/animals] getAnimalBySlug:', error.message)
    }
    return null
  }

  return data as AnimalWithPhotos
}

export async function getAnimalsByShelter(shelterId: string): Promise<AnimalWithPhotos[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('animals')
    .select('*, animal_photos(*)')
    .eq('shelter_id', shelterId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[data/animals] getAnimalsByShelter:', error.message)
    return []
  }

  return (data ?? []) as AnimalWithPhotos[]
}
