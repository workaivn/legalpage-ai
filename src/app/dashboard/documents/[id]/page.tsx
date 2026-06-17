import { notFound } from "next/navigation";
import { updateDocumentAction } from "@/app/actions/documents";
import { DocumentExportButtons } from "@/components/DocumentExportButtons";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const db = await readDb();
  const document = db.documents.find((item) => item.id === id && (item.userId === user.id || user.role === "admin"));
  if (!document) notFound();

  return (
    <>
      <PageHeader title="Edit Document" description="Update the saved draft content and publishing status." action={<DocumentExportButtons document={document} />} />
      <form action={updateDocumentAction} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <input type="hidden" name="id" value={document.id} />
        <label>
          <span className="text-sm font-medium">Title</span>
          <input name="title" defaultValue={document.title} className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </label>
        <label>
          <span className="text-sm font-medium">Status</span>
          <select name="status" defaultValue={document.status} className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option>Draft</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-medium">Markdown</span>
          <textarea name="markdown" defaultValue={document.markdown} className="mt-2 min-h-[520px] w-full rounded-lg border-slate-300 font-mono text-sm dark:border-slate-700 dark:bg-slate-900" />
        </label>
        <button className="w-fit rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Save changes</button>
      </form>
    </>
  );
}
