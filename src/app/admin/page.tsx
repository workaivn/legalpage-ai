import { BarChart3, Bot, FileText, Users } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { mostUsedTemplate, providerUsage } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function AdminDashboardPage() {
  const db = await readDb();
  const usage = providerUsage(db.analytics);
  const metrics = [
    { label: "Total users", value: db.users.length, icon: Users },
    { label: "Total generations", value: db.analytics.filter((event) => event.type === "generation").length, icon: FileText },
    { label: "Most used template", value: mostUsedTemplate(db.analytics, db.templates), icon: BarChart3 },
    { label: "Active provider", value: db.settings.activeProvider, icon: Bot },
  ];

  return (
    <>
      <AdminNav />
      <PageHeader title="Admin Dashboard" description="Monitor product usage, providers, templates, users, and generated documents." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <metric.icon className="h-5 w-5 text-blue-700" />
              <p className="mt-4 text-sm text-slate-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold capitalize">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardContent>
          <h2 className="font-semibold">Provider usage</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Object.entries(usage).map(([provider, count]) => (
              <div key={provider} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm capitalize text-slate-500">{provider}</p>
                <p className="mt-2 text-2xl font-semibold">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
