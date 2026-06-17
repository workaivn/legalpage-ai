"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { updateDb } from "@/lib/store";
import { businessTypes, providerTypes, type BusinessType, type ProviderType } from "@/lib/types";

export async function completeOnboardingAction(formData: FormData) {
  const user = await requireUser();
  const businessType = String(formData.get("businessType") || "SaaS") as BusinessType;
  const country = String(formData.get("country") || "").trim();
  const aiProvider = String(formData.get("aiProvider") || "openai") as ProviderType;
  const preferredTemplates = formData.getAll("preferredTemplates").map(String);
  if (!businessTypes.includes(businessType) || !country || !providerTypes.includes(aiProvider)) throw new Error("Complete onboarding details.");

  await updateDb((db) => {
    const profile = { userId: user.id, businessType, country, aiProvider, preferredTemplates, completedAt: new Date().toISOString() };
    db.onboardingProfiles = db.onboardingProfiles.filter((item) => item.userId !== user.id);
    db.onboardingProfiles.push(profile);
    const dbUser = db.users.find((item) => item.id === user.id);
    if (dbUser) dbUser.onboardingCompleted = true;
    db.settings.activeProvider = aiProvider;
  });
  redirect("/dashboard");
}
