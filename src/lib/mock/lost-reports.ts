import type { LostReportWithSightings, LostReportFilters } from '@/types'

// ─── Data mock de reportes perdidos/encontrados — Lambayeque ─────────────────

export const MOCK_LOST_REPORTS: LostReportWithSightings[] = [
  {
    id: 'report-001',
    animal_id: null, // Animal externo al sistema
    reported_by: 'profile-user-001',
    type: 'lost',
    description:
      'Cachorro macho, mestizo, color negro con patas blancas. Collar azul con placa "Coco". Se perdió cerca del mercado Moshoqueque. Es muy amigable y se acerca a las personas.',
    last_seen_at: '2024-03-20T14:00:00Z',
    last_seen_address: 'Mercado Moshoqueque, av. César Vallejo, José Leonardo Ortiz',
    ubigeo: '140108', // Chiclayo / Chiclayo / José Leonardo Ortiz
    reward_amount: 100,
    contact_phone: '955321456',
    is_resolved: false,
    slug: 'coco-cachorro-negro-jose-leonardo-ortiz',
    created_at: '2024-03-20T16:00:00Z',
    updated_at: '2024-03-20T16:00:00Z',
    sightings: [
      {
        id: 'sighting-001a',
        report_id: 'report-001',
        user_id: 'profile-user-002',
        message: 'Vi un perro parecido ayer cerca de la av. Chiclayo, cruzando hacia La Victoria. Tenía collar azul.',
        created_at: '2024-03-21T09:00:00Z',
      },
    ],
  },
  {
    id: 'report-002',
    animal_id: null,
    reported_by: 'profile-user-002',
    type: 'found',
    description:
      'Encontré una gata adulta, color gris perla, pelo corto, muy dócil y limpia. Parece ser mascota doméstica. La tengo en casa temporalmente. Si es tuya, contáctame.',
    last_seen_at: '2024-03-22T10:00:00Z',
    last_seen_address: 'Urb. Los Parques, calle Los Cerezos, Chiclayo',
    ubigeo: '140101',
    reward_amount: null,
    contact_phone: '943111222',
    is_resolved: false,
    slug: 'gata-gris-encontrada-los-parques-chiclayo',
    created_at: '2024-03-22T11:00:00Z',
    updated_at: '2024-03-22T11:00:00Z',
    sightings: [],
  },
  {
    id: 'report-003',
    animal_id: null,
    reported_by: 'profile-user-003',
    type: 'lost',
    description:
      'Perra adulta, raza golden retriever, pelo largo dorado, muy obediente. Responde al nombre "Nala". Desapareció durante un paseo. Lleva microchip. Recompensa para quien ayude a encontrarla.',
    last_seen_at: '2024-03-18T07:00:00Z',
    last_seen_address: 'Parque principal de Ferreñafe, frente a la Municipalidad',
    ubigeo: '140201', // Chiclayo / Ferreñafe / Ferreñafe
    reward_amount: 300,
    contact_phone: '966789012',
    is_resolved: false,
    slug: 'nala-golden-retriever-ferrenafe',
    created_at: '2024-03-18T09:00:00Z',
    updated_at: '2024-03-18T09:00:00Z',
    sightings: [
      {
        id: 'sighting-003a',
        report_id: 'report-003',
        user_id: 'profile-user-004',
        message: 'La vi corriendo por la carretera a Pítipo el domingo en la mañana. Iba sola.',
        created_at: '2024-03-19T08:00:00Z',
      },
      {
        id: 'sighting-003b',
        report_id: 'report-003',
        user_id: 'profile-user-005',
        message: 'Hay un vecino en Pítipo que encontró una perra parecida, pregunta por la plaza.',
        created_at: '2024-03-20T12:00:00Z',
      },
    ],
  },
  {
    id: 'report-004',
    animal_id: null,
    reported_by: 'profile-user-004',
    type: 'lost',
    description:
      'Gato macho, atigrado naranja, 3 años aprox, castrado. Le falta una oreja (señal de rescate previo). Se llama Manchas. Escapó por la ventana, vive en el 4to piso.',
    last_seen_at: '2024-03-25T20:00:00Z',
    last_seen_address: 'Calle San José 567, Lambayeque ciudad',
    ubigeo: '140301',
    reward_amount: 50,
    contact_phone: '912345678',
    is_resolved: false,
    slug: 'manchas-gato-atigrado-lambayeque',
    created_at: '2024-03-25T21:00:00Z',
    updated_at: '2024-03-25T21:00:00Z',
    sightings: [],
  },
]

// ─── Funciones async — misma firma que usará Supabase ─────────────────────────

export async function getLostReports(
  filters?: LostReportFilters
): Promise<LostReportWithSightings[]> {
  return MOCK_LOST_REPORTS.filter((r) => {
    if (filters?.type && r.type !== filters.type) return false
    if (filters?.is_resolved !== undefined && r.is_resolved !== filters.is_resolved) return false
    if (filters?.ubigeo && r.ubigeo !== filters.ubigeo) return false
    if (filters?.department) {
      const deptCode = filters.department === 'Lambayeque' ? '14' : null
      if (deptCode && !r.ubigeo.startsWith(deptCode)) return false
    }
    return true
  })
}

export async function getLostReportBySlug(
  slug: string
): Promise<LostReportWithSightings | null> {
  return MOCK_LOST_REPORTS.find((r) => r.slug === slug) ?? null
}
