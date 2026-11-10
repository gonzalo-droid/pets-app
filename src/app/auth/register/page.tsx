import AuthForm from "@/components/huellas/AuthForm";
import { isDemo } from "@/lib/huellas/config";
export default function Page() {
  return <AuthForm demo={isDemo()} register={true} />;
}
