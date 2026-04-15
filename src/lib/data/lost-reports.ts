import { createClient } from '@/lib/supabase/server'
import type { LostReportWithSightings, LostReportFilters } from '@/types'

export async function getLostReports(
  filters?: LostReportFilters
): Promise<LostReportWithSightings[]> {
  const supabase = await createClient()

  let query = supabase
    .from('lost_found_reports')
    .select('*, sightings:lost_found_sightings(*)')
    .order('created_at', { ascending: false })

  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.is_resolved !== undefined) query = query.eq('is_resolved', filters.is_resolved)
  if (filters?.ubigeo) query = query.eq('ubigeo', filters.ubigeo)
  if (filters?.department) {
    const deptCode = filters.department === 'Lambayeque' ? '14' : null
    if (deptCode) query = query.like('ubigeo', `${deptCode}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[data/lost-reports] getLostReports:', error.message)
    return []
  }

  return (data ?? []) as LostReportWithSightings[]
}

export async function getLostReportBySlug(
  slug: string
): Promise<LostReportWithSightings | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lost_found_reports')
    .select('*, sightings:lost_found_sightings(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[data/lost-reports] getLostReportBySlug:', error.message)
    }
    return null
  }

  return data as LostReportWithSightings
}
