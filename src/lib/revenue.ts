import type { AppDatabase } from "@/lib/types";

export function revenueMetrics(db: AppDatabase) {
  const activeSubscriptions = db.subscriptions.filter((subscription) => subscription.status === "active");
  const mrr = activeSubscriptions.reduce((sum, subscription) => {
    const plan = subscription.planId === "agency" ? 7900 : subscription.planId === "pro" ? 2900 : 0;
    return sum + plan;
  }, 0);
  const canceled = db.subscriptions.filter((subscription) => subscription.status === "canceled").length;
  const totalKnown = db.subscriptions.length || 1;
  const paidInvoices = db.invoices.filter((invoice) => invoice.status === "paid");
  const freeUsers = db.users.length - activeSubscriptions.length;

  return {
    mrr,
    arr: mrr * 12,
    activeSubscriptions: activeSubscriptions.length,
    churnRate: Math.round((canceled / totalKnown) * 100),
    conversionRate: Math.round((activeSubscriptions.length / Math.max(1, db.users.length)) * 100),
    freeUsers,
    revenueByMonth: paidInvoices.reduce<Record<string, number>>((months, invoice) => {
      const key = invoice.createdAt.slice(0, 7);
      months[key] = (months[key] || 0) + invoice.amount;
      return months;
    }, {}),
    topTemplates: db.analytics.reduce<Record<string, number>>((templates, event) => {
      if (event.templateId) templates[event.templateId] = (templates[event.templateId] || 0) + 1;
      return templates;
    }, {}),
  };
}
