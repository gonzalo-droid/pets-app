import { shelterContext } from "@/lib/huellas/auth";
import { getShelterById } from "@/lib/data/shelters";
import { ManageForm } from "@/components/huellas/Forms";
export default async function Page() {
  const id = await shelterContext(),
    s = await getShelterById(id);
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl">Perfil del albergue</h1>
        <p className="mt-2 text-muted-foreground">
          Es lo que la comunidad ve en tu página pública.
        </p>
      </div>
      <ManageForm
        action="settings"
        shelterId={id}
        title="Presentación pública"
        submitLabel="Guardar cambios"
        fields={[
          { name: "name", label: "Nombre", value: s?.name },
          {
            name: "description",
            label: "Descripción",
            value: s?.description ?? "",
          },
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
