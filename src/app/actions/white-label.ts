"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";
import { readDb, updateDb } from "@/lib/store";

export async function updateWhiteLabelAction(formData: FormData) {
  const user = await requireUser();
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  if (!plan.whiteLabel) throw new Error("White label settings require the Agency plan.");

  const settings = {
    userId: user.id,
    companyName: String(formData.get("companyName") || "").trim(),
    logoUrl: String(formData.get("logoUrl") || "").trim() || undefined,
    primaryColor: String(formData.get("primaryColor") || "#2563eb").trim(),
    accentColor: String(formData.get("accentColor") || "#7c3aed").trim(),
    removeBranding: formData.get("removeBranding") === "on",
    updatedAt: new Date().toISOString(),
  };
  if (!settings.companyName) throw new Error("Company name is required.");

  await updateDb((currentDb) => {
    currentDb.whiteLabels = currentDb.whiteLabels.filter((item) => item.userId !== user.id);
    currentDb.whiteLabels.push(settings);
  });
  revalidatePath("/dashboard/white-label");
}
