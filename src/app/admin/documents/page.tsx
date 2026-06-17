import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { ProviderBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function AdminDocumentsPage() {
  const db = await readDb();
  return (
    <>
      <AdminNav />
      <PageHeader title="All Documents" description="Admin visibility into generated and demo legal documents." />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
            <tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Owner</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Provider</th><th className="px-5 py-3">Updated</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {db.documents.map((document) => {
              const owner = db.users.find((user) => user.id === document.userId);
              return <tr key={document.id}><td className="px-5 py-4 font-medium">{document.title}</td><td className="px-5 py-4">{owner?.email || "Unknown"}</td><td className="px-5 py-4"><StatusBadge status={document.status} /></td><td className="px-5 py-4"><ProviderBadge provider={document.provider} /></td><td className="px-5 py-4">{formatDate(document.updatedAt)}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
