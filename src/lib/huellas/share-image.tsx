import { ImageResponse } from "next/og";
import type { CampaignWithShelter } from "@/types";
import { CAMPAIGN_KIND_LABEL, campaignImage, eventDateLabel } from "./domain";
import { campaignProgress, formatPEN } from "@/lib/utils";

// Trae la foto y la incrusta; si falla, la imagen se arma sin foto en vez de romperse.
async function photoData(url: string | null, origin?: string): Promise<string | null> {
  if (!url) return null;
  const absolute = url.startsWith("/") ? (origin ? origin + url : null) : url;
  if (!absolute?.startsWith("http")) return null;
  try {
    const res = await fetch(absolute, { signal: AbortSignal.timeout(4000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/image\/(jpeg|png|webp)/.test(type)) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length > 4 * 1024 * 1024) return null;
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Imagen de una campaña para compartir: horizontal (vista previa del enlace)
 * o vertical (estados de WhatsApp e historias).
 */
export async function campaignShareImage(
  c: CampaignWithShelter,
  { width, height, origin }: { width: number; height: number; origin?: string },
) {
  const vertical = height > width;
  const photo = await photoData(campaignImage(c), origin);
  const pct = campaignProgress(c.current_amount, c.goal_amount);
  const name = c.animal?.name;
  const detail =
    c.kind === "event" && c.event_at
      ? `${eventDateLabel(c.event_at)}${c.event_place ? `, ${c.event_place}` : ""}`
      : c.current_amount > 0
        ? `${formatPEN(c.current_amount)} de ${formatPEN(c.goal_amount)}`
        : `Meta: ${formatPEN(c.goal_amount)}`;
  const scale = vertical ? 1.5 : 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          background: "#f6f7f2",
          color: "#1e2b25",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: vertical ? "100%" : "48%",
            height: vertical ? "52%" : "100%",
            background: "#fbe4e7",
          }}
        >
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element -- Satori solo entiende <img>
            <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          {name && (
            <div
              style={{
                position: "absolute",
                left: 40 * scale,
                bottom: 40 * scale,
                display: "flex",
                alignItems: "center",
                gap: 14 * scale,
                background: "#f2c14e",
                borderRadius: 999,
                padding: `${12 * scale}px ${34 * scale}px ${12 * scale}px ${18 * scale}px`,
                boxShadow: `0 ${5 * scale}px 0 #c99a2e`,
                fontSize: 48 * scale,
                fontWeight: 700,
              }}
            >
              <div style={{ width: 16 * scale, height: 16 * scale, borderRadius: 999, background: "#ffffff" }} />
              {name}
            </div>
          )}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22 * scale,
            padding: 56 * scale,
          }}
        >
          <div style={{ display: "flex", fontSize: 24 * scale, fontWeight: 700, color: "#2f6b54" }}>
            {`${CAMPAIGN_KIND_LABEL[c.kind]} de ${c.shelter.name}`}
          </div>
          <div style={{ display: "flex", fontSize: 50 * scale, fontWeight: 700, lineHeight: 1.1 }}>
            {c.title.length > 80 ? c.title.slice(0, 78) + "…" : c.title}
          </div>
          {c.kind !== "event" && (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: 22 * scale,
                borderRadius: 999,
                background: "#e3ecdf",
                border: "2px solid #c9d3c4",
              }}
            >
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "#b8324b" }} />
            </div>
          )}
          <div style={{ display: "flex", fontSize: 28 * scale, color: "#55625b" }}>{detail}</div>
          <div
            style={{
              display: "flex",
              marginTop: 10 * scale,
              fontSize: 28 * scale,
              fontWeight: 700,
              color: "#b8324b",
            }}
          >
            Apóyala o compártela en HUELLAS
          </div>
        </div>
      </div>
    ),
    { width, height },
  );
}
