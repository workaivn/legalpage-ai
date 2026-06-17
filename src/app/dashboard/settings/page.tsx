import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export default async function SettingsPage() {
  await requireAdmin();
  redirect("/admin/ai-settings");
}
