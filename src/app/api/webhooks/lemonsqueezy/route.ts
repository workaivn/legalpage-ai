import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const db = await readDb();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "LemonSqueezy webhook secret is not configured." }, { status: 500 });

  const raw = await request.text();
  const signature = request.headers.get("x-signature") || "";
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    return NextResponse.json({ error: "Invalid LemonSqueezy signature." }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const eventName = event.meta?.event_name as string | undefined;
  const custom = event.meta?.custom_data || event.data?.attributes?.custom_data || {};
  const userId = custom.user_id as string | undefined;
  const planId = custom.plan_id as "pro" | "agency" | undefined;

  if (eventName === "subscription_created" && userId && planId) {
    const { plans } = await import("@/lib/plans");
    await updateDb((currentDb) => {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      currentDb.subscriptions = currentDb.subscriptions.filter((subscription) => !(subscription.userId === userId && subscription.status === "active"));
      currentDb.subscriptions.unshift({
        id: createId("sub"),
        userId,
        planId,
        provider: "lemonsqueezy",
        providerCustomerId: String(event.data?.attributes?.customer_id || ""),
        providerSubscriptionId: String(event.data?.id || ""),
        status: "active",
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      currentDb.creditTransactions.push({ id: createId("cr"), userId, amount: plans[planId].creditsPerMonth, reason: "monthly_grant", createdAt: now.toISOString() });
    });
  }

  if (eventName === "subscription_payment_failed" && userId) {
    await updateDb((currentDb) => {
      currentDb.invoices.unshift({ id: createId("inv"), userId, provider: "lemonsqueezy", amount: Number(event.data?.attributes?.total || 0), currency: "USD", status: "failed", createdAt: new Date().toISOString() });
    });
  }

  return NextResponse.json({ received: true });
}
