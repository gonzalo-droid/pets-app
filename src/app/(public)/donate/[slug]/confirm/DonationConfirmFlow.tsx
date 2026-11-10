import { SupportForm } from "@/components/huellas/Forms";
export default function DonationConfirmFlow({
  campaignSlug,
  campaignTitle,
}: {
  campaignSlug: string;
  campaignTitle: string;
  shelterName: string;
  yapeNumber: string | null;
  bankAccount: string | null;
  bankName: string | null;
  accountHolder: string | null;
}) {
  return (
    <SupportForm kind="donation" slug={campaignSlug} title={campaignTitle} />
  );
}
