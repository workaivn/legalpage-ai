import "server-only";

import Stripe from "stripe";
import { auditLog } from "@/lib/audit";
import { sendTransactionalEmail } from "@/lib/email";
import { centsToCurrency, plans } from "@/lib/plans";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";
import type { BillingProvider, Coupon, PlanId, SubscriptionStatus, User } from "@/lib/types";

export function validateCoupon(coupon: Coupon | undefined) {
  if (!coupon || !coupon.active) return undefined;
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) return undefined;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return undefined;
  return coupon;
}

export function discountedAmount(amount: number, coupon?: Coupon) {
  const valid = validateCoupon(coupon);
  if (!valid) return amount;
  if (valid.type === "percentage") return Math.max(0, Math.round(amount * (1 - valid.amount / 100)));
  return Math.max(0, amount - valid.amount);
}

export async function createCheckoutUrl({
  user,
  planId,
  provider,
  couponCode,
}: {
  user: User;
  planId: Exclude<PlanId, "free">;
  provider: BillingProvider;
  couponCode?: string;
}) {
  const db = await readDb();
  const coupon = validateCoupon(db.coupons.find((item) => item.code.toLowerCase() === couponCode?.toLowerCase()));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (provider === "stripe") {
    const secretKey = db.billingSettings.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
    const price = db.billingSettings.stripePriceIds[planId] || process.env[`STRIPE_${planId.toUpperCase()}_PRICE_ID`];
    if (!secretKey || !price || price.startsWith("price_replace")) {
      return createManualCheckout(user, planId, provider, coupon?.code);
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      metadata: { userId: user.id, planId, couponCode: coupon?.code || "" },
    });

    await auditLog({ userId: user.id, action: "checkout.created", targetType: "stripe", metadata: { planId } });
    return session.url || `${appUrl}/dashboard/billing`;
  }

  const apiKey = db.billingSettings.lemonSqueezyApiKey || process.env.LEMONSQUEEZY_API_KEY;
  const storeId = db.billingSettings.lemonSqueezyStoreId || process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = db.billingSettings.lemonSqueezyVariantIds[planId] || process.env[`LEMONSQUEEZY_${planId.toUpperCase()}_VARIANT_ID`];

  if (!apiKey || !storeId || !variantId || variantId.startsWith("replace")) {
    return createManualCheckout(user, planId, provider, coupon?.code);
  }

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: user.email,
            custom: { user_id: user.id, plan_id: planId, coupon_code: coupon?.code || "" },
          },
          product_options: {
            redirect_url: `${appUrl}/dashboard/billing?checkout=success`,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("LemonSqueezy checkout could not be created. Check API settings.");
  }

  const data = await response.json();
  await auditLog({ userId: user.id, action: "checkout.created", targetType: "lemonsqueezy", metadata: { planId } });
  return data.data.attributes.url as string;
}

export async function createManualCheckout(user: User, planId: Exclude<PlanId, "free">, provider: BillingProvider, couponCode?: string) {
  const db = await readDb();
  const coupon = validateCoupon(db.coupons.find((item) => item.code.toLowerCase() === couponCode?.toLowerCase()));
  const plan = plans[planId];
  const amount = discountedAmount(plan.priceMonthly, coupon);
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await updateDb((currentDb) => {
    const existing = currentDb.subscriptions.find((subscription) => subscription.userId === user.id && subscription.status === "active");
    if (existing) {
      existing.planId = planId;
      existing.provider = provider;
      existing.updatedAt = now.toISOString();
      existing.currentPeriodEnd = periodEnd.toISOString();
      existing.cancelAtPeriodEnd = false;
    } else {
      currentDb.subscriptions.unshift({
        id: createId("sub"),
        userId: user.id,
        planId,
        provider,
        status: "active",
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }

    currentDb.invoices.unshift({
      id: createId("inv"),
      userId: user.id,
      provider,
      amount,
      currency: "USD",
      status: "paid",
      createdAt: now.toISOString(),
    });

    currentDb.creditTransactions.push({
      id: createId("cr"),
      userId: user.id,
      amount: plans[planId].creditsPerMonth,
      reason: "subscription_change",
      createdAt: now.toISOString(),
    });

    if (coupon) {
      coupon.usedCount += 1;
      currentDb.analytics.push({ id: createId("evt"), userId: user.id, type: "coupon_applied", createdAt: now.toISOString() });
    }
    currentDb.analytics.push({ id: createId("evt"), userId: user.id, type: "checkout", createdAt: now.toISOString() });
  });

  await sendTransactionalEmail({
    user,
    to: user.email,
    type: "subscription_success",
    body: `Your ${plan.name} subscription is active. Amount charged: ${centsToCurrency(amount)}.`,
  });
  await auditLog({ userId: user.id, action: "subscription.manual_checkout", targetType: "subscription", metadata: { planId, provider } });

  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?checkout=manual-success`;
}

export async function changeSubscription(user: User, planId: PlanId, status: SubscriptionStatus = "active") {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await updateDb((db) => {
    let subscription = db.subscriptions.find((item) => item.userId === user.id && item.status !== "canceled");
    if (!subscription) {
      subscription = {
        id: createId("sub"),
        userId: user.id,
        planId,
        provider: "manual",
        status,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      db.subscriptions.unshift(subscription);
    }
    subscription.planId = planId;
    subscription.status = status;
    subscription.updatedAt = now.toISOString();
    subscription.currentPeriodEnd = periodEnd.toISOString();
    subscription.cancelAtPeriodEnd = false;
    db.creditTransactions.push({ id: createId("cr"), userId: user.id, amount: plans[planId].creditsPerMonth, reason: "subscription_change", createdAt: now.toISOString() });
    db.analytics.push({ id: createId("evt"), userId: user.id, type: "subscription_change", createdAt: now.toISOString() });
  });
}

export async function cancelSubscription(user: User) {
  await updateDb((db) => {
    const subscription = db.subscriptions.find((item) => item.userId === user.id && ["active", "trialing", "past_due"].includes(item.status));
    if (subscription) {
      subscription.cancelAtPeriodEnd = true;
      subscription.status = "canceled";
      subscription.updatedAt = new Date().toISOString();
      db.analytics.push({ id: createId("evt"), userId: user.id, type: "subscription_change", createdAt: new Date().toISOString() });
    }
  });
  await auditLog({ userId: user.id, action: "subscription.cancel", targetType: "subscription" });
}
