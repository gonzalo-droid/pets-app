import Link from "next/link";
import ShelterSidebar from "@/components/layout/ShelterSidebar";
import { requireActor, shelterContext } from "@/lib/huellas/auth";
import { getShelterById } from "@/lib/data/shelters";
export default async function ShelterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActor(["shelter", "admin"]);
  const shelter = await getShelterById(await shelterContext());
  return (
    <div className="flex min-h-screen">
      <ShelterSidebar />
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground">Panel del albergue</p>
            <p className="font-display text-xl font-semibold">{shelter?.name}</p>
          </div>
          <Link className="text-sm font-bold text-primary hover:underline" href="/">
            Ver comunidad
          </Link>
          <nav aria-label="Panel del albergue" className="lg:hidden flex w-full gap-2 overflow-x-auto text-sm pb-1">
            {[
              ["dashboard", "Resumen"],
              ["campaigns", "Campañas"],
              ["animals", "Animales"],
              ["needs", "Necesidades"],
              ["donations", "Apoyos"],
              ["requests", "Adopciones"],
              ["settings", "Perfil"],
            ].map(([path, label]) => (
              <Link
                className="shrink-0 rounded-full bg-secondary px-4 py-2 font-bold text-secondary-foreground"
                key={path}
                href={"/shelter/" + path}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
