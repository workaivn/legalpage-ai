import type { AnalyticsEvent, DocumentRecord, LegalTemplate, ProviderType, User } from "@/lib/types";

export function formatDate(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function thisMonthCount(events: AnalyticsEvent[]) {
  const now = new Date();
  return events.filter((event) => {
    const created = new Date(event.createdAt);
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
  }).length;
}

export function mostUsedTemplate(events: AnalyticsEvent[], templates: LegalTemplate[]) {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (event.templateId) counts.set(event.templateId, (counts.get(event.templateId) || 0) + 1);
  }
  const [templateId] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];
  return templates.find((template) => template.id === templateId)?.name || "No template data";
}

export function providerUsage(events: AnalyticsEvent[]) {
  const usage: Record<ProviderType, number> = { openai: 0, gemini: 0, anthropic: 0 };
  for (const event of events) {
    if (event.provider) usage[event.provider] += 1;
  }
  return usage;
}

export function visibleDocumentsForUser(documents: DocumentRecord[], user: User) {
  return user.role === "admin" ? documents : documents.filter((document) => document.userId === user.id);
}
