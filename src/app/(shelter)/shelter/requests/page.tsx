import type { Metadata } from 'next'
import { getRequestsByShelter, MOCK_REQUESTER_NAMES, MOCK_ANIMAL_NAMES } from '@/lib/mock/requests'
import RequestsManager from './RequestsManager'

export const metadata: Metadata = { title: 'Solicitudes de adopción — Panel Albergue' }

const MOCK_SHELTER_ID = 'shelter-001'

export default async function RequestsPage() {
  const requests = await getRequestsByShelter(MOCK_SHELTER_ID)
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Solicitudes de adopción</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {requests.filter((r) => r.status === 'pending').length} pendientes de revisión
        </p>
      </div>
      <RequestsManager
        requests={requests}
        requesterNames={MOCK_REQUESTER_NAMES}
        animalNames={MOCK_ANIMAL_NAMES}
      />
    </div>
  )
}
