import { BarChart3, Bot, Download, Gauge, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth";
import { getUsageSummary } from "@/lib/usage";

export default async function UsagePage() {
  const user = await requireUser();
  const usage = await getUsageSummary(user);
  const cards = [
    { label: "Plan", value: usage.plan.name, icon: Gauge },
    { label: "Generations used", value: usage.generationCount, icon: Sparkles },
    { label: "Remaining quota", value: usage.remainingGenerations, icon: BarChart3 },
    { label: "Credit balance", value: usage.creditBalance, icon: Download },
  ];

  return (
    <>
      <PageHeader title="Usage & Credits" description="Track monthly quota, remaining credits, exports, and AI provider usage." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}><CardContent><card.icon className="h-5 w-5 text-blue-700" /><p className="mt-4 text-sm text-slate-500">{card.label}</p><p className="mt-2 text-2xl font-semibold capitalize">{card.value}</p></CardContent></Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><CardContent><h2 className="font-semibold">Export count</h2><p className="mt-3 text-4xl font-semibold">{usage.exportCount}</p><p className="mt-2 text-sm text-slate-500">Markdown, HTML, and PDF exports tracked through the export API.</p></CardContent></Card>
        <Card><CardContent><h2 className="flex items-center gap-2 font-semibold"><Bot className="h-5 w-5 text-blue-700" /> Provider usage</h2><div className="mt-4 grid gap-3">{Object.entries(usage.providerUsage).map(([provider, count]) => <div key={provider} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><span className="capitalize">{provider}</span><strong>{count}</strong></div>)}</div></CardContent></Card>
      </div>
    </>
  );
}
