import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function AdminUsersPage() {
  const db = await readDb();

  return (
    <>
      <AdminNav />
      <PageHeader title="Users" description="Demo and registered users available in the local application store." />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Created</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {db.users.map((user) => (
              <tr key={user.id}><td className="px-5 py-4 font-medium">{user.name}</td><td className="px-5 py-4">{user.email}</td><td className="px-5 py-4 capitalize">{user.role}</td><td className="px-5 py-4">{formatDate(user.createdAt)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
