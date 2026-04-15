import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import DonationConfirmFlow from './DonationConfirmFlow'
import { getCampaignBySlug } from '@/lib/data/campaigns'
import { getShelterById } from '@/lib/data/shelters'

interface ConfirmPageProps {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: 'Confirmar donación',
}

export default async function DonationConfirmPage({ params }: ConfirmPageProps) {
  const { slug } = await params
  const campaign = await getCampaignBySlug(slug)
  if (!campaign || !campaign.is_active) notFound()

  const shelter = await getShelterById(campaign.shelter_id)
  if (!shelter) notFound()

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href={`/donate/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la campaña
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hacer una donación</h1>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{campaign.title}</p>
      </div>

      <DonationConfirmFlow
        campaignSlug={slug}
        campaignTitle={campaign.title}
        shelterName={shelter.name}
        yapeNumber={shelter.yape_number}
        bankAccount={shelter.bank_account}
        bankName={shelter.bank_name}
        accountHolder={shelter.account_holder}
      />
    </div>
  )
}
