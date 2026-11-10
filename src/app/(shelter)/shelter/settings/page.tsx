import type { Metadata } from "next";
import { shelterContext } from "@/lib/huellas/auth";
import { getShelterById } from "@/lib/data/shelters";
import { ManageForm } from "@/components/huellas/Forms";
import ShelterImages from "@/components/huellas/ShelterImages";

export const metadata: Metadata = { title: "Perfil del albergue — Panel" };

export default async function Page() {
  const id = await shelterContext();
  const s = await getShelterById(id);
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl">Perfil del albergue</h1>
        <p className="mt-2 text-muted-foreground">
          Es lo que la comunidad ve en tu página pública. Publica solo los medios de contacto que
          quieras compartir.
        </p>
      </div>
      <ShelterImages
        shelterId={id}
        avatarUrl={s?.avatar_url ?? null}
        bannerUrl={s?.banner_url ?? null}
      />
      <ManageForm
        action="settings"
        shelterId={id}
        title="Presentación y contacto"
        submitLabel="Guardar cambios"
        resetOnSave={false}
        fields={[
          { name: "name", label: "Nombre del albergue", value: s?.name },
          {
            name: "description",
            label: "Descripción breve",
            value: s?.description ?? "",
            hint: "Aparece en las tarjetas del directorio (mínimo 10 caracteres).",
          },
          {
            name: "long_description",
            label: "Historia del albergue",
            value: s?.long_description ?? "",
            multiline: true,
            optional: true,
            hint: "Cuéntale a la comunidad cómo empezaron y cómo trabajan.",
          },
          { name: "address", label: "Dirección o zona", value: s?.address ?? "", optional: true, hint: "Puede ser una referencia general si prefieres no publicar la dirección exacta." },
          { name: "whatsapp", label: "WhatsApp", type: "tel", value: s?.whatsapp ?? "", optional: true, hint: "Solo números, sin +51." },
          { name: "phone", label: "Teléfono", type: "tel", value: s?.phone ?? "", optional: true },
          { name: "email", label: "Correo", type: "email", value: s?.email ?? "", optional: true },
          { name: "instagram", label: "Instagram", value: s?.instagram ?? "", optional: true, hint: "Tu usuario, sin @." },
          { name: "facebook", label: "Facebook", value: s?.facebook ?? "", optional: true },
          { name: "tiktok", label: "TikTok", value: s?.tiktok ?? "", optional: true },
        ]}
      />
      <p className="rounded-2xl bg-secondary px-4 py-3 text-sm">
        La verificación solo puede modificarla la administración de HUELLAS.{" "}
        <a className="font-extrabold text-primary hover:underline" href={`/shelters/${id}`}>
          Ver mi página pública
        </a>
      </p>
    </div>
  );
}
