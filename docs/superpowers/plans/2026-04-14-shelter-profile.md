# Shelter Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar sección de configuración del albergue en el panel (`/shelter/settings`) y una vista pública del albergue (`/shelters/[id]`), con datos 100% mock (sin Supabase ni auth real).

**Architecture:** Modelo de datos extendido en `database.ts` + mock data en `shelters.ts`. Panel privado con tabs (Info / Contacto / Galería) como Client Component. Vista pública como Server Component. `AnimalCard` enlaza al perfil del albergue.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript estricto, shadcn/ui (`Tabs`, `Card`, `Input`, `Textarea`, `Label`, `Button`, `Badge`), Lucide icons.

---

## Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `src/types/database.ts` | Modificar — nuevos campos + tipos `ShelterPhoto`, `ShelterWithPhotos` |
| `src/lib/mock/shelters.ts` | Modificar — nuevos campos mock, fotos, función `getShelterWithPhotos` |
| `src/components/layout/ShelterSidebar.tsx` | Modificar — link a `/shelter/settings` |
| `src/components/animals/AnimalCard.tsx` | Modificar — recibe `shelterId`, nombre como link |
| `src/app/(public)/adopt/page.tsx` | Modificar — pasa `shelterId` a `AnimalCard` |
| `src/app/(shelter)/shelter/settings/page.tsx` | Crear — panel de configuración con tabs |
| `src/app/(public)/shelters/[id]/page.tsx` | Crear — vista pública del albergue |

---

## Task 1: Extender tipos en `database.ts`

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: Agregar campos a `Shelter` y nuevos tipos**

Abrir `src/types/database.ts`. Modificar la interfaz `Shelter` (líneas 58-79) para agregar los tres campos nuevos al final, antes del cierre. Luego agregar los dos tipos nuevos al final del archivo en la sección de tipos compuestos.

Reemplazar el bloque `Shelter` completo con:

```ts
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
```

Al final del archivo (después de `LostReportWithSightings`), agregar:

```ts
export interface ShelterPhoto {
  id: string
  shelter_id: string
  url: string
  order_index: number
}

export interface ShelterWithPhotos extends Shelter {
  shelter_photos: ShelterPhoto[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: extend Shelter type with whatsapp, tiktok, long_description, ShelterPhoto"
```

---

## Task 2: Extender mock data de albergues

**Files:**
- Modify: `src/lib/mock/shelters.ts`

- [ ] **Step 1: Agregar campos nuevos a `MOCK_SHELTERS` y fotos mock**

Reemplazar el contenido completo de `src/lib/mock/shelters.ts` con:

