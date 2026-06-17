"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createId } from "@/lib/security";
import { couponTypes, type CouponType } from "@/lib/types";
import { updateDb } from "@/lib/store";

export async function createCouponAction(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const type = String(formData.get("type") || "percentage") as CouponType;
  const amount = Number(formData.get("amount"));
  const expiresAt = String(formData.get("expiresAt") || "").trim() || undefined;
  const usageLimitRaw = String(formData.get("usageLimit") || "").trim();
  if (!code || !couponTypes.includes(type) || !Number.isFinite(amount) || amount <= 0) throw new Error("Valid coupon details are required.");

  await updateDb((db) => {
    db.coupons.unshift({
      id: createId("coupon"),
      code,
      type,
      amount,
      expiresAt,
      usageLimit: usageLimitRaw ? Number(usageLimitRaw) : undefined,
      usedCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
    });
  });
  revalidatePath("/admin/coupons");
}

export async function toggleCouponAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await updateDb((db) => {
    const coupon = db.coupons.find((item) => item.id === id);
    if (coupon) coupon.active = !coupon.active;
  });
  revalidatePath("/admin/coupons");
}
