import { isVercelDemoMode } from "@/lib/store";

export function DemoModeBanner() {
  if (!isVercelDemoMode()) {
    return null;
  }

  return (
    <div className="border-b border-violet-200 bg-gradient-to-r from-blue-50 to-violet-50 px-4 py-2 text-center text-sm font-semibold text-violet-800 dark:border-violet-900 dark:from-blue-950 dark:to-violet-950 dark:text-violet-100">
      Running in Demo Mode on Vercel. Data resets automatically.
    </div>
  );
}