```ts
import type { Shelter, ShelterWithPhotos, ShelterPhoto } from '@/types'
import type { CampaignFilters } from '@/types'

// ─── Data mock de albergues en Lambayeque ─────────────────────────────────────

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: 'shelter-001',
    profile_id: 'profile-shelter-001',
    name: 'Patitas Chiclayo',
    description:
      'Albergue sin fines de lucro dedicado al rescate y adopción responsable de animales en Chiclayo. Operamos desde 2018 con voluntarios comprometidos.',
    long_description:
      'Patitas Chiclayo nació en 2018 de la mano de un grupo de voluntarios que encontraron a más de 20 perros en situación de abandono en el distrito de Santa Victoria. Lo que empezó como un rescate de emergencia se convirtió en una organización sin fines de lucro registrada ante los Registros Públicos de Lambayeque.\n\nHoy contamos con un albergue propio con capacidad para 60 animales, un equipo de 15 voluntarios permanentes y alianzas con 3 clínicas veterinarias de Chiclayo que nos brindan atención a precio social.\n\nNuestra misión es rescatar, rehabilitar y encontrar hogares responsables para perros y gatos en situación de riesgo en la región Lambayeque. Creemos en la adopción responsable y acompañamos a las familias antes y después del proceso.',
    address: 'Calle Los Mochicas 345, Urb. Santa Victoria',
    ubigeo: '140101',
    phone: '979123456',
    email: 'patitaschiclayo@gmail.com',
    whatsapp: '979123456',
    instagram: 'patitaschiclayo',
    facebook: 'patitaschiclayo',
    tiktok: 'patitaschiclayo',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=patitas',
    banner_url: 'https://picsum.photos/seed/patitas-banner/1200/400',
    is_verified: true,
    yape_number: '979123456',
    bank_account: '00219012345678901234',
    bank_name: 'BCP',
    account_holder: 'Asociación Patitas Chiclayo',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'shelter-002',
    profile_id: 'profile-shelter-002',
    name: 'Huellas Lambayeque',
    description:
      'Refugio familiar en Lambayeque ciudad. Acogemos perros y gatos maltratados o abandonados y buscamos hogares responsables en toda la región.',
    long_description:
      'Huellas Lambayeque es un refugio familiar que funciona desde 2020 en la ciudad de Lambayeque. Somos una familia que decidió abrir las puertas de nuestra casa para acoger animales en situación de maltrato o abandono.\n\nA diferencia de los albergues grandes, nosotros operamos en un modelo de casa-hogar donde los animales conviven con personas en un ambiente familiar. Esto nos permite rehabilitar casos de trauma y maltrato con mejores resultados.\n\nTenemos capacidad para 25 animales y trabajamos con la Municipalidad Provincial de Lambayeque en campañas de esterilización y adopción masiva.',
    address: 'Av. Ramón Castilla 890',
    ubigeo: '140301',
    phone: '943678901',
    email: 'huellaslamb@gmail.com',
    whatsapp: '943678901',
    instagram: 'huellasLambayeque',
    facebook: 'huellasLambayeque',
    tiktok: null,
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=huellas',
    banner_url: 'https://picsum.photos/seed/huellas-banner/1200/400',
    is_verified: true,
    yape_number: '943678901',
    bank_account: '00349087654321098765',
    bank_name: 'Interbank',
    account_holder: 'Huellas Lambayeque EIRL',
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-03-15T09:00:00Z',
  },
]

// ─── Fotos de galería mock ─────────────────────────────────────────────────────

export const MOCK_SHELTER_PHOTOS: ShelterPhoto[] = [
  { id: 'sp-001', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas1/600/400', order_index: 0 },
  { id: 'sp-002', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas2/600/400', order_index: 1 },
  { id: 'sp-003', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas3/600/400', order_index: 2 },
  { id: 'sp-004', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas4/600/400', order_index: 3 },
  { id: 'sp-005', shelter_id: 'shelter-001', url: 'https://picsum.photos/seed/patitas5/600/400', order_index: 4 },
  { id: 'sp-006', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas1/600/400', order_index: 0 },
  { id: 'sp-007', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas2/600/400', order_index: 1 },
  { id: 'sp-008', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas3/600/400', order_index: 2 },
  { id: 'sp-009', shelter_id: 'shelter-002', url: 'https://picsum.photos/seed/huellas4/600/400', order_index: 3 },
]

// ─── Funciones async — misma firma que usará Supabase ─────────────────────────

export async function getShelters(): Promise<Shelter[]> {
  return MOCK_SHELTERS.filter((s) => s.is_verified)
}

export async function getShelterById(id: string): Promise<Shelter | null> {
  return MOCK_SHELTERS.find((s) => s.id === id) ?? null
}

export async function getShelterWithPhotos(id: string): Promise<ShelterWithPhotos | null> {
  const shelter = MOCK_SHELTERS.find((s) => s.id === id)
  if (!shelter) return null
  const photos = MOCK_SHELTER_PHOTOS
    .filter((p) => p.shelter_id === id)
    .sort((a, b) => a.order_index - b.order_index)
  return { ...shelter, shelter_photos: photos }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/mock/shelters.ts
git commit -m "feat: extend shelter mock data with photos, whatsapp, tiktok, long_description"
```

---

## Task 3: Agregar link de Configuración al sidebar

**Files:**
- Modify: `src/components/layout/ShelterSidebar.tsx`

- [ ] **Step 1: Agregar import de Settings y nuevo link**

Agregar `Settings` al import de lucide-react existente:

```ts
import {
  LayoutDashboard,
  Dog,
  ClipboardList,
  HeartHandshake,
  Wallet,
  PawPrint,
  ChevronLeft,
  Settings,
} from 'lucide-react'
```

Agregar el nuevo link al array `SHELTER_LINKS`:

