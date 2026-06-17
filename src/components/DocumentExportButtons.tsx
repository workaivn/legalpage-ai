"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import type { DocumentRecord } from "@/lib/types";

export function DocumentExportButtons({ document }: { document: Pick<DocumentRecord, "id" | "title" | "markdown" | "html"> }) {
  const [error, setError] = useState("");

  function downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function fetchExport(format: "markdown" | "html" | "pdf") {
    setError("");
    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: document.id, format }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Export failed.");
      throw new Error(payload.error || "Export failed.");
    }
    return payload as { title: string; markdown: string; html: string };
  }

  async function downloadPdf() {
    const payload = await fetchExport("pdf");
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 56;
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const lines = pdf.splitTextToSize(payload.markdown.replace(/^#\s+/gm, ""), width - margin * 2);
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(document.title, margin, y);
    y += 32;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(75);

    for (const line of lines) {
      if (y > height - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += 15;
    }
    pdf.save(`${slugify(document.title)}.pdf`);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={async () => { const payload = await fetchExport("markdown"); downloadFile(`${slugify(document.title)}.md`, payload.markdown, "text/markdown"); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-800">
          <Download className="h-4 w-4" /> Markdown
        </button>
        <button type="button" onClick={async () => { const payload = await fetchExport("html"); downloadFile(`${slugify(document.title)}.html`, payload.html, "text/html"); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-800">
          <Download className="h-4 w-4" /> HTML
        </button>
        <button type="button" onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          <Download className="h-4 w-4" /> PDF
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
