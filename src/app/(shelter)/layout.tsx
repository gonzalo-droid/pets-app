import Link from "next/link";
import ShelterSidebar from "@/components/layout/ShelterSidebar";
import ShelterBottomNav from "@/components/layout/ShelterBottomNav";
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
          <Link className="inline-flex min-h-11 items-center text-sm font-bold text-primary hover:underline" href={shelter ? `/shelters/${shelter.id}` : "/"}>
            Ver perfil público
          </Link>
        </header>
        <main className="p-4 pb-28 sm:p-5 md:p-8 lg:pb-8">{children}</main>
        <ShelterBottomNav />
      </div>
    </div>
  );
}
