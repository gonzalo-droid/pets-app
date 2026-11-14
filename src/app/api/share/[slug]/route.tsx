import { getCampaignBySlug } from "@/lib/data/campaigns";
import { campaignShareImage } from "@/lib/huellas/share-image";

// Imagen vertical (1080×1920) para estados de WhatsApp e historias.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return new Response("Campaña no encontrada", { status: 404 });
  const image = await campaignShareImage(campaign, {
    width: 1080,
    height: 1920,
    origin: new URL(request.url).origin,
  });
  image.headers.set("Content-Disposition", `attachment; filename="${slug}.png"`);
  image.headers.set("Cache-Control", "public, max-age=300");
  return image;
}
