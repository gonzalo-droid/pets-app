import { shelterContext } from "@/lib/huellas/auth";
import { getShelterById } from "@/lib/data/shelters";
import { ManageForm } from "@/components/huellas/Forms";
export default async function Page() {
  const id = await shelterContext(),
    s = await getShelterById(id);
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Perfil del albergue</h1>
      <ManageForm
        action="settings"
        shelterId={id}
        title="Presentación pública"
        fields={[
          { name: "name", label: "Nombre", value: s?.name },
          {
            name: "description",
            label: "Descripción",
            value: s?.description ?? "",
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        La verificación solo puede modificarla la administración de HUELLAS.
      </p>
    </div>
  );
}
