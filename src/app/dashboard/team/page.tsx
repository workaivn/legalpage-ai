import { createTeamAction, inviteMemberAction, removeMemberAction } from "@/app/actions/team";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";
import { readDb } from "@/lib/store";

export default async function TeamPage() {
  const user = await requireUser();
  const db = await readDb();
  const plan = getUserPlan(user, db.subscriptions);
  const teams = db.teams.filter((team) => team.ownerId === user.id);
  return (
    <>
      <PageHeader title="Team Workspace" description="Agency plan customers can invite members and collaborate on shared legal documents." />
      {!plan.teamWorkspace ? <Card><CardContent><p className="font-semibold">Team workspaces require Agency.</p><p className="mt-2 text-sm text-slate-500">Upgrade to unlock invites, shared documents, shared templates, and white label mode.</p></CardContent></Card> : null}
      <form action={createTeamAction} className="mt-4 flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><input name="name" placeholder="Team name" className="h-10 flex-1 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" /><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Create team</button></form>
      <div className="mt-5 grid gap-4">
        {teams.map((team) => <Card key={team.id}><CardContent><h2 className="font-semibold">{team.name}</h2><form action={inviteMemberAction} className="mt-4 flex gap-3"><input type="hidden" name="teamId" value={team.id} /><input name="email" placeholder="member@example.com" className="h-10 flex-1 rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" /><button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-800">Invite</button></form><div className="mt-4 space-y-2">{db.teamMembers.filter((member) => member.teamId === team.id).map((member) => <div key={member.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><span>{member.email} · {member.role} · {member.status}</span>{member.role !== "owner" ? <form action={removeMemberAction}><input type="hidden" name="memberId" value={member.id} /><button className="text-red-600">Remove</button></form> : null}</div>)}</div></CardContent></Card>)}
      </div>
    </>
  );
}
