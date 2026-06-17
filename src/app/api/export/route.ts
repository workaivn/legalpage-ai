import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { legalDisclaimer } from "@/lib/format";
import { getUserPlan } from "@/lib/plans";
import { createId } from "@/lib/security";
import { readDb, updateDb } from "@/lib/store";
import { consumePdfCredits } from "@/lib/usage";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to export saved documents." }, { status: 401 });
    }

    const { documentId, format } = (await request.json()) as { documentId?: string; format?: "markdown" | "html" | "pdf" };
    if (!documentId || !format) {
      return NextResponse.json({ error: "Document and format are required." }, { status: 400 });
    }

    const db = await readDb();
    const plan = getUserPlan(user, db.subscriptions);
    const document = db.documents.find((item) => item.id === documentId && (item.userId === user.id || user.role === "admin"));
    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    if (format === "pdf" && !plan.pdfExport) {
      return NextResponse.json({ error: "PDF export requires Pro or Agency." }, { status: 403 });
    }

    if (format === "pdf") {
      await consumePdfCredits(user.id, document.id);
    }

    const watermark = plan.watermarkExports ? `\n\n---\nGenerated with LegalPage AI Free. ${legalDisclaimer}` : "";
    const content = format === "html" ? document.html : `${document.markdown}${watermark}`;

    await updateDb((currentDb) => {
      currentDb.analytics.push({ id: createId("evt"), userId: user.id, type: "export", provider: document.provider, templateId: document.templateId, createdAt: new Date().toISOString() });
      currentDb.auditLogs.unshift({ id: createId("audit"), userId: user.id, action: `document.export.${format}`, targetType: "document", targetId: document.id, createdAt: new Date().toISOString() });
    });

    return NextResponse.json({ title: document.title, markdown: `${document.markdown}${watermark}`, html: content });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Export failed." }, { status: 400 });
  }
}
