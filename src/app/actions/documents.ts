"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { markdownToBasicHtml } from "@/lib/format";
import { createId } from "@/lib/security";
import { updateDb } from "@/lib/store";
import { documentStatuses, type DocumentStatus } from "@/lib/types";

export async function updateDocumentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const status = String(formData.get("status") || "Draft") as DocumentStatus;
  const markdown = String(formData.get("markdown") || "").trim();

  if (!title || !markdown || !documentStatuses.includes(status)) {
    throw new Error("Title, status, and content are required.");
  }

  await updateDb((db) => {
    const document = db.documents.find((item) => item.id === id && item.userId === user.id);
    if (!document) {
      throw new Error("Document not found.");
    }

    document.title = title;
    document.status = status;
    document.markdown = markdown;
    document.html = markdownToBasicHtml(markdown);
    document.updatedAt = new Date().toISOString();
  });

  revalidatePath("/dashboard/documents");
}

export async function deleteDocumentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");

  await updateDb((db) => {
    db.documents = db.documents.filter((document) => !(document.id === id && document.userId === user.id));
  });

  revalidatePath("/dashboard/documents");
}

export async function duplicateDocumentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");

  await updateDb((db) => {
    const document = db.documents.find((item) => item.id === id && item.userId === user.id);
    if (!document) {
      throw new Error("Document not found.");
    }

    const now = new Date().toISOString();
    db.documents.unshift({
      ...document,
      id: createId("doc"),
      title: `${document.title} Copy`,
      status: "Draft",
      createdAt: now,
      updatedAt: now,
    });
  });

  revalidatePath("/dashboard/documents");
}
