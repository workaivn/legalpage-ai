import { Generator } from "@/components/Generator";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";
import { readDb } from "@/lib/store";

export default async function DashboardGeneratorPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const user = await requireUser();
  const { template: templateId } = await searchParams;
  const db = await readDb();
  const template = db.templates.find((item) => item.id === templateId);
  const plan = getUserPlan(user, db.subscriptions);

  return (
    <>
      <PageHeader
        title="Legal Generator"
        description={template ? `Starting from ${template.name}. Adjust the defaults and generate documents for your product.` : "Create and save premium legal document drafts from one structured intake form."}
      />
      <Generator dashboard initialFormData={template?.formDefaults} initialDocumentTypes={template?.documentTypes} templateId={template?.id} allowPdfExport={plan.pdfExport} />
    </>
  );
}
