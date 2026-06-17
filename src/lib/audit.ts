import "server-only";

import { createId } from "@/lib/security";
import { updateDb } from "@/lib/store";

export async function auditLog({
  userId,
  action,
  targetType,
  targetId,
  metadata,
}: {
  userId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, string | number | boolean>;
}) {
  await updateDb((db) => {
    db.auditLogs.unshift({
      id: createId("audit"),
      userId,
      action,
      targetType,
      targetId,
      metadata,
      createdAt: new Date().toISOString(),
    });
  });
}
