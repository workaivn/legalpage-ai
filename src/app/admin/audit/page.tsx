import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function AuditPage() {
  const db = await readDb();
  return (
    <>
      <AdminNav />
      <PageHeader title="Audit Logs" description="Security-relevant actions across billing, exports, subscriptions, and settings." />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900"><tr><th className="px-5 py-3">Action</th><th>User</th><th>Target</th><th>Date</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{db.auditLogs.map((log) => <tr key={log.id}><td className="px-5 py-4 font-medium">{log.action}</td><td>{db.users.find((user) => user.id === log.userId)?.email || "System"}</td><td>{log.targetType}{log.targetId ? `:${log.targetId}` : ""}</td><td>{formatDate(log.createdAt)}</td></tr>)}</tbody></table>
      </div>
    </>
  );
}
