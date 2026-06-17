"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth";
import { createId } from "@/lib/security";
import { updateDb } from "@/lib/store";

export async function createReferralAction(formData: FormData) {
  const user = await requireUser();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) throw new Error("Referral email is required.");
  await updateDb((db) => {
    db.referrals.unshift({ id: createId("ref"), referrerUserId: user.id, email, status: "clicked", commissionAmount: 0, createdAt: new Date().toISOString() });
    db.analytics.push({ id: createId("evt"), userId: user.id, type: "referral", createdAt: new Date().toISOString() });
  });
  revalidatePath("/dashboard/affiliate");
}

export async function updateCommissionRateAction(formData: FormData) {
  await requireAdmin();
  const rate = Number(formData.get("commissionRate"));
  if (!Number.isFinite(rate) || rate < 0 || rate > 80) throw new Error("Commission rate must be between 0 and 80.");
  await updateDb((db) => {
    db.billingSettings.commissionRate = rate;
  });
  revalidatePath("/admin/monetization");
}
