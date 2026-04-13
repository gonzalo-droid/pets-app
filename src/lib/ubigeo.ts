// Distritos del departamento de Lambayeque — códigos INEI
// Fuente: INEI Perú — se usa en selectores de ubigeo en todo el proyecto

export interface District {
  ubigeo: string
  province: string
  district: string
  label: string // "{district}, {province}"
}

export const LAMBAYEQUE_DISTRICTS: District[] = [
  // ── Provincia Chiclayo ────────────────────────────────────────────────
  { ubigeo: '140101', province: 'Chiclayo', district: 'Chiclayo',              label: 'Chiclayo, Chiclayo' },
  { ubigeo: '140102', province: 'Chiclayo', district: 'Chongoyape',            label: 'Chongoyape, Chiclayo' },
  { ubigeo: '140103', province: 'Chiclayo', district: 'Eten',                  label: 'Eten, Chiclayo' },
  { ubigeo: '140104', province: 'Chiclayo', district: 'Ciudad Eten',           label: 'Ciudad Eten, Chiclayo' },
  { ubigeo: '140105', province: 'Chiclayo', district: 'José Leonardo Ortiz',   label: 'José Leonardo Ortiz, Chiclayo' },
  { ubigeo: '140106', province: 'Chiclayo', district: 'La Victoria',           label: 'La Victoria, Chiclayo' },
  { ubigeo: '140107', province: 'Chiclayo', district: 'Lagunas',               label: 'Lagunas, Chiclayo' },
  { ubigeo: '140108', province: 'Chiclayo', district: 'Monsefú',               label: 'Monsefú, Chiclayo' },
  { ubigeo: '140109', province: 'Chiclayo', district: 'Nueva Arica',           label: 'Nueva Arica, Chiclayo' },
  { ubigeo: '140110', province: 'Chiclayo', district: 'Oyotún',                label: 'Oyotún, Chiclayo' },
  { ubigeo: '140111', province: 'Chiclayo', district: 'Picsi',                 label: 'Picsi, Chiclayo' },
  { ubigeo: '140112', province: 'Chiclayo', district: 'Pimentel',              label: 'Pimentel, Chiclayo' },
  { ubigeo: '140113', province: 'Chiclayo', district: 'Reque',                 label: 'Reque, Chiclayo' },
  { ubigeo: '140114', province: 'Chiclayo', district: 'Santa Rosa',            label: 'Santa Rosa, Chiclayo' },
  { ubigeo: '140115', province: 'Chiclayo', district: 'Saña',                  label: 'Saña, Chiclayo' },
  { ubigeo: '140116', province: 'Chiclayo', district: 'Cayaltí',               label: 'Cayaltí, Chiclayo' },
  { ubigeo: '140117', province: 'Chiclayo', district: 'Pátapo',                label: 'Pátapo, Chiclayo' },
  { ubigeo: '140118', province: 'Chiclayo', district: 'Pomalca',               label: 'Pomalca, Chiclayo' },
  { ubigeo: '140119', province: 'Chiclayo', district: 'Pucalá',                label: 'Pucalá, Chiclayo' },
  { ubigeo: '140120', province: 'Chiclayo', district: 'Tumán',                 label: 'Tumán, Chiclayo' },
  // ── Provincia Ferreñafe ───────────────────────────────────────────────
  { ubigeo: '140201', province: 'Ferreñafe', district: 'Ferreñafe',            label: 'Ferreñafe, Ferreñafe' },
  { ubigeo: '140202', province: 'Ferreñafe', district: 'Cañaris',              label: 'Cañaris, Ferreñafe' },
  { ubigeo: '140203', province: 'Ferreñafe', district: 'Incahuasi',            label: 'Incahuasi, Ferreñafe' },
  { ubigeo: '140204', province: 'Ferreñafe', district: 'Manuel Mesones Muro',  label: 'Manuel Mesones Muro, Ferreñafe' },
  { ubigeo: '140205', province: 'Ferreñafe', district: 'Pítipo',               label: 'Pítipo, Ferreñafe' },
  { ubigeo: '140206', province: 'Ferreñafe', district: 'Pueblo Nuevo',         label: 'Pueblo Nuevo, Ferreñafe' },
  // ── Provincia Lambayeque ──────────────────────────────────────────────
  { ubigeo: '140301', province: 'Lambayeque', district: 'Lambayeque',          label: 'Lambayeque, Lambayeque' },
  { ubigeo: '140302', province: 'Lambayeque', district: 'Chochope',            label: 'Chochope, Lambayeque' },
  { ubigeo: '140303', province: 'Lambayeque', district: 'Íllimo',              label: 'Íllimo, Lambayeque' },
  { ubigeo: '140304', province: 'Lambayeque', district: 'Jayanca',             label: 'Jayanca, Lambayeque' },
  { ubigeo: '140305', province: 'Lambayeque', district: 'Mochumí',             label: 'Mochumí, Lambayeque' },
  { ubigeo: '140306', province: 'Lambayeque', district: 'Mórrope',             label: 'Mórrope, Lambayeque' },
  { ubigeo: '140307', province: 'Lambayeque', district: 'Motupe',              label: 'Motupe, Lambayeque' },
  { ubigeo: '140308', province: 'Lambayeque', district: 'Olmos',               label: 'Olmos, Lambayeque' },
  { ubigeo: '140309', province: 'Lambayeque', district: 'Pacora',              label: 'Pacora, Lambayeque' },
  { ubigeo: '140310', province: 'Lambayeque', district: 'Salas',               label: 'Salas, Lambayeque' },
  { ubigeo: '140311', province: 'Lambayeque', district: 'San José',            label: 'San José, Lambayeque' },
  { ubigeo: '140312', province: 'Lambayeque', district: 'Túcume',              label: 'Túcume, Lambayeque' },
]

// Lookup rápido ubigeo → label
export const DISTRICT_LABEL: Record<string, string> = Object.fromEntries(
  LAMBAYEQUE_DISTRICTS.map((d) => [d.ubigeo, d.label])
)
