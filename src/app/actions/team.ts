"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";

export async function createTeamAction(formData: FormData) {
  const user = await requireUser();
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  if (!plan.teamWorkspace) throw new Error("Team workspaces require the Agency plan.");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Team name is required.");

  await updateDb((currentDb) => {
    const team = { id: createId("team"), ownerId: user.id, name, createdAt: new Date().toISOString() };
    currentDb.teams.unshift(team);
    currentDb.teamMembers.push({ id: createId("tm"), teamId: team.id, userId: user.id, email: user.email, role: "owner", status: "active", createdAt: new Date().toISOString() });
  });
  revalidatePath("/dashboard/team");
}

export async function inviteMemberAction(formData: FormData) {
  const user = await requireUser();
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  if (!plan.teamWorkspace) throw new Error("Team invites require the Agency plan.");
  const teamId = String(formData.get("teamId") || "");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const team = db.teams.find((item) => item.id === teamId && item.ownerId === user.id);
  if (!team || !email) throw new Error("Team and email are required.");

  await updateDb((currentDb) => {
    currentDb.teamMembers.push({ id: createId("tm"), teamId, email, role: "member", status: "invited", createdAt: new Date().toISOString() });
    currentDb.analytics.push({ id: createId("evt"), userId: user.id, type: "team_invite", createdAt: new Date().toISOString() });
    currentDb.emailLogs.unshift({ id: createId("email"), to: email, type: "welcome", subject: "You were invited to LegalPage AI", body: `${user.name} invited you to ${team.name}.`, status: "sent", createdAt: new Date().toISOString() });
  });
  revalidatePath("/dashboard/team");
}

export async function removeMemberAction(formData: FormData) {
  const user = await requireUser();
  const memberId = String(formData.get("memberId") || "");
  await updateDb((db) => {
    const ownedTeamIds = db.teams.filter((team) => team.ownerId === user.id).map((team) => team.id);
    db.teamMembers = db.teamMembers.filter((member) => !(member.id === memberId && ownedTeamIds.includes(member.teamId)));
  });
  revalidatePath("/dashboard/team");
}
