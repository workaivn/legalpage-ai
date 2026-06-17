import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const db = await readDb();
  const secretKey = db.billingSettings.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
  const webhookSecret = db.billingSettings.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });

  const stripe = new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId as "pro" | "agency" | undefined;
    if (userId && planId) {
      await activateFromWebhook({ userId, planId, provider: "stripe", customerId: String(session.customer || ""), subscriptionId: String(session.subscription || "") });
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    await updateDb((currentDb) => {
      currentDb.invoices.unshift({ id: createId("inv"), userId: String(invoice.metadata?.userId || ""), provider: "stripe", providerInvoiceId: invoice.id, amount: invoice.amount_due || 0, currency: invoice.currency?.toUpperCase() || "USD", status: "failed", hostedInvoiceUrl: invoice.hosted_invoice_url || undefined, createdAt: new Date().toISOString() });
    });
  }

  return NextResponse.json({ received: true });
}

async function activateFromWebhook({ userId, planId, provider, customerId, subscriptionId }: { userId: string; planId: "pro" | "agency"; provider: "stripe"; customerId: string; subscriptionId: string }) {
  const { plans } = await import("@/lib/plans");
  await updateDb((db) => {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    db.subscriptions = db.subscriptions.filter((subscription) => !(subscription.userId === userId && subscription.status === "active"));
    db.subscriptions.unshift({ id: createId("sub"), userId, planId, provider, providerCustomerId: customerId, providerSubscriptionId: subscriptionId, status: "active", currentPeriodStart: now.toISOString(), currentPeriodEnd: periodEnd.toISOString(), cancelAtPeriodEnd: false, createdAt: now.toISOString(), updatedAt: now.toISOString() });
    db.creditTransactions.push({ id: createId("cr"), userId, amount: plans[planId].creditsPerMonth, reason: "monthly_grant", createdAt: now.toISOString() });
  });
}
