import "server-only";

import { createId } from "@/lib/security";
import { updateDb } from "@/lib/store";
import type { EmailLog, User } from "@/lib/types";

const subjects: Record<EmailLog["type"], string> = {
  welcome: "Welcome to LegalPage AI",
  trial_ending: "Your LegalPage AI trial is ending soon",
  subscription_success: "Your LegalPage AI subscription is active",
  payment_failed: "Payment failed for LegalPage AI",
  password_reset: "Reset your LegalPage AI password",
};

export async function sendTransactionalEmail({
  user,
  to,
  type,
  body,
}: {
  user?: User;
  to: string;
  type: EmailLog["type"];
  body: string;
}) {
  await updateDb((db) => {
    db.emailLogs.unshift({
      id: createId("email"),
      userId: user?.id,
      to,
      type,
      subject: subjects[type],
      body,
      status: "sent",
      createdAt: new Date().toISOString(),
    });
  });
}
