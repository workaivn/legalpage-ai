import type { DocumentStatus, ProviderType } from "@/lib/types";

const statusStyles: Record<DocumentStatus, string> = {
  Draft: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800",
  Published: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800",
  Archived: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700",
};

const providerStyles: Record<ProviderType, string> = {
  openai: "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-200 dark:ring-green-800",
  gemini: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-800",
  anthropic: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:ring-violet-800",
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}>{status}</span>;
}

export function ProviderBadge({ provider }: { provider: ProviderType }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${providerStyles[provider]}`}>
      {provider}
    </span>
  );
}
