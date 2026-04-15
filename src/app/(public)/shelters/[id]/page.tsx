import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { getShelterWithPhotos } from '@/lib/data/shelters'
import { getAnimalsByShelter } from '@/lib/data/animals'
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
        <div className="relative h-48 sm:h-60 bg-gradient-to-r from-shelter/30 to-shelter/10">
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
        <div className="px-6 pb-6 bg-card">
          <div className="flex items-end gap-4 -mt-10">
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
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-shelter text-white">
                  <BadgeCheck className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="pt-12">
              <h1 className="font-display font-bold text-xl text-foreground leading-tight">{shelter.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{city}, Lambayeque</p>
            </div>
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
              <ContactChip
                icon={<span className="text-[11px] font-bold leading-none">WA</span>}
                label={`WhatsApp ${shelter.whatsapp}`}
              />
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
              <ContactChip
                icon={<span className="text-[11px] font-bold leading-none">IG</span>}
                label={`@${shelter.instagram}`}
              />
            </a>
          )}
          {shelter.facebook && (
            <a
              href={`https://facebook.com/${shelter.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactChip
                icon={<span className="text-[11px] font-bold leading-none">FB</span>}
                label={shelter.facebook}
              />
            </a>
          )}
          {shelter.tiktok && (
            <a
              href={`https://tiktok.com/@${shelter.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactChip
                icon={<span className="text-[11px] font-bold leading-none">TT</span>}
                label={`@${shelter.tiktok}`}
              />
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
              href="/adopt"
              className="flex items-center gap-1 text-xs text-brand-400 hover:underline"
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-shelter/40 transition-colors cursor-pointer">
      {icon}
      {label}
    </span>
  )
}
