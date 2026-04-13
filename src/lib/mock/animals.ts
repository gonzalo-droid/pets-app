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
