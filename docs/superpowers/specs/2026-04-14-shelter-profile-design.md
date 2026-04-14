# Shelter Profile — Design Spec
**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

Agregar dos funcionalidades al proyecto PawRescue:

1. **Panel de configuración del albergue** (`/shelter/settings`) — página privada donde el albergue puede editar su información pública.
2. **Vista pública del albergue** (`/shelters/[id]`) — página accesible a cualquier usuario con la info completa del albergue.

El objetivo es que la información del albergue transmita veracidad y genere confianza en adoptantes y donantes.

---

## 1. Cambios al modelo de datos

### 1.1 Nuevos campos en `Shelter` (`src/types/database.ts`)

```ts
whatsapp: string | null        // número sin código de país
tiktok: string | null          // handle sin @
long_description: string | null // historia/descripción larga
```

### 1.2 Nuevo tipo `ShelterPhoto`

```ts
interface ShelterPhoto {
  id: string
  shelter_id: string
  url: string
  order_index: number
}
```

### 1.3 Nuevo tipo compuesto

```ts
interface ShelterWithPhotos extends Shelter {
  shelter_photos: ShelterPhoto[]
}
```

### 1.4 Cambios en mock data (`src/lib/mock/shelters.ts`)

- Extender `MOCK_SHELTERS` con los nuevos campos (`whatsapp`, `tiktok`, `long_description`).
- Nuevo array `MOCK_SHELTER_PHOTOS` con 4–6 fotos por albergue (URLs de Picsum).
- Nueva función `getShelterWithPhotos(id: string): Promise<ShelterWithPhotos | null>`.

---

## 2. Panel del albergue — `/shelter/settings`

### 2.1 Ruta y archivo

- `src/app/(shelter)/shelter/settings/page.tsx`
- Se agrega enlace "Configuración" con ícono `Settings` en `ShelterSidebar.tsx`.

### 2.2 Estructura — tabs con shadcn `<Tabs>`

#### Tab "Información"
| Campo | Tipo | Notas |
|---|---|---|
| `avatar_url` | Input texto / preview imagen | Avatar circular |
| `banner_url` | Input texto / preview imagen | Banner ancho |
| `name` | Input texto | Nombre del albergue |
| `description` | Textarea (max 200 chars) | Descripción corta, usada en tarjetas |
| `long_description` | Textarea grande | Historia, misión, contexto |
| `address` | Input texto | Dirección completa |

#### Tab "Contacto & Redes"
| Campo | Tipo |
|---|---|
| `phone` | Input tel |
| `email` | Input email |
| `whatsapp` | Input tel |
| `instagram` | Input texto (handle sin @) |
| `facebook` | Input texto |
| `tiktok` | Input texto (handle sin @) |

#### Tab "Galería"
- Grid de fotos existentes; cada foto tiene un botón eliminar.
- Botón "Agregar foto" → input de URL (mock, sin upload real).
- Máximo 12 fotos.

### 2.3 Comportamiento del guardado

- Formularios usan estado local (`useState`).
- "Guardar cambios" llama a función mock con `setTimeout(500ms)` y muestra toast de éxito.
- Sin persistencia real (pendiente de integrar Supabase).

---

## 3. Vista pública — `/shelters/[id]`

### 3.1 Ruta y archivo

- `src/app/(public)/shelters/[id]/page.tsx`
- Usa `getShelterWithPhotos(id)` para obtener datos.

### 3.2 Layout

```
┌─────────────────────────────────────┐
│  BANNER (imagen o gradiente fallback)│
│  [Avatar]  Nombre  ✓ Verificado     │
│  Ciudad, Lambayeque                 │
└─────────────────────────────────────┘
│  Descripción larga / historia       │
│                                     │
│  Galería de fotos (grid responsive) │
│                                     │
│  Contacto                           │
│  📞 Teléfono  💬 WhatsApp           │
│  📧 Email                           │
│  𝕀 Instagram  f Facebook  T TikTok │
│                                     │
│  Animales disponibles               │
│  [AnimalCard][AnimalCard]...        │
│  → Ver todos los animales           │
└─────────────────────────────────────┘
```

- Si `long_description` es null, se muestra `description`.
- Si `banner_url` es null, se muestra un gradiente con color primario.
- La galería se omite si `shelter_photos` está vacío.
- La sección de animales muestra hasta 4 animales disponibles del albergue.

### 3.3 Enlace desde `AnimalCard`

- El nombre del albergue en `AnimalCard` se convierte en `<Link href="/shelters/{shelter_id}">`.
- Requiere que `AnimalCard` reciba `shelterId` además de `shelterName`.

---

## 4. Archivos afectados

| Archivo | Cambio |
|---|---|
| `src/types/database.ts` | Nuevos campos + tipos |
| `src/lib/mock/shelters.ts` | Nuevos campos mock + fotos + función |
| `src/components/layout/ShelterSidebar.tsx` | Link a `/shelter/settings` |
| `src/components/animals/AnimalCard.tsx` | Recibe `shelterId`, nombre como link |
| `src/app/(public)/adopt/page.tsx` | Pasa `shelterId` a `AnimalCard` |
| `src/app/(public)/adopt/[slug]/page.tsx` | Pasa `shelterId` a datos del albergue si aplica |
| `src/app/(shelter)/shelter/settings/page.tsx` | **Nuevo** |
| `src/app/(public)/shelters/[id]/page.tsx` | **Nuevo** |

---

## 5. Fuera de scope

- Upload real de imágenes (Supabase Storage).
- Persistencia real de cambios (Supabase mutations).
- Autenticación real del albergue (se usa `MOCK_SHELTER_ID`).
- Página de listado de todos los albergues (`/shelters`).
