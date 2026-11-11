import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { MOCK_ANIMALS } from "@/lib/mock/animals";
import { MOCK_SHELTERS, MOCK_SHELTER_PHOTOS } from "@/lib/mock/shelters";
import { MOCK_CAMPAIGNS } from "@/lib/mock/campaigns";
import { MOCK_LOST_REPORTS } from "@/lib/mock/lost-reports";
import type {
  AnimalWithPhotos,
  Shelter,
  CampaignWithShelter,
  ShelterPhoto,
  LostReportWithSightings,
} from "@/types";
import { isDemo } from "./config";
export type Support = {
  id: string;
  donor_id: string;
  shelter_id: string;
  campaign_id: string | null;
  animal_id: string | null;
  amount: number;
  kind: "donation" | "sponsorship";
  status: "pending" | "cancelled";
  created_at: string;
  idempotency_key: string;
};
export type Need = {
  id: string;
  shelter_id: string;
  title: string;
  description: string;
  quantity: string;
  fulfilled: boolean;
};
export type RequestRecord = {
  id: string;
  shelter_id: string;
  animal_id: string;
  requester_id: string;
  message: string;
  phone: string;
  status: string;
  has_home: boolean;
  has_other_pets: boolean;
  has_children: boolean;
  created_at: string;
};
export type DemoData = {
  animals: AnimalWithPhotos[];
  shelters: Shelter[];
  photos: ShelterPhoto[];
  campaigns: CampaignWithShelter[];
  reports: LostReportWithSightings[];
  support: Support[];
  needs: Need[];
  requests: RequestRecord[];
  /** Cambios que cada perfil demo hizo en "Mi perfil". */
  profiles?: Record<
    string,
    { full_name: string; phone: string | null; role?: "shelter"; shelter_id?: string }
  >;
};
const directory = path.join(process.cwd(), ".huellas-demo");
const file = path.join(directory, "data.json");
export async function readDemo(): Promise<DemoData> {
  if (!isDemo()) throw new Error("Demo desactivada");
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    return structuredClone({
      animals: MOCK_ANIMALS,
      shelters: MOCK_SHELTERS.map((s) => ({
        ...s,
        yape_number: null,
        bank_account: null,
        bank_name: null,
        account_holder: null,
        phone: null,
        whatsapp: null,
        email: null,
      })),
      photos: MOCK_SHELTER_PHOTOS,
      campaigns: MOCK_CAMPAIGNS.map((c) => ({
        ...c,
        current_amount: 0,
        ends_at: null,
      })),
      reports: MOCK_LOST_REPORTS,
      support: [],
      requests: [],
      needs: [
        {
          id: "need-001",
          shelter_id: "shelter-001",
          title: "Alimento para nuestros rescatados",
          description:
            "Alimento seco para perros adultos. Coordina la entrega con el albergue.",
          quantity: "10 sacos de 15 kg",
          fulfilled: false,
        },
      ],
    });
  }
}
// Serializa mutaciones en un único proceso local. No es un almacén de producción.
const state = globalThis as typeof globalThis & {
  huellasQueue?: Promise<unknown>;
};
export async function mutateDemo<T>(fn: (data: DemoData) => T): Promise<T> {
  const job = (state.huellasQueue ?? Promise.resolve())
    .catch(() => {})
    .then(async () => {
      const data = await readDemo();
      const result = fn(data);
      await mkdir(directory, { recursive: true });
      const tmp = file + ".tmp";
      await writeFile(tmp, JSON.stringify(data, null, 2));
      await rename(tmp, file);
      return result;
    });
  state.huellasQueue = job;
  return job;
}
