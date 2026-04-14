import type { LostReportWithSightings, LostReportFilters } from '@/types'

// ─── Data mock de reportes perdidos/encontrados — Lambayeque ─────────────────

export const MOCK_LOST_REPORTS: LostReportWithSightings[] = [
  {
    id: 'report-001',
    animal_id: null,
    reported_by: 'profile-user-001',
    type: 'lost',
    description:
      'Cachorro macho, mestizo, color negro con patas blancas. Collar azul con placa "Coco". Se perdió cerca del mercado Moshoqueque. Es muy amigable y se acerca a las personas.',
    last_seen_at: '2024-03-20T14:00:00Z',
    last_seen_address: 'Mercado Moshoqueque, av. César Vallejo, José Leonardo Ortiz',
    ubigeo: '140108',
    reward_amount: 100,
    contact_phone: '955321456',
    is_resolved: false,
    photo_urls: [
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    ],
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
    photo_urls: [
      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=80',
    ],
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
    ubigeo: '140201',
    reward_amount: 300,
    contact_phone: '966789012',
    is_resolved: false,
    photo_urls: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80',
    ],
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
    photo_urls: null,
    slug: 'manchas-gato-atigrado-lambayeque',
    created_at: '2024-03-25T21:00:00Z',
    updated_at: '2024-03-25T21:00:00Z',
    sightings: [],
  },
  // ─── Reportes extra para probar paginación ───────────────────────────────────
  {
    id: 'report-005', animal_id: null, reported_by: 'profile-user-005', type: 'lost',
    description: 'Perro pequeño, raza Pomerania, color crema, responde al nombre "Cuki". Collar rosa con cascabel. Se perdió en el parque Infantil de Chiclayo.',
    last_seen_at: '2024-03-26T16:00:00Z', last_seen_address: 'Parque Infantil, Chiclayo',
    ubigeo: '140101', reward_amount: 150, contact_phone: '999001122', is_resolved: false,
    photo_urls: ['https://images.unsplash.com/photo-1617526738882-1ea945ce3ff5?w=600&q=80'],
    slug: 'cuki-pomerania-parque-infantil-chiclayo',
    created_at: '2024-03-26T17:00:00Z', updated_at: '2024-03-26T17:00:00Z', sightings: [],
  },
  {
    id: 'report-006', animal_id: null, reported_by: 'profile-user-006', type: 'found',
    description: 'Encontré un perro adulto, mestizo grande, color negro opaco, sin collar. Muy asustado pero no agresivo. Lo tengo en casa de paso.',
    last_seen_at: '2024-03-27T08:00:00Z', last_seen_address: 'Av. Salaverry, La Victoria',
    ubigeo: '140110', reward_amount: null, contact_phone: '987334455', is_resolved: false,
    photo_urls: ['https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=600&q=80'],
    slug: 'perro-negro-encontrado-la-victoria',
    created_at: '2024-03-27T09:00:00Z', updated_at: '2024-03-27T09:00:00Z', sightings: [],
  },
  {
    id: 'report-007', animal_id: null, reported_by: 'profile-user-007', type: 'lost',
    description: 'Tortuga terrestre, caparazón marrón con manchas amarillas, 20 cm aprox. Se llama "Tuga". Escapó del jardín de casa durante el riego.',
    last_seen_at: '2024-03-24T11:00:00Z', last_seen_address: 'Urb. Santa Victoria, Chiclayo',
    ubigeo: '140101', reward_amount: 30, contact_phone: '955667788', is_resolved: false,
    photo_urls: null,
    slug: 'tuga-tortuga-santa-victoria-chiclayo',
    created_at: '2024-03-24T12:00:00Z', updated_at: '2024-03-24T12:00:00Z', sightings: [],
  },
  {
    id: 'report-008', animal_id: null, reported_by: 'profile-user-008', type: 'lost',
    description: 'Gata adulta, siamesa, ojos azules, muy delgada. Collar celeste. Responde al nombre "Azul". Desapareció de azotea.',
    last_seen_at: '2024-03-22T20:00:00Z', last_seen_address: 'Calle Leoncio Prado, Ferreñafe',
    ubigeo: '140201', reward_amount: 80, contact_phone: '933445566', is_resolved: false,
    photo_urls: ['https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&q=80'],
    slug: 'azul-gata-siamesa-ferrenafe',
    created_at: '2024-03-22T21:00:00Z', updated_at: '2024-03-22T21:00:00Z',
    sightings: [{ id: 'sighting-008a', report_id: 'report-008', user_id: 'profile-user-009', message: 'Vi una gata parecida en la calle Lora y Lora ayer por la noche.', created_at: '2024-03-23T07:00:00Z' }],
  },
  {
    id: 'report-009', animal_id: null, reported_by: 'profile-user-009', type: 'found',
    description: 'Encontré un cachorro mestizo, macho, color café rojizo, aproximadamente 3 meses. Estaba solo y llorando. Lo rescaté y busco a sus dueños o un hogar temporal.',
    last_seen_at: '2024-03-28T14:00:00Z', last_seen_address: 'Av. Progreso, Lambayeque ciudad',
    ubigeo: '140301', reward_amount: null, contact_phone: '978123456', is_resolved: false,
    photo_urls: ['https://images.unsplash.com/photo-1591160690555-5d7e4a9b0b7e?w=600&q=80', 'https://images.unsplash.com/photo-1503256207526-0d5523f31580?w=600&q=80'],
    slug: 'cachorro-cafe-encontrado-lambayeque',
    created_at: '2024-03-28T15:00:00Z', updated_at: '2024-03-28T15:00:00Z', sightings: [],
  },
  {
    id: 'report-010', animal_id: null, reported_by: 'profile-user-010', type: 'lost',
    description: 'Perro adulto, raza Schnauzer miniatura, color gris sal y pimienta. Collar naranja. Responde a "Pepe". Muy nervioso con extraños.',
    last_seen_at: '2024-03-27T19:00:00Z', last_seen_address: 'Urb. Los Parques, Chiclayo',
    ubigeo: '140101', reward_amount: 200, contact_phone: '912233445', is_resolved: false,
    photo_urls: ['https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600&q=80'],
    slug: 'pepe-schnauzer-los-parques-chiclayo',
    created_at: '2024-03-27T20:00:00Z', updated_at: '2024-03-27T20:00:00Z', sightings: [],
  },
  {
    id: 'report-011', animal_id: null, reported_by: 'profile-user-011', type: 'lost',
    description: 'Conejo doméstico blanco con manchas negras, orejas largas. Se llama "Pintas". Escapó por la puerta entreabierta. Es muy dócil.',
    last_seen_at: '2024-03-29T10:00:00Z', last_seen_address: 'Jr. Bolívar, J.L.O.',
    ubigeo: '140108', reward_amount: 50, contact_phone: '956234567', is_resolved: false,
    photo_urls: null,
    slug: 'pintas-conejo-jlo',
    created_at: '2024-03-29T11:00:00Z', updated_at: '2024-03-29T11:00:00Z', sightings: [],
  },
  {
    id: 'report-012', animal_id: null, reported_by: 'profile-user-012', type: 'found',
    description: 'Encontré un gato adulto, atigrado gris, bien cuidado, con signos de haber tenido dueño. Sin collar pero muy amigable. Lo tengo temporalmente.',
    last_seen_at: '2024-03-29T15:00:00Z', last_seen_address: 'Av. Augusto B. Leguía, Chiclayo',
    ubigeo: '140101', reward_amount: null, contact_phone: '934123456', is_resolved: false,
    photo_urls: ['https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&q=80'],
    slug: 'gato-atigrado-encontrado-chiclayo',
    created_at: '2024-03-29T16:00:00Z', updated_at: '2024-03-29T16:00:00Z', sightings: [],
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
