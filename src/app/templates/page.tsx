import { ArrowRight, Filter, Library } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { templateCategories } from "@/lib/types";
import { readDb } from "@/lib/store";

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const db = await readDb();
  const category = params.category || "";
  const templates = db.templates.filter((template) => !category || template.category === category);

  return (
    <>
      <Header />
      <main className="bg-slate-50 py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                <Library className="h-4 w-4" />
                Template Library
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Start from a proven legal template</h1>
              <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                Marketplace-ready presets for SaaS, apps, stores, AI startups, agencies, blogs, and platform businesses.
              </p>
            </div>
            <Link href="/dashboard/generator" className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white">
              Blank generator
            </Link>
          </div>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            <Link href="/templates" className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${!category ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}>
              All
            </Link>
            {templateCategories.map((item) => (
              <Link key={item} href={`/templates?category=${encodeURIComponent(item)}`} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}>
                {item}
              </Link>
            ))}
          </div>
          {templates.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => (
                <article key={template.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{template.category}</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{template.name}</h2>
                    </div>
                    {template.isFeatured ? <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-200">Featured</span> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{template.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {template.documentTypes.slice(0, 4).map((type) => (
                      <span key={type} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{type}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Filter className="h-4 w-4" /> Popularity {template.popularity}%</span>
                    <Link href={`/dashboard/generator?template=${template.id}`} className="inline-flex items-center gap-2 font-semibold text-blue-700">
                      Use template <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="font-semibold">No templates in this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
