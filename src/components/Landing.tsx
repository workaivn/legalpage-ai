import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
  "Privacy Policy, Terms, Refund, and Cookie pages",
  "Tailored for SaaS, apps, stores, blogs, and AI tools",
  "Markdown and HTML exports included",
];

export function Landing() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            AI-assisted legal page drafts
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Generate Legal Pages in Seconds
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Create Privacy Policy, Terms of Service, Refund Policy, and Cookie Policy for your website, SaaS, app, or
            ecommerce store.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#generator"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Generate My Legal Pages
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              View pricing
            </a>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-blue-600" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center">
          <div className="accent-ring w-full rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Legal page set</p>
                  <p className="text-xs text-slate-500">Generated draft preview</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Ready
                </span>
              </div>
              <div className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-50 to-violet-50 text-blue-700">
                        {index % 2 === 0 ? <ShieldCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{item}</p>
                        <div className="mt-2 h-2 w-48 max-w-full rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
