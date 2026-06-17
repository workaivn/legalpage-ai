import type { BillingPlan, DocumentRecord, LegalTemplate, PlanId, Subscription, User } from "@/lib/types";

export const plans: Record<PlanId, BillingPlan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    generationsPerMonth: 5,
    creditsPerMonth: 5,
    basicTemplatesOnly: true,
    watermarkExports: true,
    pdfExport: false,
    priorityModels: false,
    teamWorkspace: false,
    whiteLabel: false,
    removeBranding: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 2900,
    generationsPerMonth: "unlimited",
    creditsPerMonth: 1000,
    basicTemplatesOnly: false,
    watermarkExports: false,
    pdfExport: true,
    priorityModels: true,
    teamWorkspace: false,
    whiteLabel: false,
    removeBranding: false,
  },
  agency: {
    id: "agency",
    name: "Agency",
    priceMonthly: 7900,
    generationsPerMonth: "unlimited",
    creditsPerMonth: 2500,
    basicTemplatesOnly: false,
    watermarkExports: false,
    pdfExport: true,
    priorityModels: true,
    teamWorkspace: true,
    whiteLabel: true,
    removeBranding: true,
  },
};

export const basicTemplateCategories = new Set(["SaaS", "Ecommerce", "Blog"]);

export function getActiveSubscription(user: User, subscriptions: Subscription[]) {
  return subscriptions
    .filter((subscription) => subscription.userId === user.id && ["trialing", "active", "past_due"].includes(subscription.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
}

export function getUserPlan(user: User, subscriptions: Subscription[]) {
  const subscription = getActiveSubscription(user, subscriptions);
  return plans[subscription?.planId || "free"];
}

export function canUseTemplate(planId: PlanId, template: LegalTemplate) {
  const plan = plans[planId];
  return !plan.basicTemplatesOnly || basicTemplateCategories.has(template.category);
}

export function getMonthlyGenerationCount(userId: string, documents: DocumentRecord[]) {
  const now = new Date();
  return documents.filter((document) => {
    const created = new Date(document.createdAt);
    return document.userId === userId && created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
  }).length;
}

export function centsToCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100);
}
