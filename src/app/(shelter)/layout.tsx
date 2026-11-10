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
        <header className="border-b px-5 py-4 flex flex-wrap justify-between gap-3">
          <span className="font-bold">
            HUELLAS{" "}
            <span className="text-muted-foreground font-normal">
              / {shelter?.name}
            </span>
          </span>
          <Link href="/">Ver comunidad ↗</Link>
          <nav className="lg:hidden flex w-full gap-4 overflow-x-auto text-sm pb-2">
            {[
              ["dashboard", "Resumen"],
              ["animals", "Animales"],
              ["campaigns", "Campañas"],
              ["needs", "Necesidades"],
              ["donations", "Apoyos"],
              ["requests", "Adopciones"],
              ["settings", "Ajustes"],
            ].map(([path, label]) => (
              <Link className="shrink-0" key={path} href={"/shelter/" + path}>
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
