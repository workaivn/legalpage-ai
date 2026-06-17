import { Shield } from "lucide-react";
import Link from "next/link";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 flex items-center gap-3 text-sm font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <Shield className="h-5 w-5" />
          </span>
          LegalPage AI
        </Link>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
          {children}
          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            {footer}
          </div>
        </section>
      </div>
    </main>
  );
}
