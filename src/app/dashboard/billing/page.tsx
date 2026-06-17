import { cancelSubscriptionAction, changePlanAction, checkoutAction } from "@/app/actions/billing";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth";
import { centsToCurrency, getActiveSubscription, plans } from "@/lib/plans";
import { formatDate } from "@/lib/stats";
import { readDb } from "@/lib/store";

export default async function BillingPage() {
  const user = await requireUser();
  const db = await readDb();
  const subscription = getActiveSubscription(user, db.subscriptions);
  const currentPlan = plans[subscription?.planId || "free"];
  const invoices = db.invoices.filter((invoice) => invoice.userId === user.id);

  return (
    <>
      <PageHeader title="Billing" description="Upgrade, downgrade, cancel, and review billing history." />
      <div className="grid gap-5 lg:grid-cols-3">
        {Object.values(plans).map((plan) => (
          <Card key={plan.id} className={plan.id === currentPlan.id ? "ring-2 ring-blue-500" : ""}>
            <CardContent>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-3 text-3xl font-semibold">{centsToCurrency(plan.priceMonthly)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>{plan.generationsPerMonth === "unlimited" ? "Unlimited generations" : `${plan.generationsPerMonth} generations/month`}</li>
                <li>{plan.pdfExport ? "PDF export included" : "Markdown and HTML export"}</li>
                <li>{plan.watermarkExports ? "Watermark on exports" : "No export watermark"}</li>
                <li>{plan.teamWorkspace ? "Team workspace and white label" : "Single workspace"}</li>
              </ul>
              {plan.id === currentPlan.id ? (
                <form action={cancelSubscriptionAction}><button className="mt-6 w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">Cancel subscription</button></form>
              ) : plan.id === "free" ? (
                <form action={changePlanAction}><input type="hidden" name="planId" value="free" /><button className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold">Downgrade</button></form>
              ) : (
                <form action={checkoutAction} className="mt-6 grid gap-2">
                  <input type="hidden" name="planId" value={plan.id} />
                  <select name="provider" defaultValue={db.billingSettings.defaultProvider} className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="stripe">Stripe</option><option value="lemonsqueezy">LemonSqueezy</option></select>
                  <input name="couponCode" placeholder="Coupon code" className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Upgrade to {plan.name}</button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardContent>
          <h2 className="font-semibold">Billing history</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Invoice</th><th>Provider</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{invoices.map((invoice) => <tr key={invoice.id}><td className="py-3 font-medium">{invoice.id}</td><td className="capitalize">{invoice.provider}</td><td>{centsToCurrency(invoice.amount, invoice.currency)}</td><td className="capitalize">{invoice.status}</td><td>{formatDate(invoice.createdAt)}</td></tr>)}</tbody></table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
