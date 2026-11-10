import { notFound } from "next/navigation";
import { getAnimalBySlug } from "@/lib/data/animals";
import { SupportForm } from "@/components/huellas/Forms";
import LoginRequired from "@/components/huellas/LoginRequired";
import { currentActor } from "@/lib/huellas/auth";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [a, actor] = await Promise.all([getAnimalBySlug(slug), currentActor()]);
  if (!a || a.status === "adopted") notFound();
  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <a className="text-sm font-bold text-primary hover:underline" href={"/adopt/" + slug}>
        ← Conocer a {a.name}
      </a>
      <div className="mt-6">
        {actor ? (
          <SupportForm
            kind="sponsorship"
            slug={slug}
            title={"Sé parte de la historia de " + a.name}
          />
        ) : (
          <LoginRequired returnTo={`/sponsor/${slug}`} action={`apadrinar a ${a.name}`} />
        )}
      </div>
    </div>
  );
}
