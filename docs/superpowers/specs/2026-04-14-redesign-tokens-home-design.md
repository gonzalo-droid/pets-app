# Rediseño PawRescue — Tokens + Home

**Fecha:** 2026-04-14  
**Alcance:** Capa de tokens (globals.css + layout.tsx) + página Home completa  
**Estrategia:** Token-first → Home como página de referencia para el resto del sitio

---

## 1. Capa de tokens

### 1.1 Fuentes — `src/app/layout.tsx`

Añadir Plus Jakarta Sans como segunda fuente. Completar pesos de Nunito.

```
Nunito            → --font-display  pesos: 400 500 600 700 800 900
Plus Jakarta Sans → --font-body     pesos: 400 500 600 700
```

En `<html>`: aplicar ambas variables CSS.  
Body por defecto usa `--font-body`. Headings (h1–h3, display) usan `--font-display`.

### 1.2 Tokens de color — `src/app/globals.css`

Añadir en `@theme inline` los tokens semánticos. Cada grupo tiene variantes light/base/dark para soportar dark mode.

#### Paleta semántica (modo claro)

```css
/* brand — naranja energético, CTA principal */
--color-brand-50:  #FFF4E6
--color-brand-100: #FFE4BC
--color-brand-300: #FFB347
--color-brand-400: #FF9500   /* CTA principal */
--color-brand-500: #E07800   /* hover */
--color-brand-600: #C06000   /* pressed */

/* rescue — coral urgente, perdidos y alertas */
--color-rescue-light: #FFF0EE
--color-rescue:       #FF4D4D
--color-rescue-dark:  #CC2E2E

/* adopt — verde vivo, adopción y disponibilidad */
--color-adopt-light: #DCFCE7
--color-adopt:       #22C55E
--color-adopt-dark:  #15803D

/* donate — amarillo cálido, donaciones */
--color-donate-light: #FEFCE8
--color-donate:       #EAB308
--color-donate-dark:  #A16207

/* shelter — azul confianza, albergues */
--color-shelter-light: #EFF6FF
--color-shelter:       #3B82F6
--color-shelter-dark:  #1D4ED8
```

#### Dark mode

En `.dark {}`, los tokens `*-light` se oscurecen para que sean legibles sobre fondo oscuro:

```css
--color-rescue-light: #3D1A1A   /* fondo sección perdidos en dark */
--color-adopt-light:  #14331F
--color-donate-light: #332D0A
--color-shelter-light: #0F1D35
```

Los tokens base (rescue, adopt, donate, shelter) permanecen igual — son colores vivos que funcionan en ambos modos. Solo varían los `*-light` de fondo.

El `--primary` existente (amber) se alinea con `brand-400` — no requiere cambio, ya coincide.

