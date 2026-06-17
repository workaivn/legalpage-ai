"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AuthActionState } from "@/app/actions/auth";

export function AuthForm({
  mode,
  action,
  referralCode,
}: {
  mode: "login" | "register" | "forgot";
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  referralCode?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const isLogin = mode === "login";
  const isRegister = mode === "register";

  return (
    <form action={formAction} className="mt-7 grid gap-4">
      {referralCode ? <input type="hidden" name="ref" value={referralCode} /> : null}
      {isRegister ? (
        <label>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Name</span>
          <input name="name" required className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </label>
      ) : null}
      <label>
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Email</span>
        <input
          name="email"
          type="email"
          required
          defaultValue={isLogin ? "demo@legalpage.ai" : ""}
          className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
      {mode !== "forgot" ? (
        <label>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            defaultValue={isLogin ? "password123" : ""}
            className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
      ) : null}
      {state.error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{state.error}</span>
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          {state.success}
        </div>
      ) : null}
      <button
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isLogin ? "Sign in" : isRegister ? "Create account" : "Send reset instructions"}
      </button>
    </form>
  );
}
