import { AdminNav } from "@/components/AdminNav";
import { AiProviderSettingsPanel } from "@/components/AiProviderSettingsPanel";
import { PageHeader } from "@/components/PageHeader";
import { readDb } from "@/lib/store";

export default async function AdminAiSettingsPage() {
  const db = await readDb();

  return (
    <>
      <AdminNav />
      <PageHeader
        title="AI Provider Settings"
        description="Admin-only configuration for OpenAI, Gemini, and Anthropic Claude."
      />
      <AiProviderSettingsPanel settings={db.settings} />
    </>
  );
}
