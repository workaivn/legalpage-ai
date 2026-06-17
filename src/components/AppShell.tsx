import { BarChart3, CreditCard, FileText, LayoutDashboard, Library, LogOut, Settings, Shield, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { User } from "@/lib/types";

const nav: Array<{ href: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/generator", label: "Generator", icon: Sparkles },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/templates", label: "Templates", icon: Library },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/white-label", label: "White Label", icon: Shield },
  { href: "/dashboard/affiliate", label: "Affiliate", icon: Sparkles },
  { href: "/admin/ai-settings", label: "AI Settings", icon: Settings, adminOnly: true },
];

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  const visibleNav = nav.filter((item) => !item.adminOnly || user.role === "admin");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <Shield className="h-5 w-5" />
          </span>
          LegalPage AI
        </Link>
        <nav className="mt-8 grid gap-1">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {user.role === "admin" ? (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold">
              LegalPage AI
            </Link>
            <form action={logoutAction}>
              <button className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sign out</button>
            </form>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {visibleNav.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
