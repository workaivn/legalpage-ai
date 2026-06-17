import { Bot, Download, FileCheck2, Library, LockKeyhole, MessageSquare, Palette, ShieldCheck } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Bot, title: "Multi-provider AI", text: "Switch between OpenAI, Gemini, and Anthropic from settings." },
  { icon: FileCheck2, title: "11 legal generators", text: "Core policies plus GDPR, DPA, AI usage, affiliate, and copyright pages." },
  { icon: Library, title: "Template marketplace", text: "Launch from presets for SaaS, apps, stores, agencies, blogs, and marketplaces." },
  { icon: Download, title: "Professional exports", text: "Download Markdown, HTML, and polished PDF files from generated drafts." },
  { icon: LockKeyhole, title: "Authentication included", text: "Email/password login, register, forgot password, dashboard, and admin panel." },
  { icon: Palette, title: "Dark mode UI", text: "Responsive modern SaaS interface with empty, error, loading, and success states." },
];

const testimonials = [
  ["A founder-grade toolkit that feels much bigger than an MVP.", "Rina Chen, SaaS Builder"],
  ["The template library and document dashboard make it CodeCanyon-ready.", "Marco Bell, Marketplace Buyer"],
  ["Clean architecture, useful demo data, and practical exports out of the box.", "Nadia Fox, Agency Owner"],
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-16 dark:bg-slate-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Everything a commercial SaaS generator needs</h2>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <feature.icon className="h-6 w-6 text-blue-700" />
              <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScreenshotsSection() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Screenshots</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">A polished dashboard buyers can understand immediately</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Overview cards, recent documents, provider settings, admin metrics, and template-driven generation are ready for product demos.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <div className="grid gap-3 sm:grid-cols-3">
                {["Total Documents", "This Month", "Last Generated"].map((item, index) => (
                  <div key={item} className="rounded-lg bg-white/10 p-4">
                    <p className="text-xs text-slate-300">{item}</p>
                    <p className="mt-3 text-2xl font-semibold">{index === 0 ? "128" : index === 1 ? "34" : "Today"}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-white p-4 text-slate-950">
                {["NimbusCRM Privacy Policy", "PromptDesk AI Usage Policy", "LumaShop Refund Policy"].map((item) => (
                  <div key={item} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                    <span className="font-medium">{item}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Saved</span>
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

export function TestimonialsSection() {
  return (
    <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name]) => (
            <figure key={name} className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <MessageSquare className="h-5 w-5 text-blue-700" />
              <blockquote className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{quote}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">{name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TemplatesPreviewSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Templates</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Seven commercial template categories</h2>
          </div>
          <Link href="/templates" className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">Browse library</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["SaaS", "Mobile App", "Ecommerce", "AI Startup", "Agency", "Blog", "Marketplace"].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
              <p className="mt-3 font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Ready for marketplace demos and client installs</h2>
          <p className="mt-3 max-w-2xl text-slate-300">Use the included docs, demo users, template library, and admin area to present a premium SaaS product.</p>
        </div>
        <Link href="/register" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950">Create account</Link>
      </div>
    </section>
  );
}
