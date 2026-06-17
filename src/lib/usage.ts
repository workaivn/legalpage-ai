import "server-only";

import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";
import { getMonthlyGenerationCount, getUserPlan } from "@/lib/plans";
import type { User } from "@/lib/types";

export async function getUsageSummary(user: User) {
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  const creditBalance = db.creditTransactions
    .filter((transaction) => transaction.userId === user.id)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const generationCount = getMonthlyGenerationCount(user.id, db.documents);
  const exportCount = db.analytics.filter((event) => event.userId === user.id && event.type === "export").length;
  const quota = plan.generationsPerMonth;
  const remainingGenerations = quota === "unlimited" ? "unlimited" : Math.max(0, quota - generationCount);

  return {
    plan,
    creditBalance,
    generationCount,
    exportCount,
    quota,
    remainingGenerations,
    providerUsage: db.analytics
      .filter((event) => event.userId === user.id && event.provider)
      .reduce<Record<string, number>>((usage, event) => {
        usage[event.provider!] = (usage[event.provider!] || 0) + 1;
        return usage;
      }, {}),
  };
}

export async function assertCanGenerate(user: User) {
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  const monthlyCount = getMonthlyGenerationCount(user.id, db.documents);
  const creditBalance = db.creditTransactions
    .filter((transaction) => transaction.userId === user.id)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  if (plan.generationsPerMonth !== "unlimited" && monthlyCount >= plan.generationsPerMonth) {
    throw new Error("Monthly generation quota reached. Upgrade to Pro for unlimited generations.");
  }

  if (creditBalance < db.creditSettings.generationCost) {
    throw new Error("Not enough credits. Upgrade your plan or ask an admin to add credits.");
  }
}

export async function consumeGenerationCredits(userId: string, documentIds: string[]) {
  await updateDb((db) => {
    db.creditTransactions.push({
      id: createId("cr"),
      userId,
      amount: -db.creditSettings.generationCost,
      reason: "generation",
      documentId: documentIds[0],
      createdAt: new Date().toISOString(),
    });
  });
}

export async function consumePdfCredits(userId: string, documentId: string) {
  await updateDb((db) => {
    const balance = db.creditTransactions
      .filter((transaction) => transaction.userId === userId)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    if (balance < db.creditSettings.pdfExportCost) {
      throw new Error("Not enough credits for PDF export.");
    }

    db.creditTransactions.push({
      id: createId("cr"),
      userId,
      amount: -db.creditSettings.pdfExportCost,
      reason: "pdf_export",
      documentId,
      createdAt: new Date().toISOString(),
    });
  });
}
