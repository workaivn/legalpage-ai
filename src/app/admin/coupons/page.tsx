import { createCouponAction, toggleCouponAction } from "@/app/actions/coupons";
import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { readDb } from "@/lib/store";

export default async function CouponsPage() {
  const db = await readDb();
  return (
    <>
      <AdminNav />
      <PageHeader title="Coupons" description="Create percentage and fixed discounts with expiration dates and usage limits." />
      <form action={createCouponAction} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:grid-cols-6">
        <input name="code" placeholder="CODE" className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        <select name="type" className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="percentage">Percentage</option><option value="fixed">Fixed cents</option></select>
        <input name="amount" type="number" placeholder="Amount" className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        <input name="expiresAt" type="date" className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        <input name="usageLimit" type="number" placeholder="Usage limit" className="h-10 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Create</button>
      </form>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900"><tr><th className="px-5 py-3">Code</th><th>Type</th><th>Amount</th><th>Used</th><th>Expires</th><th>Status</th><th></th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{db.coupons.map((coupon) => <tr key={coupon.id}><td className="px-5 py-4 font-semibold">{coupon.code}</td><td>{coupon.type}</td><td>{coupon.amount}</td><td>{coupon.usedCount}/{coupon.usageLimit || "∞"}</td><td>{coupon.expiresAt || "Never"}</td><td>{coupon.active ? "Active" : "Inactive"}</td><td><form action={toggleCouponAction}><input type="hidden" name="id" value={coupon.id} /><button className="text-blue-700">Toggle</button></form></td></tr>)}</tbody></table>
      </div>
    </>
  );
}
