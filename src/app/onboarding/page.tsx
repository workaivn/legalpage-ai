import { completeOnboardingAction } from "@/app/actions/onboarding";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/auth";
import { businessTypes, providerTypes } from "@/lib/types";
import { readDb } from "@/lib/store";

export default async function OnboardingPage() {
  await requireUser();
  const db = await readDb();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <PageHeader title="Set up your workspace" description="Personalize LegalPage AI for your business before generating documents." />
        <form action={completeOnboardingAction} className="grid gap-4">
          <label className="text-sm font-medium">Business type<select name="businessType" className="mt-2 h-11 w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-950">{businessTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-sm font-medium">Country<input name="country" defaultValue="United States" className="mt-2 h-11 w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-950" /></label>
          <label className="text-sm font-medium">AI provider<select name="aiProvider" className="mt-2 h-11 w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-950">{providerTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <div><p className="text-sm font-medium">Preferred templates</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{db.templates.map((template) => <label key={template.id} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800"><input type="checkbox" name="preferredTemplates" value={template.id} className="mr-2" />{template.name}</label>)}</div></div>
          <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Finish setup</button>
        </form>
      </div>
    </main>
  );
}
