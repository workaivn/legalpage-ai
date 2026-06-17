import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        Loading LegalPage AI
      </div>
    </div>
  );
}
