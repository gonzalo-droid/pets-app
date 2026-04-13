import ShelterSidebar from '@/components/layout/ShelterSidebar'

export default function ShelterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <ShelterSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
