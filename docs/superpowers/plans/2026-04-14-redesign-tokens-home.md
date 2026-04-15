# Rediseño PawRescue — Tokens + Home

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el sistema de diseño PawRescue completo — paleta semántica, tipografía Nunito + Plus Jakarta Sans — empezando por los tokens globales y el Home como página de referencia.

**Architecture:** Token-first en `globals.css` (Tailwind v4 CSS-first, `@theme inline`). Fuentes via `next/font/google` en `layout.tsx`. Home reescrito sección por sección usando los nuevos tokens semánticos. Dark mode soportado en todos los cambios.

**Tech Stack:** Next.js App Router, Tailwind v4 (`@theme inline`), `next/font/google`, shadcn/ui v4, TypeScript estricto.

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/app/layout.tsx` | Añadir Plus Jakarta Sans (pesos 400–700), Nunito peso 900, variables `--font-display` / `--font-body` |
| `src/app/globals.css` | Tokens semánticos en `@theme inline`, dark variants en `.dark`, tipografía base, background neutral-50 |
| `src/components/layout/Navbar.tsx` | Logo: emoji 🐾 + "Paw" brand-400 + "Rescue" foreground |
| `src/components/animals/AnimalCard.tsx` | Sin borde → sombra; badge flotante sobre foto; hover lift |
| `src/app/(public)/page.tsx` | Hero asimétrico, accesos con colores semánticos, campañas dark, sección perdidos rescue-light |

---

## Task 1: Fuentes en layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Reemplazar el contenido de `src/app/layout.tsx`:**

```tsx
import type { Metadata } from 'next'
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'PawRescue — Adopción y rescate animal en Perú',
    template: '%s | PawRescue',
  },
  description:
    'Encuentra tu compañero ideal, reporta animales perdidos y apoya a los albergues de Lambayeque y todo el Perú.',
  keywords: ['adopción animales', 'perros en adopción', 'gatos en adopción', 'Chiclayo', 'Lambayeque', 'Perú'],
  openGraph: {
    siteName: 'PawRescue',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Commit:**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Plus Jakarta Sans, Nunito weight 900 via next/font"
```

---

## Task 2: Tokens de color y tipografía en globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Añadir en el bloque `@theme inline` los tokens semánticos y de fuentes. Agregar DESPUÉS de la línea `--radius-4xl: calc(var(--radius) * 2.6);`:**

```css
  /* ── Fuentes PawRescue ────────────────────────────────────────── */
  --font-display: var(--font-nunito);
  --font-body: var(--font-jakarta);
  --font-sans: var(--font-jakarta);

  /* ── Paleta semántica — colores fijos (no varían con tema) ──── */
  --color-brand-50:  #FFF4E6;
  --color-brand-100: #FFE4BC;
  --color-brand-300: #FFB347;
  --color-brand-400: #FF9500;
  --color-brand-500: #E07800;
  --color-brand-600: #C06000;

  --color-rescue:      #FF4D4D;
  --color-rescue-dark: #CC2E2E;

  --color-adopt:      #22C55E;
  --color-adopt-dark: #15803D;

  --color-donate:      #EAB308;
  --color-donate-dark: #A16207;

  --color-shelter:      #3B82F6;
  --color-shelter-dark: #1D4ED8;

  /* ── Colores *-light — adaptativos por tema (CSS var) ─────────── */
  --color-rescue-light:  var(--rescue-light);
  --color-adopt-light:   var(--adopt-light);
  --color-donate-light:  var(--donate-light);
  --color-shelter-light: var(--shelter-light);
```

- [ ] **Añadir las variables CSS adaptativas en `:root` (modo claro). Agregar DESPUÉS de `--radius: 0.625rem;`:**

```css
  /* ── Colores semánticos light ─────────────────────────────────── */
  --rescue-light:  #FFF0EE;
  --adopt-light:   #DCFCE7;
  --donate-light:  #FEFCE8;
  --shelter-light: #EFF6FF;
  /* ── Background neutral-50 (no blanco puro) ───────────────────── */
  --background: oklch(0.98 0.005 80);
```

> Nota: reemplaza la línea `--background: oklch(1 0 0);` existente con `--background: oklch(0.98 0.005 80);`.

- [ ] **Añadir las variantes dark en el bloque `.dark {}`. Agregar ANTES del cierre `}` del bloque `.dark`:**

```css
  /* ── Colores semánticos dark ──────────────────────────────────── */
  --rescue-light:  #3D1A1A;
  --adopt-light:   #14331F;
  --donate-light:  #332D0A;
  --shelter-light: #0F1D35;
