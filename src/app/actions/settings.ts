"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { updateDb } from "@/lib/store";
import { providerTypes, type ProviderType } from "@/lib/types";

export async function updateProviderSettingsAction(formData: FormData) {
  await requireAdmin();
  const activeProvider = String(formData.get("activeProvider") || "openai") as ProviderType;
  if (!providerTypes.includes(activeProvider)) {
    throw new Error("Invalid AI provider.");
  }

  await updateDb((db) => {
    db.settings = {
      activeProvider,
      openaiApiKey: String(formData.get("openaiApiKey") || db.settings.openaiApiKey || "").trim() || undefined,
      openaiModel: String(formData.get("openaiModel") || "gpt-4o-mini").trim(),
      geminiApiKey: String(formData.get("geminiApiKey") || db.settings.geminiApiKey || "").trim() || undefined,
      geminiModel: String(formData.get("geminiModel") || "gemini-1.5-flash").trim(),
      anthropicApiKey: String(formData.get("anthropicApiKey") || db.settings.anthropicApiKey || "").trim() || undefined,
      anthropicModel: String(formData.get("anthropicModel") || "claude-3-5-haiku-latest").trim(),
    };
  });

  revalidatePath("/admin/ai-settings");
}
