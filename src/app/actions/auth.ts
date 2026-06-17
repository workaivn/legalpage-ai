"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { createResetToken, hashPassword, verifyPassword } from "@/lib/security";
import { updateDb } from "@/lib/store";
import { validateEmail } from "@/lib/validation";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!validateEmail(email) || !password) {
    return { error: "Enter a valid email and password." };
  }

  const user = await updateDb((db) => db.users.find((item) => item.email.toLowerCase() === email));
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  await updateDb((db) => {
    db.analytics.push({ id: `evt_${Date.now()}`, userId: user.id, type: "login", createdAt: new Date().toISOString() });
  });

  redirect("/dashboard");
}

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const ref = String(formData.get("ref") || "").trim();

  if (!name || !validateEmail(email) || password.length < 8) {
    return { error: "Enter your name, a valid email, and a password with at least 8 characters." };
  }

  const userId = `usr_${Date.now()}`;
  const created = await updateDb((db) => {
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      return false;
    }

    db.users.push({
      id: userId,
      name,
      email,
      passwordHash: hashPassword(password),
      role: "user",
      referralCode: `ref_${Date.now()}`,
      referredBy: ref || undefined,
      createdAt: new Date().toISOString(),
    });
    if (ref) {
      const referrer = db.users.find((user) => user.referralCode === ref || user.id === ref);
      if (referrer) {
        db.referrals.unshift({ id: `ref_${Date.now()}`, referrerUserId: referrer.id, referredUserId: userId, status: "signed_up", commissionAmount: 0, createdAt: new Date().toISOString() });
      }
    }
    db.analytics.push({ id: `evt_${Date.now()}`, userId, type: "register", createdAt: new Date().toISOString() });
    return true;
  });

  if (!created) {
    return { error: "An account already exists for this email." };
  }

  await createSession(userId);
  await sendTransactionalEmail({ to: email, type: "welcome", body: "Welcome to LegalPage AI. Your workspace is ready." });
  redirect("/onboarding");
}

export async function forgotPasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!validateEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  const token = createResetToken();
  await updateDb((db) => {
    const user = db.users.find((item) => item.email.toLowerCase() === email);
    if (user) {
      user.resetToken = token;
      user.resetExpiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
      db.emailLogs.unshift({
        id: `email_${Date.now()}`,
        userId: user.id,
        to: user.email,
        type: "password_reset",
        subject: "Reset your LegalPage AI password",
        body: `Use this reset token within 30 minutes: ${token}`,
        status: "sent",
        createdAt: new Date().toISOString(),
      });
    }
  });

  return {
    success:
      "If an account exists, a password reset token was generated. In production, connect your SMTP provider to email it.",
  };
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
