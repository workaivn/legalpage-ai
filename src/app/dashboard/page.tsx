import { FileText, Library, Sparkles, Timer } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { ProviderBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatDate, thisMonthCount, visibleDocumentsForUser } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function DashboardPage() {
  const user = await requireUser();
  const db = await readDb();
  const documents = visibleDocumentsForUser(db.documents, user);
  const userEvents = db.analytics.filter((event) => event.userId === user.id && event.type === "generation");
  const lastGenerated = documents[0]?.updatedAt;

  const cards = [
    { label: "Total Documents", value: documents.length, icon: FileText },
    { label: "This Month Generations", value: thisMonthCount(userEvents), icon: Sparkles },
    { label: "Last Generated", value: formatDate(lastGenerated), icon: Timer },
    { label: "Templates", value: db.templates.length, icon: Library },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track legal page generation, manage drafts, and launch from proven templates."
        action={<Link href="/dashboard/generator" className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white">New document</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{card.value}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  <card.icon className="h-5 w-5" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-semibold">Recent Documents</h2>
            <p className="mt-1 text-sm text-slate-500">Latest saved generations and edits.</p>
          </div>
          <Link href="/dashboard/documents" className="text-sm font-semibold text-blue-700">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Provider</th>
                <th className="px-5 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {documents.slice(0, 6).map((document) => (
                <tr key={document.id}>
                  <td className="px-5 py-4 font-medium text-slate-950 dark:text-white">{document.title}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{document.type}</td>
                  <td className="px-5 py-4"><StatusBadge status={document.status} /></td>
                  <td className="px-5 py-4"><ProviderBadge provider={document.provider} /></td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{formatDate(document.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
