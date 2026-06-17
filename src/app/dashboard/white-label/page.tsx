import { updateWhiteLabelAction } from "@/app/actions/white-label";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";
import { readDb } from "@/lib/store";

export default async function WhiteLabelPage() {
  const user = await requireUser();
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  const settings = db.whiteLabels.find((item) => item.userId === user.id);
  return (
    <>
      <PageHeader title="White Label" description="Agency customers can customize logo, company name, colors, and remove LegalPage AI branding." />
      <Card><CardContent>{!plan.whiteLabel ? <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">White label mode requires Agency.</p> : null}<form action={updateWhiteLabelAction} className="grid gap-4"><input name="companyName" defaultValue={settings?.companyName || ""} placeholder="Company name" className="h-11 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" /><input name="logoUrl" defaultValue={settings?.logoUrl || ""} placeholder="Logo URL" className="h-11 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" /><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Primary color<input name="primaryColor" type="color" defaultValue={settings?.primaryColor || "#2563eb"} className="mt-2 h-11 w-full rounded-lg" /></label><label className="text-sm">Accent color<input name="accentColor" type="color" defaultValue={settings?.accentColor || "#7c3aed"} className="mt-2 h-11 w-full rounded-lg" /></label></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="removeBranding" defaultChecked={settings?.removeBranding} /> Remove LegalPage AI branding</label><button className="w-fit rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Save white label</button></form></CardContent></Card>
    </>
  );
}
