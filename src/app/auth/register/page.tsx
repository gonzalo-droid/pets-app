import AuthForm from "@/components/huellas/AuthForm";
import { isDemo } from "@/lib/huellas/config";
import { safeRedirect } from "@/lib/huellas/domain";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  // Solo rutas internas: evita redirecciones abiertas a otros sitios.
  const redirectTo = redirect ? safeRedirect(redirect, "") || undefined : undefined;
  return <AuthForm demo={isDemo()} register={true} redirectTo={redirectTo} />;
}
