import { updateCommissionRateAction } from "@/app/actions/affiliate";
import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { centsToCurrency } from "@/lib/plans";
import { revenueMetrics } from "@/lib/revenue";
import { readDb } from "@/lib/store";

export default async function MonetizationPage() {
  const db = await readDb();
  const metrics = revenueMetrics(db);
  return (
    <>
      <AdminNav />
      <PageHeader title="Monetization" description="Revenue, subscriptions, churn, conversion, affiliate commission, and top template metrics." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="MRR" value={centsToCurrency(metrics.mrr)} />
        <Metric label="ARR" value={centsToCurrency(metrics.arr)} />
        <Metric label="Active subscriptions" value={metrics.activeSubscriptions} />
        <Metric label="Churn rate" value={`${metrics.churnRate}%`} />
        <Metric label="Conversion rate" value={`${metrics.conversionRate}%`} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><CardContent><h2 className="font-semibold">Revenue by month</h2><div className="mt-4 space-y-2">{Object.entries(metrics.revenueByMonth).map(([month, amount]) => <div key={month} className="flex justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><span>{month}</span><strong>{centsToCurrency(amount)}</strong></div>)}</div></CardContent></Card>
        <Card><CardContent><h2 className="font-semibold">Affiliate commission</h2><form action={updateCommissionRateAction} className="mt-4 flex gap-3"><input name="commissionRate" type="number" defaultValue={db.billingSettings.commissionRate} className="h-10 flex-1 rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900" /><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Save</button></form></CardContent></Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return <Card><CardContent><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>;
}
