import { createReferralAction } from "@/app/actions/affiliate";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth";
import { centsToCurrency } from "@/lib/plans";
import { readDb } from "@/lib/store";

export default async function AffiliatePage() {
  const user = await requireUser();
  const db = await readDb();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${baseUrl}/register?ref=${user.referralCode || user.id}`;
  const referrals = db.referrals.filter((referral) => referral.referrerUserId === user.id);
  const earnings = referrals.reduce((sum, referral) => sum + referral.commissionAmount, 0);
  return (
    <>
      <PageHeader title="Affiliate Dashboard" description="Share LegalPage AI, track referrals, and monitor commission earnings." />
      <div className="grid gap-4 lg:grid-cols-3"><Card><CardContent><p className="text-sm text-slate-500">Referral link</p><p className="mt-2 break-all text-sm font-semibold">{link}</p></CardContent></Card><Card><CardContent><p className="text-sm text-slate-500">Referrals</p><p className="mt-2 text-3xl font-semibold">{referrals.length}</p></CardContent></Card><Card><CardContent><p className="text-sm text-slate-500">Earnings</p><p className="mt-2 text-3xl font-semibold">{centsToCurrency(earnings)}</p></CardContent></Card></div>
      <form action={createReferralAction} className="mt-5 flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><input name="email" placeholder="Invite by email" className="h-10 flex-1 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" /><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Track referral</button></form>
      <Card className="mt-5"><CardContent><h2 className="font-semibold">Referral history</h2><div className="mt-4 space-y-2">{referrals.map((referral) => <div key={referral.id} className="flex justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><span>{referral.email || referral.referredUserId} · {referral.status}</span><strong>{centsToCurrency(referral.commissionAmount)}</strong></div>)}</div></CardContent></Card>
    </>
  );
}
