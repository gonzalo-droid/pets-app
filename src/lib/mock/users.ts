// Usuarios de prueba — sin Supabase
// Credenciales válidas para revisar los flujos de usuario y albergue

export interface MockUser {
  id: string
  email: string
  password: string
  full_name: string
  role: 'user' | 'shelter'
  shelter_id?: string // solo para rol shelter
  redirectTo: string  // a dónde va después del login
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'mock-user-001',
    email: 'usuario@pawrescue.pe',
    password: 'demo1234',
    full_name: 'María García',
    role: 'user',
    redirectTo: '/',
  },
  {
    id: 'mock-shelter-001',
    email: 'albergue@pawrescue.pe',
    password: 'demo1234',
    full_name: 'Patitas Chiclayo',
    role: 'shelter',
    shelter_id: 'shelter-001',
    redirectTo: '/shelter/dashboard',
  },
]

export function findMockUser(email: string, password: string): MockUser | null {
  return (
    MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) ?? null
  )
}

export const MOCK_SESSION_KEY = 'pawrescue_mock_session'

export function getMockSession(): MockUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY)
    return raw ? (JSON.parse(raw) as MockUser) : null
  } catch {
    return null
  }
}

export function setMockSession(user: MockUser): void {
  localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user))
}

export function clearMockSession(): void {
  localStorage.removeItem(MOCK_SESSION_KEY)
}
