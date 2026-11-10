import { requireActor } from "@/lib/huellas/auth";
import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { ActionButton } from "@/components/huellas/Forms";
import type { Shelter } from "@/types";
export default async function Page() {
  await requireActor(["admin"]);
  const shelters: Shelter[] = isDemo()
    ? (await readDemo()).shelters
    : ((await (await createClient()).from("shelters").select("*")).data ?? []);
  return (
    <div className="max-w-5xl mx-auto px-5 py-12 space-y-6">
      <p className="uppercase tracking-widest text-xs text-emerald-700">
        Administración HUELLAS
      </p>
      <h1 className="text-3xl font-bold">Una red en la que confiar.</h1>
      <p className="text-muted-foreground">
        Verifica la identidad y documentación de cada albergue antes de
        publicarlo.
      </p>
      {shelters.map((s) => (
        <article
          className="rounded-2xl border bg-card p-5 flex flex-wrap items-center justify-between gap-4"
          key={s.id}
        >
          <div>
            <h2 className="font-bold">{s.name}</h2>
            <p className="text-sm text-muted-foreground">
              {s.is_verified ? "Verificado" : "Pendiente de verificación"}
            </p>
          </div>
          <ActionButton
            payload={{
              action: "verify",
              shelter_id: s.id,
              verified: !s.is_verified,
            }}
          >
            {s.is_verified ? "Retirar verificación" : "Verificar albergue"}
          </ActionButton>
        </article>
      ))}
    </div>
  );
}
