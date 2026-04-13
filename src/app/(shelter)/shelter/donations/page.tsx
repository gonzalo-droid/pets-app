import type { Metadata } from 'next'
import { getCampaigns } from '@/lib/mock/campaigns'
import { getDonationsByCampaigns, MOCK_DONOR_NAMES, MOCK_CAMPAIGN_TITLES } from '@/lib/mock/donations'
import DonationsManager from './DonationsManager'

export const metadata: Metadata = { title: 'Donaciones — Panel Albergue' }

const MOCK_SHELTER_ID = 'shelter-001'

export default async function ShelterDonationsPage() {
  const campaigns = await getCampaigns({ shelter_id: MOCK_SHELTER_ID })
  const campaignIds = campaigns.map((c) => c.id)
  const donations = await getDonationsByCampaigns(campaignIds)

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Verificación de donaciones</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {donations.filter((d) => d.payment_status === 'pending').length} comprobantes pendientes de verificar
        </p>
      </div>
      <DonationsManager
        donations={donations}
        donorNames={MOCK_DONOR_NAMES}
        campaignTitles={MOCK_CAMPAIGN_TITLES}
      />
    </div>
  )
}
