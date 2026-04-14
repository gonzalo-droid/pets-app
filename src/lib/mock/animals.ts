import type { AnimalWithPhotos, AnimalFilters } from '@/types'

// ─── Data mock de animales en adopción — todos de Lambayeque ─────────────────

export const MOCK_ANIMALS: AnimalWithPhotos[] = [
  {
    id: 'animal-001',
    shelter_id: 'shelter-001',
    posted_by: 'profile-shelter-001',
    name: 'Rocky',
    species: 'dog',
    breed: 'Mestizo',
    age_months: 18,
    size: 'medium',
    gender: 'male',
    color: 'Café con blanco',
    description:
      'Rocky es un perro muy juguetón y cariñoso. Le encanta correr y jugar con pelotas. Está listo para un hogar con espacio para correr. Se lleva bien con niños mayores de 6 años.',
    is_vaccinated: true,
    is_neutered: true,
    is_microchipped: false,
    status: 'available',
    ubigeo: '140101', // Chiclayo / Chiclayo / Chiclayo
    slug: 'rocky-mestizo-chiclayo',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
    animal_photos: [
      {
        id: 'photo-001a',
        animal_id: 'animal-001',
        url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
        is_cover: true,
        order_index: 0,
      },
      {
        id: 'photo-001b',
        animal_id: 'animal-001',
        url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80',
        is_cover: false,
        order_index: 1,
      },
    ],
  },
  {
    id: 'animal-002',
    shelter_id: 'shelter-001',
    posted_by: 'profile-shelter-001',
    name: 'Luna',
    species: 'cat',
    breed: 'Doméstico de pelo corto',
    age_months: 8,
    size: 'small',
    gender: 'female',
    color: 'Naranja atigrada',
    description:
      'Luna llegó siendo una gatita callejera y ahora es completamente doméstica. Es tranquila, independiente y perfecta para departamentos. Busca un hogar sin perros.',
    is_vaccinated: true,
    is_neutered: false,
    is_microchipped: false,
    status: 'available',
    ubigeo: '140101',
    slug: 'luna-gata-naranja-chiclayo',
    created_at: '2024-03-05T11:00:00Z',
    updated_at: '2024-03-05T11:00:00Z',
    animal_photos: [
      {
        id: 'photo-002a',
        animal_id: 'animal-002',
        url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=80',
        is_cover: true,
        order_index: 0,
      },
    ],
  },
  {
    id: 'animal-003',
    shelter_id: 'shelter-002',
    posted_by: 'profile-shelter-002',
    name: 'Toby',
    species: 'dog',
    breed: 'Beagle mestizo',
    age_months: 36,
    size: 'small',
    gender: 'male',
    color: 'Tricolor (negro, café, blanco)',
    description:
      'Toby tiene 3 años y es ideal para familias. Es muy obediente, ya tiene entrenamiento básico. Le gustan los paseos largos y es amigable con otros perros.',
    is_vaccinated: true,
    is_neutered: true,
    is_microchipped: true,
    status: 'available',
    ubigeo: '140301', // Lambayeque / Lambayeque / Lambayeque
    slug: 'toby-beagle-lambayeque',
    created_at: '2024-03-08T09:00:00Z',
    updated_at: '2024-03-08T09:00:00Z',
    animal_photos: [
      {
        id: 'photo-003a',
        animal_id: 'animal-003',
        url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&q=80',
        is_cover: true,
        order_index: 0,
      },
    ],
  },
  {
    id: 'animal-004',
    shelter_id: 'shelter-001',
    posted_by: 'profile-shelter-001',
    name: 'Mochi',
    species: 'cat',
    breed: 'Persa mestizo',
    age_months: 24,
    size: 'small',
    gender: 'female',
    color: 'Blanca con manchas grises',
    description:
      'Mochi es una gata muy afectuosa. Le encanta el regazo humano y ronronea constantemente. Perfecta para personas que buscan compañía tranquila. Convive bien con otras gatas.',
    is_vaccinated: true,
    is_neutered: true,
    is_microchipped: false,
    status: 'in_process',
    ubigeo: '140110', // Chiclayo / Chiclayo / La Victoria
    slug: 'mochi-gata-persa-la-victoria',
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    animal_photos: [
      {
        id: 'photo-004a',
        animal_id: 'animal-004',
        url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
        is_cover: true,
        order_index: 0,
      },
    ],
  },
  {
    id: 'animal-005',
    shelter_id: 'shelter-002',
    posted_by: 'profile-shelter-002',
    name: 'Zeus',
    species: 'dog',
    breed: 'Labrador mestizo',
    age_months: 60,
    size: 'large',
    gender: 'male',
    color: 'Negro',
    description:
      'Zeus tiene 5 años y fue rescatado de maltrato. Ya está recuperado física y emocionalmente. Necesita un hogar paciente con adultos o adolescentes. Adora a sus humanos una vez que confía.',
    is_vaccinated: true,
    is_neutered: true,
    is_microchipped: false,
    status: 'available',
    ubigeo: '140301',
    slug: 'zeus-labrador-lambayeque',
    created_at: '2024-03-12T08:00:00Z',
    updated_at: '2024-03-12T08:00:00Z',
    animal_photos: [
      {
        id: 'photo-005a',
        animal_id: 'animal-005',
        url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80',
        is_cover: true,
        order_index: 0,
      },
    ],
  },
  {
    id: 'animal-006',
    shelter_id: 'shelter-001',
    posted_by: 'profile-shelter-001',
    name: 'Piolín',
    species: 'other',
    breed: 'Conejo doméstico',
    age_months: 12,
    size: 'small',
    gender: 'male',
    color: 'Blanco con manchas marrones',
    description:
      'Piolín es un conejo doméstico muy dócil. Vive en jaula pero le encanta salir a explorar. Ideal para familias con niños que quieran una mascota diferente. Se alimenta de heno y verduras frescas.',
    is_vaccinated: false,
    is_neutered: false,
    is_microchipped: false,
    status: 'available',
    ubigeo: '140101',
    slug: 'piolin-conejo-chiclayo',
    created_at: '2024-03-15T16:00:00Z',
    updated_at: '2024-03-15T16:00:00Z',
    animal_photos: [
      {
        id: 'photo-006a',
        animal_id: 'animal-006',
        url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80',
        is_cover: true,
        order_index: 0,
      },
    ],
  },
  // ─── Animales extra para probar paginación ────────────────────────────────────
  {
    id: 'animal-007', shelter_id: 'shelter-001', posted_by: 'profile-shelter-001',
    name: 'Bella', species: 'dog', breed: 'Cocker spaniel mestizo', age_months: 14,
    size: 'small', gender: 'female', color: 'Miel', description: 'Bella es dulce y muy cariñosa. Le encanta jugar y es ideal para familias con niños.',
    is_vaccinated: true, is_neutered: false, is_microchipped: false,
    status: 'available', ubigeo: '140101', slug: 'bella-cocker-chiclayo',
    created_at: '2024-03-16T10:00:00Z', updated_at: '2024-03-16T10:00:00Z',
    animal_photos: [{ id: 'ph-007a', animal_id: 'animal-007', url: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-008', shelter_id: 'shelter-002', posted_by: 'profile-shelter-002',
    name: 'Simba', species: 'cat', breed: 'Maine coon mestizo', age_months: 30,
    size: 'medium', gender: 'male', color: 'Naranja y blanco', description: 'Simba es un gato grande y majestuoso. Tranquilo y muy cariñoso con sus humanos.',
    is_vaccinated: true, is_neutered: true, is_microchipped: true,
    status: 'available', ubigeo: '140301', slug: 'simba-maine-coon-lambayeque',
    created_at: '2024-03-17T10:00:00Z', updated_at: '2024-03-17T10:00:00Z',
    animal_photos: [{ id: 'ph-008a', animal_id: 'animal-008', url: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-009', shelter_id: 'shelter-001', posted_by: 'profile-shelter-001',
    name: 'Canela', species: 'dog', breed: 'Salchicha mestizo', age_months: 24,
    size: 'small', gender: 'female', color: 'Canela', description: 'Canela es juguetona y muy lista. Ya sabe algunos trucos básicos. Busca un hogar activo.',
    is_vaccinated: true, is_neutered: true, is_microchipped: false,
    status: 'available', ubigeo: '140110', slug: 'canela-salchicha-la-victoria',
    created_at: '2024-03-18T10:00:00Z', updated_at: '2024-03-18T10:00:00Z',
    animal_photos: [{ id: 'ph-009a', animal_id: 'animal-009', url: 'https://images.unsplash.com/photo-1537123547273-e59f4a9b8570?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-010', shelter_id: 'shelter-002', posted_by: 'profile-shelter-002',
    name: 'Max', species: 'dog', breed: 'Pastor alemán mestizo', age_months: 48,
    size: 'large', gender: 'male', color: 'Negro con café', description: 'Max es leal y protector. Tiene entrenamiento de obediencia básica. Ideal para casas con patio.',
    is_vaccinated: true, is_neutered: false, is_microchipped: true,
    status: 'available', ubigeo: '140301', slug: 'max-pastor-aleman-lambayeque',
    created_at: '2024-03-19T10:00:00Z', updated_at: '2024-03-19T10:00:00Z',
    animal_photos: [{ id: 'ph-010a', animal_id: 'animal-010', url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-011', shelter_id: 'shelter-001', posted_by: 'profile-shelter-001',
    name: 'Nieve', species: 'cat', breed: 'Angora mestizo', age_months: 10,
    size: 'small', gender: 'female', color: 'Blanca', description: 'Nieve es una gatita pura y muy tranquila. Se lleva bien con otras gatas y con niños tranquilos.',
    is_vaccinated: true, is_neutered: false, is_microchipped: false,
    status: 'available', ubigeo: '140101', slug: 'nieve-angora-chiclayo',
    created_at: '2024-03-20T10:00:00Z', updated_at: '2024-03-20T10:00:00Z',
    animal_photos: [{ id: 'ph-011a', animal_id: 'animal-011', url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-012', shelter_id: 'shelter-002', posted_by: 'profile-shelter-002',
    name: 'Duque', species: 'dog', breed: 'Boxer mestizo', age_months: 36,
    size: 'large', gender: 'male', color: 'Leonado con blanco', description: 'Duque es enérgico y juguetón. Necesita espacio para correr. Muy amigable con niños grandes.',
    is_vaccinated: true, is_neutered: true, is_microchipped: false,
    status: 'available', ubigeo: '140201', slug: 'duque-boxer-ferrenafe',
    created_at: '2024-03-21T10:00:00Z', updated_at: '2024-03-21T10:00:00Z',
    animal_photos: [{ id: 'ph-012a', animal_id: 'animal-012', url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-013', shelter_id: 'shelter-001', posted_by: 'profile-shelter-001',
    name: 'Perla', species: 'cat', breed: 'Siamés mestizo', age_months: 18,
    size: 'small', gender: 'female', color: 'Crema con puntas oscuras', description: 'Perla es vocal y muy expresiva. Establece vínculos fuertes con su dueño. Le gusta la rutina.',
    is_vaccinated: true, is_neutered: true, is_microchipped: false,
    status: 'available', ubigeo: '140101', slug: 'perla-siames-chiclayo',
    created_at: '2024-03-22T10:00:00Z', updated_at: '2024-03-22T10:00:00Z',
    animal_photos: [{ id: 'ph-013a', animal_id: 'animal-013', url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-014', shelter_id: 'shelter-002', posted_by: 'profile-shelter-002',
    name: 'Thor', species: 'dog', breed: 'Husky mestizo', age_months: 20,
    size: 'medium', gender: 'male', color: 'Gris y blanco', description: 'Thor es activo e inteligente. Necesita ejercicio diario y estimulación mental. Muy sociable.',
    is_vaccinated: true, is_neutered: false, is_microchipped: true,
    status: 'available', ubigeo: '140301', slug: 'thor-husky-lambayeque',
    created_at: '2024-03-23T10:00:00Z', updated_at: '2024-03-23T10:00:00Z',
    animal_photos: [{ id: 'ph-014a', animal_id: 'animal-014', url: 'https://images.unsplash.com/photo-1605639648730-e2b0db5f5776?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-015', shelter_id: 'shelter-001', posted_by: 'profile-shelter-001',
    name: 'Kira', species: 'dog', breed: 'Labrador mestizo', age_months: 12,
    size: 'medium', gender: 'female', color: 'Amarilla', description: 'Kira es curiosa y muy cariñosa. Ama a todos los humanos. Está lista para una familia activa.',
    is_vaccinated: true, is_neutered: false, is_microchipped: false,
    status: 'available', ubigeo: '140108', slug: 'kira-labrador-jlo',
    created_at: '2024-03-24T10:00:00Z', updated_at: '2024-03-24T10:00:00Z',
    animal_photos: [{ id: 'ph-015a', animal_id: 'animal-015', url: 'https://images.unsplash.com/photo-1504826260979-242151ee45b7?w=600&q=80', is_cover: true, order_index: 0 }],
  },
  {
    id: 'animal-016', shelter_id: 'shelter-002', posted_by: 'profile-shelter-002',
    name: 'Oliver', species: 'cat', breed: 'Doméstico pelo largo', age_months: 36,
    size: 'medium', gender: 'male', color: 'Negro', description: 'Oliver es elegante y reservado. Tarda en confiar pero cuando lo hace es sumamente fiel y cariñoso.',
    is_vaccinated: true, is_neutered: true, is_microchipped: false,
    status: 'available', ubigeo: '140301', slug: 'oliver-gato-negro-lambayeque',
    created_at: '2024-03-25T10:00:00Z', updated_at: '2024-03-25T10:00:00Z',
    animal_photos: [{ id: 'ph-016a', animal_id: 'animal-016', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80', is_cover: true, order_index: 0 }],
  },
]

// ─── Filtrado local ────────────────────────────────────────────────────────────

function matchesFilters(animal: AnimalWithPhotos, filters?: AnimalFilters): boolean {
  if (!filters) return true
  if (filters.species && animal.species !== filters.species) return false
  if (filters.size && animal.size !== filters.size) return false
  if (filters.status && animal.status !== filters.status) return false
  if (filters.ubigeo && animal.ubigeo !== filters.ubigeo) return false
  // Filtro por departamento: los primeros 2 dígitos del ubigeo INEI
  if (filters.department) {
    const deptCode = filters.department === 'Lambayeque' ? '14' : null
    if (deptCode && !animal.ubigeo.startsWith(deptCode)) return false
  }
  return true
}

// ─── Funciones async — misma firma que usará Supabase ─────────────────────────

export async function getAnimals(filters?: AnimalFilters): Promise<AnimalWithPhotos[]> {
  return MOCK_ANIMALS.filter((a) => matchesFilters(a, filters))
}

export async function getAnimalBySlug(slug: string): Promise<AnimalWithPhotos | null> {
  return MOCK_ANIMALS.find((a) => a.slug === slug) ?? null
}

export async function getAnimalsByShelter(shelterId: string): Promise<AnimalWithPhotos[]> {
  return MOCK_ANIMALS.filter((a) => a.shelter_id === shelterId)
}
