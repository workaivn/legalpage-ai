"use server";

import { redirect } from "next/navigation";
import { cancelSubscription, changeSubscription, createCheckoutUrl } from "@/lib/billing";
import { requireUser } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { billingProviders, planIds, type BillingProvider, type PlanId } from "@/lib/types";

export async function checkoutAction(formData: FormData) {
  const user = await requireUser();
  const planId = String(formData.get("planId") || "pro") as PlanId;
  const provider = String(formData.get("provider") || "stripe") as BillingProvider;
  const couponCode = String(formData.get("couponCode") || "").trim();

  if (!planIds.includes(planId) || planId === "free" || !billingProviders.includes(provider)) {
    throw new Error("Invalid checkout selection.");
  }

  const checkoutUrl = await createCheckoutUrl({ user, planId, provider, couponCode });
  redirect(checkoutUrl);
}

export async function changePlanAction(formData: FormData) {
  const user = await requireUser();
  const planId = String(formData.get("planId") || "free") as PlanId;
  if (!planIds.includes(planId)) throw new Error("Invalid plan.");
  await changeSubscription(user, planId);
  await auditLog({ userId: user.id, action: "subscription.plan_change", targetType: "subscription", metadata: { planId } });
}

export async function cancelSubscriptionAction() {
  const user = await requireUser();
  await cancelSubscription(user);
}
