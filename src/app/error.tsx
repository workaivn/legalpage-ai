"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <section className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" />
        <h1 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error.message || "LegalPage AI could not complete the request."}</p>
        <button onClick={reset} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Try again</button>
      </section>
    </main>
  );
}
