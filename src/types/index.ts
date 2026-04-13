// Re-exporta todos los tipos de base de datos
export * from './database'

// ─── Tipos de filtros (usados por mock y data layers) ─────────────────────────

export interface AnimalFilters {
  species?: import('./database').AnimalSpecies
  size?: import('./database').AnimalSize
  status?: import('./database').AnimalStatus
  department?: string // nombre del departamento
  ubigeo?: string
}

export interface LostReportFilters {
  type?: import('./database').ReportType
  species?: import('./database').AnimalSpecies
  department?: string
  ubigeo?: string
  is_resolved?: boolean
}

export interface CampaignFilters {
  shelter_id?: string
  is_active?: boolean
  animal_id?: string
}

// ─── Tipos de UI / formularios ────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
}

// Ubigeo como objeto legible para el selector de departamento
export interface UbigeoOption {
  ubigeo: string
  department: string
  province: string
  district: string
  label: string // "Chiclayo, Lambayeque"
}
