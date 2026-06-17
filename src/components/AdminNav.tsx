import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/ai-settings", label: "AI Settings" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/monetization", label: "Monetization" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/audit", label: "Audit Logs" },
];

export function AdminNav() {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