```

- [ ] **Actualizar el bloque `@layer base` para aplicar tipografía global:**

Reemplazar:
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

Por:
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  html {
    font-family: var(--font-body);
  }
  h1, h2, h3 {
    font-family: var(--font-display);
  }
}
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Verificar visualmente** — iniciar dev server y abrir home:

```bash
npm run dev
```

Abrir http://localhost:3000. Los textos deben verse con Plus Jakarta Sans en el body y Nunito en los headings. El fondo debe ser ligeramente cálido (neutral-50) en lugar de blanco puro.

- [ ] **Commit:**

```bash
git add src/app/globals.css
git commit -m "feat: add semantic color tokens and typography system to globals.css"
```

---

## Task 3: Logo del Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Reemplazar el bloque del logo (líneas 38–44) en `Navbar.tsx`:**

Reemplazar:
```tsx
<Link
  href="/"
  className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-90 transition-opacity"
>
  <PawPrint className="h-6 w-6" />
  <span>PawRescue</span>
</Link>
```

Por:
```tsx
<Link
  href="/"
  className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
  aria-label="PawRescue — inicio"
>
  <span className="text-2xl leading-none">🐾</span>
  <span className="font-display font-black text-xl leading-none">
    <span className="text-brand-400">Paw</span>
    <span className="text-foreground">Rescue</span>
  </span>
</Link>
```

- [ ] **Eliminar `PawPrint` del import de lucide-react** (línea 3). Queda:

```tsx
import { Menu, X, Heart, LogOut, LayoutDashboard, UserCircle } from 'lucide-react'
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Verificar visualmente** — el logo debe mostrar 🐾 + "Paw" en naranja + "Rescue" en foreground.

