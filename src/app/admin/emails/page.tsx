import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function EmailsPage() {
  const db = await readDb();
  return (
    <>
      <AdminNav />
      <PageHeader title="Email System" description="Welcome, trial ending, subscription success, payment failed, and password reset email logs." />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900"><tr><th className="px-5 py-3">Type</th><th>To</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{db.emailLogs.map((email) => <tr key={email.id}><td className="px-5 py-4">{email.type}</td><td>{email.to}</td><td>{email.subject}</td><td>{email.status}</td><td>{formatDate(email.createdAt)}</td></tr>)}</tbody></table>
      </div>
    </>
  );
}
