import { notFound } from "next/navigation";
import { getAnimalBySlug } from "@/lib/data/animals";
import { SupportForm } from "@/components/huellas/Forms";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getAnimalBySlug(slug);
  if (!a || a.status === "adopted") notFound();
  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <a className="text-sm underline" href={"/adopt/" + slug}>
        ← Conocer a {a.name}
      </a>
      <div className="mt-6">
        <SupportForm
          kind="sponsorship"
          slug={slug}
          title={"Sé parte de la historia de " + a.name}
        />
      </div>
    </div>
  );
}