```ts
const SHELTER_LINKS = [
  { href: '/shelter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shelter/animals', label: 'Mis animales', icon: Dog },
  { href: '/shelter/requests', label: 'Solicitudes', icon: ClipboardList },
  { href: '/shelter/campaigns', label: 'Campañas', icon: HeartHandshake },
  { href: '/shelter/donations', label: 'Donaciones', icon: Wallet },
  { href: '/shelter/settings', label: 'Configuración', icon: Settings },
] as const
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/ShelterSidebar.tsx
git commit -m "feat: add Configuracion link to shelter sidebar"
```

---

## Task 4: Crear página de configuración del albergue

**Files:**
- Create: `src/app/(shelter)/shelter/settings/page.tsx`

- [ ] **Step 1: Crear el archivo**

Crear `src/app/(shelter)/shelter/settings/page.tsx` con el siguiente contenido completo:

```tsx
'use client'

import { useState } from 'react'
import { Save, Plus, X, Instagram, Facebook } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MOCK_SHELTERS, MOCK_SHELTER_PHOTOS } from '@/lib/mock/shelters'
import type { Shelter, ShelterPhoto } from '@/types'

// Mock: albergue activo hardcodeado (sin auth real)
const MOCK_SHELTER_ID = 'shelter-001'
const initialShelter = MOCK_SHELTERS.find((s) => s.id === MOCK_SHELTER_ID)!
const initialPhotos = MOCK_SHELTER_PHOTOS.filter((p) => p.shelter_id === MOCK_SHELTER_ID)

export default function ShelterSettingsPage() {
  const [info, setInfo] = useState<Pick<Shelter,
    'name' | 'description' | 'long_description' | 'address' | 'avatar_url' | 'banner_url'
  >>({
    name: initialShelter.name,
    description: initialShelter.description ?? '',
    long_description: initialShelter.long_description ?? '',
    address: initialShelter.address ?? '',
    avatar_url: initialShelter.avatar_url ?? '',
    banner_url: initialShelter.banner_url ?? '',
  })

  const [contact, setContact] = useState<Pick<Shelter,
    'phone' | 'email' | 'whatsapp' | 'instagram' | 'facebook' | 'tiktok'
  >>({
    phone: initialShelter.phone ?? '',
    email: initialShelter.email ?? '',
    whatsapp: initialShelter.whatsapp ?? '',
    instagram: initialShelter.instagram ?? '',
    facebook: initialShelter.facebook ?? '',
    tiktok: initialShelter.tiktok ?? '',
  })

  const [photos, setPhotos] = useState<ShelterPhoto[]>(initialPhotos)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedTab, setSavedTab] = useState<string | null>(null)

  function handleSave(tab: string) {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSavedTab(tab)
      setTimeout(() => setSavedTab(null), 2500)
    }, 500)
  }

  function addPhoto() {
    const url = newPhotoUrl.trim()
    if (!url || photos.length >= 12) return
    const newPhoto: ShelterPhoto = {
      id: `sp-new-${Date.now()}`,
      shelter_id: MOCK_SHELTER_ID,
      url,
      order_index: photos.length,
    }
    setPhotos((prev) => [...prev, newPhoto])
    setNewPhotoUrl('')
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración del albergue</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Esta información se mostrará públicamente en el perfil del albergue.
        </p>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="contact">Contacto & Redes</TabsTrigger>
          <TabsTrigger value="gallery">Galería</TabsTrigger>
        </TabsList>

        {/* ── Tab: Información ── */}
        <TabsContent value="info">
          <div className="flex flex-col gap-5">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              {info.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.avatar_url}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full border-2 border-border object-cover bg-muted"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-accent text-2xl">
                  🏠
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="avatar_url">URL del avatar</Label>
                <Input
                  id="avatar_url"
                  value={info.avatar_url}
                  onChange={(e) => setInfo((p) => ({ ...p, avatar_url: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Banner preview */}
            <div>
              <Label htmlFor="banner_url">URL del banner</Label>
              {info.banner_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.banner_url}
                  alt="Banner"
                  className="mt-2 w-full h-28 object-cover rounded-lg border border-border bg-muted mb-2"
                />
              )}
              <Input
                id="banner_url"
                value={info.banner_url}
                onChange={(e) => setInfo((p) => ({ ...p, banner_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name">Nombre del albergue</Label>
              <Input
                id="name"
                value={info.name}
                onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">
                Descripción corta{' '}
                <span className="text-muted-foreground font-normal">
                  ({(info.description ?? '').length}/200 caracteres)
                </span>
              </Label>
              <Textarea
                id="description"
                value={info.description ?? ''}
                onChange={(e) => setInfo((p) => ({ ...p, description: e.target.value.slice(0, 200) }))}
                rows={2}
                placeholder="Resumen breve del albergue..."
                className="mt-1 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="long_description">Historia del albergue</Label>
              <Textarea
                id="long_description"
                value={info.long_description ?? ''}
                onChange={(e) => setInfo((p) => ({ ...p, long_description: e.target.value }))}
                rows={8}
                placeholder="Cuenta la historia, misión y valores de tu albergue..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={info.address ?? ''}
                onChange={(e) => setInfo((p) => ({ ...p, address: e.target.value }))}
                className="mt-1"
                placeholder="Calle, número, distrito"
              />
            </div>

            <SaveButton
              saving={saving}
              saved={savedTab === 'info'}
              onClick={() => handleSave('info')}
            />
          </div>
        </TabsContent>

        {/* ── Tab: Contacto & Redes ── */}
        <TabsContent value="contact">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contact.phone ?? ''}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9XX XXX XXX"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={contact.whatsapp ?? ''}
                  onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="9XX XXX XXX"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={contact.email ?? ''}
                onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                className="mt-1"
                placeholder="albergue@ejemplo.com"
              />
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-3">Redes sociales</p>
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5" /> Instagram
                  </Label>
                  <div className="flex items-center mt-1">
                    <span className="px-3 py-2 text-sm text-muted-foreground border border-r-0 border-border rounded-l-md bg-muted">@</span>
                    <Input
                      id="instagram"
                      value={contact.instagram ?? ''}
                      onChange={(e) => setContact((p) => ({ ...p, instagram: e.target.value }))}
                      placeholder="tuhandle"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facebook" className="flex items-center gap-1.5">
                    <Facebook className="h-3.5 w-3.5" /> Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={contact.facebook ?? ''}
                    onChange={(e) => setContact((p) => ({ ...p, facebook: e.target.value }))}
                    placeholder="nombre-de-pagina"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <div className="flex items-center mt-1">
                    <span className="px-3 py-2 text-sm text-muted-foreground border border-r-0 border-border rounded-l-md bg-muted">@</span>
                    <Input
                      id="tiktok"
                      value={contact.tiktok ?? ''}
                      onChange={(e) => setContact((p) => ({ ...p, tiktok: e.target.value }))}
                      placeholder="tuhandle"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <SaveButton
              saving={saving}
              saved={savedTab === 'contact'}
              onClick={() => handleSave('contact')}
            />
          </div>
        </TabsContent>

        {/* ── Tab: Galería ── */}
        <TabsContent value="gallery">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {photos.length}/12 fotos
              </p>
            </div>

            {/* Grid de fotos */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt="Foto del albergue"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Eliminar foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Agregar foto */}
            {photos.length < 12 && (
              <div className="flex gap-2">
                <Input
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="URL de la foto (https://...)"
                  onKeyDown={(e) => e.key === 'Enter' && addPhoto()}
                />
                <Button variant="outline" size="sm" onClick={addPhoto} disabled={!newPhotoUrl.trim()}>
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
            )}

            {photos.length === 0 && (
              <div className="flex flex-col items-center py-10 gap-2 rounded-xl border border-dashed border-border text-center">
                <span className="text-3xl">📸</span>
                <p className="text-sm text-muted-foreground">Aún no hay fotos en la galería.</p>
              </div>
            )}

            <SaveButton
              saving={saving}
              saved={savedTab === 'gallery'}
              onClick={() => handleSave('gallery')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SaveButton({
  saving,
  saved,
  onClick,
}: {
  saving: boolean
  saved: boolean
  onClick: () => void
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button onClick={onClick} disabled={saving} size="sm">
        <Save className="h-4 w-4" />
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </Button>
      {saved && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ¡Cambios guardados!
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verificar que la página compile**

```bash
cd /Users/gonzalo/DocsNeko/webs/pets-app && npx next build 2>&1 | tail -20
```

Si hay errores de TypeScript, corregirlos antes de continuar.

- [ ] **Step 3: Commit**

```bash
git add src/app/(shelter)/shelter/settings/page.tsx
git commit -m "feat: add shelter settings page with info/contact/gallery tabs"
```

---

## Task 5: Crear vista pública del albergue

**Files:**
- Create: `src/app/(public)/shelters/[id]/page.tsx`

- [ ] **Step 1: Crear el archivo**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck, Phone, Mail, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { getShelterWithPhotos } from '@/lib/mock/shelters'
import { getAnimalsByShelter } from '@/lib/mock/animals'
import AnimalCard from '@/components/animals/AnimalCard'

const CITY_BY_UBIGEO: Record<string, string> = {
  '140101': 'Chiclayo',
  '140108': 'José L. Ortiz',
  '140110': 'La Victoria',
  '140201': 'Ferreñafe',
  '140301': 'Lambayeque',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const shelter = await getShelterWithPhotos(id)
  if (!shelter) return { title: 'Albergue no encontrado' }
  return {
    title: `${shelter.name} — PawRescue`,
    description: shelter.description ?? undefined,
  }
}

export default async function ShelterPublicPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [shelter, animals] = await Promise.all([
    getShelterWithPhotos(id),
    getAnimalsByShelter(id),
  ])

  if (!shelter) notFound()

  const city = CITY_BY_UBIGEO[shelter.ubigeo] ?? 'Lambayeque'
  const availableAnimals = animals
    .filter((a) => a.status === 'available' || a.status === 'in_process')
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">

      {/* ── Hero: banner + avatar + nombre ── */}
      <div className="rounded-2xl overflow-hidden border border-border">
        {/* Banner */}
        <div className="relative h-48 sm:h-60 bg-gradient-to-r from-primary/30 to-primary/10">
          {shelter.banner_url && (
            <Image
              src={shelter.banner_url}
              alt={`Banner de ${shelter.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          )}
        </div>

        {/* Avatar + info */}
        <div className="px-6 pb-6 pt-4 flex items-end gap-4 -mt-10 relative">
          <div className="relative shrink-0">
            {shelter.avatar_url ? (
              <Image
                src={shelter.avatar_url}
                alt={shelter.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-background bg-muted object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-accent text-3xl">
                🏠
              </div>
            )}
            {shelter.is_verified && (
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BadgeCheck className="h-4 w-4" />
              </span>
            )}
          </div>
          <div className="pt-8">
            <h1 className="text-xl font-bold text-foreground leading-tight">{shelter.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{city}, Lambayeque</p>
          </div>
        </div>
      </div>

      {/* ── Historia / descripción ── */}
      {(shelter.long_description || shelter.description) && (
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Sobre nosotros</h2>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {shelter.long_description ?? shelter.description}
          </div>
        </section>
      )}

      {/* ── Galería ── */}
      {shelter.shelter_photos.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Galería</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {shelter.shelter_photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-video rounded-xl overflow-hidden border border-border bg-muted"
              >
                <Image
                  src={photo.url}
                  alt="Foto del albergue"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Contacto ── */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">Contacto</h2>
        <div className="flex flex-wrap gap-3">
          {shelter.address && (
            <ContactChip icon={<MapPin className="h-3.5 w-3.5" />} label={shelter.address} />
          )}
          {shelter.phone && (
            <a href={`tel:${shelter.phone}`}>
              <ContactChip icon={<Phone className="h-3.5 w-3.5" />} label={shelter.phone} />
            </a>
          )}
          {shelter.whatsapp && (
            <a
              href={`https://wa.me/51${shelter.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactChip icon={<span className="text-[11px] font-bold">WA</span>} label={`WhatsApp ${shelter.whatsapp}`} />
            </a>
          )}
          {shelter.email && (
            <a href={`mailto:${shelter.email}`}>
              <ContactChip icon={<Mail className="h-3.5 w-3.5" />} label={shelter.email} />
            </a>
          )}
          {shelter.instagram && (
            <a
              href={`https://instagram.com/${shelter.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactChip icon={<Instagram className="h-3.5 w-3.5" />} label={`@${shelter.instagram}`} />
            </a>
          )}
          {shelter.facebook && (
            <a
              href={`https://facebook.com/${shelter.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactChip icon={<Facebook className="h-3.5 w-3.5" />} label={shelter.facebook} />
            </a>
          )}
          {shelter.tiktok && (
            <a
              href={`https://tiktok.com/@${shelter.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactChip icon={<span className="text-[11px] font-bold">TT</span>} label={`@${shelter.tiktok}`} />
            </a>
          )}
        </div>
      </section>

      {/* ── Animales disponibles ── */}
      {availableAnimals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Animales disponibles</h2>
            <Link
              href={`/adopt?shelter=${shelter.id}`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                shelterName={shelter.name}
                shelterId={shelter.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ContactChip({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-primary/40 transition-colors">
      {icon}
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/shelters/[id]/page.tsx
git commit -m "feat: add public shelter profile page"
```

---

## Task 6: Actualizar `AnimalCard` para enlazar al albergue

**Files:**
- Modify: `src/components/animals/AnimalCard.tsx`

- [ ] **Step 1: Agregar prop `shelterId` y convertir nombre en link**

El componente es un `<Link>` envolvente hacia el animal. El nombre del albergue debe ser un link independiente que no propague el click al link padre. Usar `e.stopPropagation()` + `e.preventDefault()` en el elemento del albergue para navegar programáticamente, o usar un elemento `<span>` con routing via `useRouter`. La forma más limpia: convertir la sección de albergue en un `<div>` separado del `<Link>` principal usando un wrapper diferente.

La solución más simple y correcta: cambiar el wrapper exterior de `<Link>` a `<div>` con un `<Link>` solo alrededor de la imagen y el contenido principal del animal (excepto el nombre del albergue). 

Sin embargo, eso rompe el layout actual. La solución más limpia sin cambiar el layout: dejar el `<Link>` exterior pero agregar el nombre del albergue como un `<Link>` separado que detiene la propagación.

Reemplazar el bloque del albergue al final del contenido (líneas 86-89 en el archivo original):

```tsx
interface AnimalCardProps {
  animal: AnimalWithPhotos
  shelterName?: string
  shelterId?: string
}
```

Y el bloque del albergue:

```tsx
{shelterName && (
  <div className="mt-auto pt-2 border-t border-border">
    {shelterId ? (
      <Link
        href={`/shelters/${shelterId}`}
        onClick={(e) => e.stopPropagation()}
        className="text-xs text-primary hover:underline truncate block"
      >
        {shelterName}
      </Link>
    ) : (
      <p className="text-xs text-muted-foreground truncate">{shelterName}</p>
    )}
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/animals/AnimalCard.tsx
git commit -m "feat: AnimalCard links shelter name to public shelter profile"
```

---

## Task 7: Pasar `shelterId` desde la página de adopción

**Files:**
- Modify: `src/app/(public)/adopt/page.tsx`

- [ ] **Step 1: Crear mapa de `shelterId` y pasarlo a `AnimalCard`**

En `src/app/(public)/adopt/page.tsx`, el mapa `shelterNames` ya existe. Crear también un mapa `shelterIds` y pasarlo al componente.

Reemplazar:
```tsx
const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))
```

Por:
```tsx
const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))
const shelterIds = Object.fromEntries(shelters.map((s) => [s.id, s.id]))
```

Y en el render de `AnimalCard`, agregar el prop:
```tsx
<AnimalCard
  key={animal.id}
  animal={animal}
  shelterName={shelterNames[animal.shelter_id]}
  shelterId={shelterIds[animal.shelter_id]}
/>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/adopt/page.tsx
git commit -m "feat: pass shelterId to AnimalCard in adopt page"
```

---

## Verificación final

- [ ] Levantar el servidor de desarrollo: `npm run dev`
- [ ] Verificar `/shelter/settings` — tres tabs funcionando, botón "Guardar cambios" muestra feedback
- [ ] Verificar `/shelters/shelter-001` — banner, avatar, historia, galería, contacto, animales
- [ ] Verificar que al hacer clic en el nombre del albergue desde `/adopt` lleva a `/shelters/shelter-001`
- [ ] Verificar `/shelters/shelter-002` — funciona con el segundo albergue
- [ ] Verificar que el link "Configuración" aparece en el sidebar del panel
