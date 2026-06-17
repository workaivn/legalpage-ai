import { NextResponse } from "next/server";
import { generateDocumentsWithProvider, normalizeProviderError } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { canUseTemplate, getUserPlan } from "@/lib/plans";
import { assertRateLimit } from "@/lib/rate-limit";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";
import { documentTypes, type DocumentRecord, type DocumentType } from "@/lib/types";
import { assertCanGenerate, consumeGenerationCredits } from "@/lib/usage";
import { validateGeneratorData } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let providerName: string | undefined;

  try {
    const payload = await request.json();
    const formData = validateGeneratorData(payload.formData || payload);
    const templateId = typeof payload.templateId === "string" ? payload.templateId : undefined;
    const requestedDocuments = normalizeRequestedDocuments(payload.documentTypes);
    const user = await getCurrentUser();
    const db = await readDb();
    providerName = db.settings.activeProvider;

    assertRateLimit(user?.id || request.headers.get("x-forwarded-for") || "anonymous", user ? 30 : 5, 60_000);

    if (user) {
      await assertCanGenerate(user);
      if (templateId) {
        const template = db.templates.find((item) => item.id === templateId);
        const plan = getUserPlan(user, db.subscriptions);
        if (template && !canUseTemplate(plan.id, template)) {
          throw new Error("This template requires a Pro or Agency subscription.");
        }
      }
    }

    const { documents, provider } = await generateDocumentsWithProvider({
      formData,
      settings: db.settings,
      requestedDocuments,
    });

    const savedDocumentIds: string[] = [];
    if (user) {
      const now = new Date().toISOString();
      await updateDb((currentDb) => {
        for (const document of documents) {
          const record: DocumentRecord = {
            id: createId("doc"),
            userId: user.id,
            title: `${formData.projectName} ${document.title}`,
            type: document.title,
            status: "Draft",
            projectName: formData.projectName,
            templateId,
            provider,
            markdown: document.markdown,
            html: document.html,
            formData,
            createdAt: now,
            updatedAt: now,
          };
          currentDb.documents.unshift(record);
          savedDocumentIds.push(record.id);
        }

        currentDb.analytics.push({
          id: createId("evt"),
          userId: user.id,
          type: "generation",
          provider,
          templateId,
          createdAt: now,
        });
      });
      await consumeGenerationCredits(user.id, savedDocumentIds);
    }

    return NextResponse.json({
      documents,
      generatedAt: new Date().toISOString(),
      provider,
      savedDocumentIds,
    });
  } catch (error) {
    return NextResponse.json({ error: normalizeProviderError(error, providerName as never) }, { status: 400 });
  }
}

function normalizeRequestedDocuments(value: unknown): readonly DocumentType[] {
  if (!Array.isArray(value) || value.length === 0) {
    return ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"];
  }

  return value.filter((item): item is DocumentType => documentTypes.includes(item as DocumentType));
}
