import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";
import type { User } from "@/lib/types";

export const sessionCookieName = "legalpage_session";

export async function createSession(userId: string) {
  const session = {
    id: createId("ses"),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
  };

  await updateDb((db) => {
    db.sessions = db.sessions.filter((item) => new Date(item.expiresAt).getTime() > Date.now());
    db.sessions.push(session);
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value;
  if (sessionId) {
    await updateDb((db) => {
      db.sessions = db.sessions.filter((session) => session.id !== sessionId);
    });
  }
  cookieStore.delete(sessionCookieName);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value;
  if (!sessionId) {
    return null;
  }

  const db = await readDb();
  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) {
    return null;
  }

  return db.users.find((user) => user.id === session.userId) || null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}
