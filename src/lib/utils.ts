import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Formateo de moneda en soles peruanos ─────────────────────────────────────

export function formatPEN(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── Porcentaje de progreso de campaña ────────────────────────────────────────

export function campaignProgress(current: number, goal: number): number {
  if (goal === 0) return 0
  return Math.min(Math.round((current / goal) * 100), 100)
}

// ─── Edad legible desde meses ────────────────────────────────────────────────

export function formatAge(months: number | null): string {
  if (months === null) return 'Edad desconocida'
  if (months < 1) return 'Menos de 1 mes'
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  const yearStr = `${years} ${years === 1 ? 'año' : 'años'}`
  if (rem === 0) return yearStr
  return `${yearStr} y ${rem} ${rem === 1 ? 'mes' : 'meses'}`
}

// ─── Días transcurridos desde una fecha ISO ──────────────────────────────────

export function daysAgo(isoDate: string): number {
  const diff = Date.now() - new Date(isoDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// ─── Etiquetas en español para los enums ─────────────────────────────────────

export const SPECIES_LABELS: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
  other: 'Otro',
}

export const SIZE_LABELS: Record<string, string> = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
}

export const GENDER_LABELS: Record<string, string> = {
  male: 'Macho',
  female: 'Hembra',
  unknown: 'Desconocido',
}

export const STATUS_LABELS: Record<string, string> = {
  available: 'Disponible',
  in_process: 'En proceso',
  adopted: 'Adoptado',
  lost: 'Perdido',
  found: 'Encontrado',
  reunited: 'Reunificado',
}

