import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { readDb } from "@/lib/store";

export default async function AdminTemplatesPage() {
  const db = await readDb();
  return (
    <>
      <AdminNav />
      <PageHeader title="Templates" description="Seeded marketplace templates included with the CodeCanyon package." />
      <div className="grid gap-4 md:grid-cols-2">
        {db.templates.map((template) => (
          <article key={template.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{template.category}</p><h2 className="mt-2 text-lg font-semibold">{template.name}</h2></div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold dark:bg-slate-800">{template.popularity}%</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{template.description}</p>
            <p className="mt-3 text-sm text-slate-500">{template.documentTypes.length} document generators included</p>
          </article>
        ))}
      </div>
    </>
  );
}
