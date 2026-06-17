import { CheckCircle2 } from "lucide-react";

const features = [
  "Generate all four core legal pages",
  "Copy individual documents",
  "Download Markdown and HTML",
  "Regenerate drafts anytime",
  "No account or database required in v1",
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Simple pricing for the MVP
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Start with the full generator experience. Add payments, saved projects, and team features later.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">MVP Access</h3>
              <p className="mt-2 text-sm text-slate-600">For makers validating legal page generation.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">v1</span>
          </div>
          <div className="mt-6 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight text-slate-950">$0</span>
            <span className="pb-2 text-sm font-medium text-slate-500">local MVP</span>
          </div>
          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-blue-600" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href="#generator"
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Generate pages
          </a>
        </div>
      </div>
    </section>
  );
}