- [ ] **Commit:**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: update navbar logo with brand colors"
```

---

## Task 4: AnimalCard — sombra, badge flotante, hover lift

**Files:**
- Modify: `src/components/animals/AnimalCard.tsx`

- [ ] **Reemplazar el contenido completo de `AnimalCard.tsx`:**

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn, formatAge, SPECIES_LABELS, SIZE_LABELS } from '@/lib/utils'
import type { AnimalWithPhotos } from '@/types'

interface AnimalCardProps {
  animal: AnimalWithPhotos
  shelterName?: string
  shelterId?: string
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  available: {
    label: 'Disponible',
    className: 'bg-adopt text-white',
  },
  in_process: {
    label: 'En proceso',
    className: 'bg-donate text-white',
  },
  adopted: {
    label: 'Adoptado',
    className: 'bg-muted text-muted-foreground',
  },
}

export default function AnimalCard({ animal, shelterName, shelterId }: AnimalCardProps) {
  const coverPhoto = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0]
  const badge = STATUS_BADGE[animal.status]

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Link principal — cubre toda la card */}
      <Link
        href={`/adopt/${animal.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Ver ${animal.name}`}
      />

      {/* Foto */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {coverPhoto ? (
          <Image
            src={coverPhoto.url}
            alt={`Foto de ${animal.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
            {animal.species === 'dog' ? '🐶' : animal.species === 'cat' ? '🐱' : '🐾'}
          </div>
        )}

        {/* Badge flotante sobre la foto */}
        {badge && (
          <span className={cn(
            'absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            badge.className
          )}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col gap-2 p-4 flex-1 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-foreground text-base leading-tight">
            {animal.name}
          </h3>
          <span className="text-xs text-muted-foreground shrink-0">
            {SPECIES_LABELS[animal.species]}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatAge(animal.age_months)}</span>
          <span>·</span>
          <span>{SIZE_LABELS[animal.size]}</span>
          {animal.breed && (
            <>
              <span>·</span>
              <span className="truncate">{animal.breed}</span>
            </>
          )}
        </div>

        {/* Albergue */}
        {shelterName && (
          <div className="mt-auto pt-2 border-t border-border pointer-events-auto">
            {shelterId ? (
              <Link
                href={`/shelters/${shelterId}`}
                className="text-xs text-brand-400 hover:underline truncate block"
              >
                {shelterName}
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground truncate">{shelterName}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Verificar visualmente** — abrir /adopt y comprobar que las cards tienen sombra, badge verde "Disponible" flotante sobre la foto y efecto lift al hacer hover.

- [ ] **Commit:**

```bash
git add src/components/animals/AnimalCard.tsx
git commit -m "feat: update AnimalCard with shadow, floating badge, hover lift"
```

---

## Task 5: Home — Hero asimétrico

**Files:**
- Modify: `src/app/(public)/page.tsx` (solo la sección Hero, líneas 29–55)

- [ ] **Reemplazar la sección hero en `page.tsx`:**

Reemplazar desde `{/* ── Hero */}` hasta el cierre `</section>` del hero por:

```tsx
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-[520px]">
          {/* Columna izquierda — texto + CTAs */}
          <div className="flex flex-col justify-center gap-6 bg-gradient-to-br from-brand-400 to-orange-500 px-8 py-16 sm:px-12 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Lambayeque · Rescate animal
            </p>
            <h1 className="font-display font-black text-white leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              Encuentra tu<br />
              compañero<br />
              para siempre 🐾
            </h1>
            <p className="text-white/80 text-sm max-w-sm leading-relaxed">
              Adopta, reporta animales perdidos y apoya a los albergues de Lambayeque.
              Todo en un solo lugar, sin Facebook.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/adopt"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-500 hover:bg-white/90 transition-colors"
              >
                Ver animales en adopción
              </Link>
              <Link
                href="/lost"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Buscar perdidos
              </Link>
            </div>
            <p className="text-white/60 text-xs">
              🐾 {animals.filter(a => a.status === 'available').length} en adopción
              &nbsp;·&nbsp;
              🔍 {lostReports.length} reportes activos
              &nbsp;·&nbsp;
              🏠 {shelters.length} albergues
            </p>
          </div>

          {/* Columna derecha — foto del animal */}
          <div className="relative h-64 lg:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80"
              alt="Animal esperando adopción"
              className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-90"
            />
          </div>
        </div>
      </section>
```

> Nota: eliminar los imports de `PawPrint`, `Search` y `Heart` del hero que ya no se usan. Verificar que `Heart` sigue siendo usado en el Navbar (sí, pero ese es otro archivo). En `page.tsx`, verificar que los imports `Heart` y `Search` no se usan en otra parte antes de eliminarlos.

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

- [ ] **Verificar visualmente** — hero con gradiente naranja izquierda, foto derecha, texto blanco legible en ambos temas.

- [ ] **Commit:**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat: redesign home hero with asymmetric layout and brand gradient"
```

---

## Task 6: Home — Accesos rápidos con colores semánticos

**Files:**
- Modify: `src/app/(public)/page.tsx` (sección accesos rápidos, líneas ~57–77)

- [ ] **Reemplazar la sección de accesos rápidos:**

Reemplazar desde `{/* ── Accesos rápidos */}` hasta su `</section>` por:

```tsx
      {/* ── Accesos rápidos ───────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/adopt"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-adopt bg-adopt-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">🐾</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Adoptar</p>
              <p className="text-xs text-muted-foreground mt-0.5">{animals.filter(a => a.status === 'available').length} disponibles</p>
            </div>
            <span className="text-xs font-semibold text-adopt-dark">Ver todos →</span>
          </Link>

          <Link
            href="/lost"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-rescue bg-rescue-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">🔍</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Perdidos</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lostReports.length} activos</p>
            </div>
            <span className="text-xs font-semibold text-rescue-dark">Ver reportes →</span>
          </Link>

          <Link
            href="/donate"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-donate bg-donate-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">💛</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Donar</p>
              <p className="text-xs text-muted-foreground mt-0.5">{campaigns.length} campañas</p>
            </div>
            <span className="text-xs font-semibold text-donate-dark">Ver campañas →</span>
          </Link>

          <Link
            href="/shelters"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-shelter bg-shelter-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">🏠</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Albergues</p>
              <p className="text-xs text-muted-foreground mt-0.5">{shelters.length} verificados</p>
            </div>
            <span className="text-xs font-semibold text-shelter-dark">Conocerlos →</span>
          </Link>
        </div>
      </section>
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

- [ ] **Verificar visualmente** — 4 cards con colores semánticos distintos (verde, rojo, amarillo, azul). En dark mode los fondos `*-light` deben verse oscuros pero con el tinte del color correspondiente.

- [ ] **Commit:**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat: redesign quick access cards with semantic colors"
```

---

## Task 7: Home — Feed, SectionHeader y filtros

**Files:**
- Modify: `src/app/(public)/page.tsx` (función `SectionHeader` y sección feed)

- [ ] **Actualizar `SectionHeader` (al final del archivo, ~líneas 173–200):**

Reemplazar la función `SectionHeader` por:

```tsx
function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string
  subtitle?: string
  href?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <h2 className="font-display font-bold text-2xl tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-500 hover:underline shrink-0 transition-colors"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
```

- [ ] **Actualizar la sección feed (líneas ~79–89):**

Reemplazar desde `{/* ── Feed adopciones */}` hasta su `</section>` por:

```tsx
      {/* ── Feed adopciones ───────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Animales en adopción"
            subtitle="Todos esperando un hogar responsable en Lambayeque"
            href="/adopt"
          />
          <AnimalFeedFilter animals={animals} shelterNames={shelterNames} />
        </div>
      </section>
```

> Nota: La sección feed no cambia en estructura, solo hereda los nuevos estilos de `SectionHeader` y `AnimalCard`.

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

- [ ] **Commit:**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat: update SectionHeader with display font and brand link color"
```

---

## Task 8: Home — Sección campañas (fondo oscuro)

**Files:**
- Modify: `src/app/(public)/page.tsx` (sección campañas, líneas ~91–105)

- [ ] **Reemplazar la sección de campañas:**

Reemplazar desde `{/* ── Campañas activas */}` hasta su `</section>` por:

```tsx
      {/* ── Campañas activas ──────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-neutral-900 dark:bg-neutral-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight text-white">
                Campañas de donación activas
              </h2>
              <p className="mt-1 text-sm text-neutral-400">Tu aporte en soles hace la diferencia</p>
            </div>
            <Link
              href="/donate"
              className="flex items-center gap-1 text-sm font-semibold text-brand-300 hover:text-brand-400 hover:underline shrink-0 transition-colors"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

- [ ] **Verificar visualmente** — sección con fondo oscuro, contrasta fuertemente con las secciones adyacentes. En dark mode el fondo es `neutral-800` (levemente distinto al fondo de página dark).

- [ ] **Commit:**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat: campaigns section with dark background for visual contrast"
```

---

## Task 9: Home — Perdidos, Albergues y CTA final

**Files:**
- Modify: `src/app/(public)/page.tsx` (secciones perdidos, albergues y CTA)

- [ ] **Reemplazar la sección de perdidos recientes:**

Reemplazar desde `{/* ── Perdidos recientes */}` hasta su `</section>` por:

```tsx
      {/* ── Perdidos recientes ────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-rescue-light">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Perdidos y encontrados"
            subtitle="Ayuda a reunir mascotas con sus familias"
            href="/lost"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lostReports.slice(0, 4).map((report) => (
              <LostReportCard key={report.id} report={report} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/lost/new"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Reportar animal perdido o encontrado
            </Link>
          </div>
        </div>
      </section>
```

> Nota: se añade `.slice(0, 4)` para mostrar solo 4 reportes recientes en el home en lugar de todos.

- [ ] **Reemplazar la sección de albergues verificados:**

Reemplazar desde `{/* ── Albergues verificados */}` hasta su `</section>` por:

```tsx
      {/* ── Albergues verificados ─────────────────────────────────────────── */}
      <section id="shelters" className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Albergues verificados"
            subtitle="Organizaciones comprometidas con el rescate animal en Lambayeque"
            href="/shelters"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shelters.slice(0, 4).map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
        </div>
      </section>
```

> Nota: se añade `.slice(0, 4)` para mostrar solo 4 albergues. Se añade `href="/shelters"` al `SectionHeader`.

- [ ] **Reemplazar el CTA final:**

Reemplazar desde `{/* ── CTA para albergues */}` hasta su `</section>` por:

```tsx
      {/* ── CTA para albergues ────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-brand-50 dark:bg-brand-600/10 border-t border-brand-100 dark:border-brand-600/20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display font-bold text-2xl text-foreground">¿Tienes un albergue?</h2>
          <p className="mt-3 text-muted-foreground">
            Regístrate gratis y gestiona tus animales, solicitudes de adopción y campañas
            de donación desde un solo panel. Sin comisiones en el MVP.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className={cn(buttonVariants({ size: 'lg' }))}>
              Registrar mi albergue
            </Link>
            <Link
              href="/shelter/dashboard"
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}
            >
              Ver demo del panel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
```

- [ ] **Limpiar imports no usados en `page.tsx`** — verificar que `PawPrint`, `Search` y `Heart` no están en el archivo (fueron del hero anterior). Eliminar de la línea de imports:

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import AnimalFeedFilter from '@/components/animals/AnimalFeedFilter'
import CampaignCard from '@/components/campaigns/CampaignCard'
import LostReportCard from '@/components/lost/LostReportCard'
import ShelterCard from '@/components/shelters/ShelterCard'
import { getAnimals } from '@/lib/mock/animals'
import { getCampaigns } from '@/lib/mock/campaigns'
import { getLostReports } from '@/lib/mock/lost-reports'
import { getShelters } from '@/lib/mock/shelters'
```

- [ ] **Verificar TypeScript:**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Verificar visualmente el home completo** en ambos modos (claro y oscuro):
  - Hero: gradiente naranja + foto animal
  - Accesos: 4 cards con colores semánticos
  - Feed: cards con sombra y badge flotante
  - Campañas: fondo oscuro neutral-900
  - Perdidos: fondo rescue-light (rojo suave en claro, rojo oscuro en dark)
  - Albergues: fondo neutro
  - CTA: fondo brand-50 naranja suave

- [ ] **Commit final:**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat: complete home redesign with semantic colors, dark bg campaigns, rescue-light lost section"
```
