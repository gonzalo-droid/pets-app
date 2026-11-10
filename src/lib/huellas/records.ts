import { isDemo } from "./config";
import { readDemo } from "./demo";
import { createClient } from "@/lib/supabase/server";
export async function records(
  table: "needs" | "support_intents" | "adoption_requests",
  shelterId?: string,
  donorId?: string,
) {
  if (isDemo()) {
    const d = await readDemo();
    const rows =
      table === "needs"
        ? d.needs
        : table === "support_intents"
          ? d.support
          : d.requests;
    return rows.filter(
      (r) =>
        (!shelterId || r.shelter_id === shelterId) &&
        (!donorId ||
          ("donor_id" in r
            ? r.donor_id === donorId
            : "requester_id" in r && r.requester_id === donorId)),
    );
  }
  const db = await createClient();
  let q = db.from(table).select("*").order("created_at", { ascending: false });
  if (shelterId) q = q.eq("shelter_id", shelterId);
  if (donorId)
    q = q.eq(
      table === "adoption_requests" ? "requester_id" : "donor_id",
      donorId,
    );
  const { data, error } = await q;
  if (error)
    throw new Error(
      "No se pudieron cargar los registros. Revisa las migraciones.",
    );
  return data ?? [];
}
