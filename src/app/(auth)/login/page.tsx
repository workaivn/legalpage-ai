import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to generate, save, edit, export, and manage your legal page library."
      footer={
        <>
          No account? <Link className="font-semibold text-blue-700" href="/register">Create one</Link>
          <span className="mx-2">·</span>
          <Link className="font-semibold text-blue-700" href="/forgot-password">Forgot password?</Link>
        </>
      }
    >
      <AuthForm mode="login" action={loginAction} />
      <p className="mt-4 rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-400">
        Demo user: demo@legalpage.ai / password123. Admin: admin@legalpage.ai / password123.
      </p>
    </AuthCard>
  );
}
