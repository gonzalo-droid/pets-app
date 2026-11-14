import { getCampaignBySlug } from "@/lib/data/campaigns";
import { campaignShareImage } from "@/lib/huellas/share-image";
import { ImageResponse } from "next/og";

// Vista previa del enlace en WhatsApp, Facebook y otras redes.
export const alt = "Campaña de un albergue en HUELLAS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign)
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2f6b54", color: "#fff", fontSize: 72, fontWeight: 700 }}>
          HUELLAS
        </div>
      ),
      size,
    );
  return campaignShareImage(campaign, size);
}
