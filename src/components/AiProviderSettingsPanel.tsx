import { updateProviderSettingsAction } from "@/app/actions/settings";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { ProviderSettings } from "@/lib/types";

export function AiProviderSettingsPanel({ settings }: { settings: ProviderSettings }) {
  return (
    <Card>
      <CardHeader
        title="Provider configuration"
        description="Only admins can edit provider keys. Regular users generate documents through the system provider configured here."
      />
      <CardContent>
        <form action={updateProviderSettingsAction} className="grid gap-5">
          <label>
            <span className="text-sm font-medium">Active provider</span>
            <select
              name="activeProvider"
              defaultValue={settings.activeProvider}
              className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
              <option value="anthropic">Anthropic Claude</option>
            </select>
          </label>
          <div className="grid gap-4 lg:grid-cols-3">
            <ProviderFields
              label="OpenAI"
              keyName="openaiApiKey"
              modelName="openaiModel"
              modelDefault={settings.openaiModel}
              hasKey={Boolean(settings.openaiApiKey || process.env.OPENAI_API_KEY)}
            />
            <ProviderFields
              label="Gemini"
              keyName="geminiApiKey"
              modelName="geminiModel"
              modelDefault={settings.geminiModel}
              hasKey={Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY)}
            />
            <ProviderFields
              label="Anthropic"
              keyName="anthropicApiKey"
              modelName="anthropicModel"
              modelDefault={settings.anthropicModel}
              hasKey={Boolean(settings.anthropicApiKey || process.env.ANTHROPIC_API_KEY)}
            />
          </div>
          <button className="w-fit rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
            Save settings
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProviderFields({
  label,
  keyName,
  modelName,
  modelDefault,
  hasKey,
}: {
  label: string;
  keyName: string;
  modelName: string;
  modelDefault: string;
  hasKey: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{label}</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            hasKey
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200"
          }`}
        >
          {hasKey ? "Configured" : "Missing key"}
        </span>
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-medium">API key</span>
        <input
          name={keyName}
          type="password"
          placeholder={hasKey ? "Leave blank to keep current key" : "Paste API key"}
          className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-medium">Model</span>
        <input
          name={modelName}
          defaultValue={modelDefault}
          className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
    </div>
  );
}
