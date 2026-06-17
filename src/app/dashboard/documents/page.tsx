import { Copy, Edit3, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteDocumentAction, duplicateDocumentAction } from "@/app/actions/documents";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProviderBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatDate, visibleDocumentsForUser } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const db = await readDb();
  const query = (params.q || "").toLowerCase();
  const status = params.status || "";
  const documents = visibleDocumentsForUser(db.documents, user).filter((document) => {
    const matchesQuery = !query || `${document.title} ${document.type} ${document.projectName}`.toLowerCase().includes(query);
    const matchesStatus = !status || document.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <>
      <PageHeader
        title="Documents"
        description="Search, filter, edit, duplicate, delete, and export saved legal page drafts."
        action={<Link href="/dashboard/generator" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">New document</Link>}
      />
      <form className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[1fr_200px_auto]">
        <input name="q" defaultValue={params.q || ""} placeholder="Search documents..." className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        <select name="status" defaultValue={status} className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900">
          <option value="">All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Filter</button>
      </form>
      {documents.length ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Updated</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="px-5 py-4 font-medium text-slate-950 dark:text-white">{document.title}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{document.type}</td>
                    <td className="px-5 py-4"><StatusBadge status={document.status} /></td>
                    <td className="px-5 py-4"><ProviderBadge provider={document.provider} /></td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{formatDate(document.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/documents/${document.id}`} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" title="Edit"><Edit3 className="h-4 w-4" /></Link>
                        <form action={duplicateDocumentAction}><input type="hidden" name="id" value={document.id} /><button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" title="Duplicate"><Copy className="h-4 w-4" /></button></form>
                        <form action={deleteDocumentAction}><input type="hidden" name="id" value={document.id} /><button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950" title="Delete"><Trash2 className="h-4 w-4" /></button></form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={FileText} title="No documents found" description="Adjust your filters or generate a fresh legal page draft." action={<Link href="/dashboard/generator" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Generate document</Link>} />
      )}
    </>
  );
}