Fondo de página: actualizar `--background` en `:root` de `oklch(1 0 0)` (blanco puro) a `oklch(0.98 0.005 80)` (neutral-50 cálido, ~#F9FAFB). En dark mode no cambia.

---

## 2. Home — `src/app/(public)/page.tsx`

### 2.1 Navbar

Sin cambios funcionales. Ajustes visuales:
- Logo: `🐾 **Paw**Rescue` — "Paw" en `text-brand-400`, "Rescue" en `text-foreground`, Nunito 900
- Fondo: `bg-background` (blanco/oscuro según tema), `border-b border-border`
- Sticky: ya implementado

### 2.2 Hero

**Layout:** `grid grid-cols-1 lg:grid-cols-[3fr_2fr]`, altura mínima `min-h-[520px]`

**Columna izquierda (texto):**
- Fondo: gradiente `from-brand-400 to-orange-500` — igual en dark (el gradiente es lo suficientemente saturado)
- Contenido sobre el gradiente, texto en blanco
- Eyebrow: `text-white/70 text-xs uppercase tracking-widest font-body` — "Lambayeque · Rescate animal"
- H1: Nunito 900, `clamp(2.4rem, 5vw, 4rem)`, blanco: `"Encuentra tu compañero para siempre 🐾"`
- Subtítulo: Plus Jakarta Sans, `text-white/80 text-sm`
- CTAs:
  - Primario: `bg-white text-brand-500 font-bold rounded-xl` hover `bg-white/90`
  - Secundario: `border-2 border-white/70 text-white rounded-xl` hover `bg-white/10`
- Stats: `text-white/60 text-xs` — conteos dinámicos pasados como props desde el server component (`.length` de los arrays de mock). Formato: "🐾 {N} en adopción · 🔍 {N} perdidos · 🏠 {N} albergues"

**Columna derecha (foto):**
- `relative overflow-hidden` — en desktop flush al borde, en mobile `rounded-2xl mx-4`
- Imagen: `object-cover object-center fill`
- URL: usar una de las fotos existentes en `MOCK_ANIMALS` (Unsplash, perro o gato mirando a cámara). Ej: `https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80`
- Overlay sutil en dark mode: `dark:brightness-90`

**Mobile:** columna derecha va debajo del texto, altura fija `h-64`, CTAs full-width.

### 2.3 Accesos rápidos

Grid `grid-cols-2 lg:grid-cols-4`, reemplaza la sección actual.

Cada card: `rounded-2xl border-l-4 p-5 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-md transition-all duration-200`

| Card | Emoji | Border/acento | Fondo claro | Fondo dark |
|------|-------|--------------|-------------|------------|
| Adoptar | 🐾 | `adopt` | `bg-adopt-light` | `bg-adopt-light` (oscuro) |
| Perdidos | 🔍 | `rescue` | `bg-rescue-light` | `bg-rescue-light` (oscuro) |
| Donar | 💛 | `donate` | `bg-donate-light` | `bg-donate-light` (oscuro) |
| Albergues | 🏠 | `shelter` | `bg-shelter-light` | `bg-shelter-light` (oscuro) |

Título de card: Nunito 800 `text-foreground`. Subtítulo: Plus Jakarta Sans sm `text-muted-foreground`. CTA: `text-xs font-semibold` en el color semántico correspondiente.

### 2.4 Feed de animales en adopción

- Título sección: Nunito 800 `text-2xl`
- Filtros: chips `rounded-full px-4 py-1.5 text-sm font-semibold border-2` — activo `bg-brand-400 text-white border-brand-400`, inactivo `border-border text-muted-foreground hover:border-brand-400`
- Cards (`AnimalCard`): sombra `shadow-sm hover:shadow-lg` en lugar de borde visible; badge de estado flotante sobre la foto (`absolute top-3 left-3`); hover `translateY(-3px)` 200ms

### 2.5 Campañas de donación

- Fondo sección: `bg-neutral-900` en claro. En dark: `bg-neutral-800` (ligeramente distinto al fondo de página)
- Título: Nunito 800, texto blanco
- Cards de campaña: `bg-neutral-800 dark:bg-neutral-700 rounded-2xl`
- Barra de progreso: track `bg-neutral-700`, fill `bg-brand-400`
- CTA: `bg-brand-400 text-white`

### 2.6 Perdidos recientes

- Fondo: `bg-rescue-light` (varía por tema según tokens definidos en §1.2)
- Título: Nunito 800, `text-foreground`
- Cards compactas existentes, ajuste de colores semánticos

### 2.7 Albergues verificados

- Badge verificado: `bg-shelter-light text-shelter-dark` con icono `BadgeCheck` en `text-shelter`
- Cards: hover `border-shelter/40`

### 2.8 Footer

- Fondo: `bg-neutral-900` en ambos modos
- Logo: igual que navbar pero en blanco
- Texto: `text-neutral-400`
- Links: `hover:text-white transition-colors`

---

## 3. Tipografía global

En `globals.css @layer base`:

```css
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 800;
}
body {
  font-family: var(--font-body);
}
```

Esto afecta todo el sitio automáticamente — cada página hereda Nunito para headings y Plus Jakarta Sans para el resto sin tocar cada componente.

---

## 4. Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/app/layout.tsx` | Añadir Plus Jakarta Sans, peso 900 a Nunito, variables CSS |
| `src/app/globals.css` | Tokens semánticos en `@theme inline`, dark mode variants, tipografía base |
| `src/app/(public)/page.tsx` | Rediseño completo del home |
| `src/components/layout/Navbar.tsx` | Logo con color brand-400 en "Paw" |
| `src/components/animals/AnimalCard.tsx` | Badge flotante, sombra en lugar de borde, hover lift |

Componentes como `CampaignCard`, `LostReportCard`, `ShelterCard` reciben los cambios de forma indirecta a través de los tokens — ajustes mínimos si es necesario.

---

## 5. Lo que NO cambia

- Estructura de rutas y páginas internas (adopt, lost, shelters, etc.)
- Lógica de filtros, paginación, búsqueda
- Datos mock
- Componentes de formulario (apply, lost/new, donate)
- Panel del albergue (`/shelter/*`)
- Dark mode toggle — sigue funcionando igual
