import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  return (
    <AuthCard
      title="Create your account"
      description="Start building a reusable legal document library for your products and clients."
      footer={
        <>
          Already registered? <Link className="font-semibold text-blue-700" href="/login">Sign in</Link>
        </>
      }
    >
      <AuthForm mode="register" action={registerAction} referralCode={params.ref} />
    </AuthCard>
  );
}
