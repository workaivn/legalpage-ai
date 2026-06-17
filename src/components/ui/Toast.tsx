"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
    if (!message) return;
    const timer = window.setTimeout(() => setVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 text-sm text-slate-800 shadow-2xl dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
      <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      <span>{message}</span>
      <button type="button" onClick={() => setVisible(false)} className="ml-2 text-slate-400 hover:text-slate-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
