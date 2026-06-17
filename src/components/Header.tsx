import { Scale } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </span>
          LegalPage AI
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 sm:flex">
          <Link className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href="/#generator">
            Generator
          </Link>
          <Link className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href="/templates">
            Templates
          </Link>
          <Link className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href="/#pricing">
            Pricing
          </Link>
          <Link className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href="/#faq">
            FAQ
          </Link>
          <Link className="rounded-lg bg-slate-950 px-4 py-2 text-white dark:bg-white dark:text-slate-950" href="/login">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
