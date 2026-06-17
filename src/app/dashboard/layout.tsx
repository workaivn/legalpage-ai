import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (user.role === "admin") {
    redirect("/admin");
  }

  return <AppShell user={user}>{children}</AppShell>;
}
