import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, providerUsage } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function AdminAnalyticsPage() {
  const db = await readDb();
  const usage = providerUsage(db.analytics);
  return (
    <>
      <AdminNav />
      <PageHeader title="Analytics" description="Generation, export, login, provider, and template activity." />
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(usage).map(([provider, count]) => <Card key={provider}><CardContent><p className="text-sm capitalize text-slate-500">{provider}</p><p className="mt-2 text-3xl font-semibold">{count}</p></CardContent></Card>)}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900"><tr><th className="px-5 py-3">Event</th><th className="px-5 py-3">Provider</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Date</th></tr></thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {db.analytics.slice().reverse().map((event) => <tr key={event.id}><td className="px-5 py-4 capitalize">{event.type.replace("_", " ")}</td><td className="px-5 py-4 capitalize">{event.provider || "n/a"}</td><td className="px-5 py-4">{db.users.find((user) => user.id === event.userId)?.email || "System"}</td><td className="px-5 py-4">{formatDate(event.createdAt)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
}
