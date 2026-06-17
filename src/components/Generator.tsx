"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Download, FileCode2, Loader2, RefreshCw } from "lucide-react";
import {
  businessTypes,
  documentTypes,
  targetMarkets,
  type DocumentType,
  type GeneratedDocument,
  type GenerateResponse,
  type GeneratorFormData,
} from "@/lib/types";
import { emptyFormData } from "@/lib/defaults";
import { documentsToHtml, documentsToMarkdown, legalDisclaimer } from "@/lib/format";

export function Generator({
  initialFormData,
  initialDocumentTypes,
  templateId,
  dashboard = false,
  allowPdfExport = false,
}: {
  initialFormData?: Partial<GeneratorFormData>;
  initialDocumentTypes?: DocumentType[];
  templateId?: string;
  dashboard?: boolean;
  allowPdfExport?: boolean;
}) {
  const [formData, setFormData] = useState<GeneratorFormData>({ ...emptyFormData, ...initialFormData });
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>(
    initialDocumentTypes?.length ? initialDocumentTypes : ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"]
  );
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedTitle, setCopiedTitle] = useState("");

  const activeDocument = documents[activeTab];
  const canSubmit = useMemo(
    () =>
      formData.projectName.trim() &&
      formData.websiteUrl.trim() &&
      formData.country.trim() &&
      formData.contactEmail.trim() &&
      selectedTypes.length > 0,
    [formData, selectedTypes]
  );

  async function submitForm(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    setSuccess("");
    setCopiedTitle("");

    if (!canSubmit) {
      setError("Complete the required fields and select at least one document type.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, documentTypes: selectedTypes, templateId }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate legal pages.");
      }

      const data = payload as GenerateResponse;
      setDocuments(data.documents);
      setActiveTab(0);
      setSuccess(data.savedDocumentIds?.length ? `Generated and saved ${data.savedDocumentIds.length} documents.` : "Generated documents successfully.");
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Unable to generate legal pages.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyDocument(document: GeneratedDocument) {
    await navigator.clipboard.writeText(document.markdown);
    setCopiedTitle(document.title);
    window.setTimeout(() => setCopiedTitle(""), 1800);
  }

  function downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPdf(document: GeneratedDocument) {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 56;
    const lines = pdf.splitTextToSize(document.markdown.replace(/^#\s+/gm, ""), pageWidth - margin * 2);
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(document.title, margin, y);
    y += 30;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(80);

    for (const line of lines) {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += 15;
    }

    pdf.save(`${slugify(document.title)}.pdf`);
  }

  function updateField<K extends keyof GeneratorFormData>(field: K, value: GeneratorFormData[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function toggleType(type: DocumentType) {
    setSelectedTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  }

  return (
    <section id="generator" className={dashboard ? "" : "border-y border-slate-200 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-950 sm:py-20"}>
      <div className={dashboard ? "" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
        {!dashboard ? (
          <div className="mb-9 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Generator</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Tell LegalPage AI what you are building
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Generate editable drafts for the legal pages modern products need. Every output includes the AI disclaimer
              and should be reviewed before publishing.
            </p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <form onSubmit={submitForm} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Project name" value={formData.projectName} onChange={(value) => updateField("projectName", value)} placeholder="Acme Cloud" required />
              <TextField label="Website URL" value={formData.websiteUrl} onChange={(value) => updateField("websiteUrl", value)} placeholder="https://example.com" required />
              <SelectField label="Business type" value={formData.businessType} options={businessTypes} onChange={(value) => updateField("businessType", value as GeneratorFormData["businessType"])} />
              <TextField label="Country" value={formData.country} onChange={(value) => updateField("country", value)} placeholder="United States" required />
              <TextField label="Contact email" value={formData.contactEmail} onChange={(value) => updateField("contactEmail", value)} placeholder="hello@example.com" required />
              <SelectField label="Target market" value={formData.targetMarket} options={targetMarkets} onChange={(value) => updateField("targetMarket", value as GeneratorFormData["targetMarket"])} />
              <TextField label="Analytics provider" value={formData.analyticsProvider} onChange={(value) => updateField("analyticsProvider", value)} placeholder="Google Analytics, Plausible" />
              <TextField label="Payment provider" value={formData.paymentProvider} onChange={(value) => updateField("paymentProvider", value)} placeholder="Stripe, Paddle, PayPal" />
              <TextField label="Refund policy type" value={formData.refundPolicyType} onChange={(value) => updateField("refundPolicyType", value)} placeholder="No refunds after purchase" />
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <ToggleField label="Collects personal data" checked={formData.collectsPersonalData} onChange={(value) => updateField("collectsPersonalData", value)} />
                <ToggleField label="Uses cookies" checked={formData.usesCookies} onChange={(value) => updateField("usesCookies", value)} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Documents to generate</span>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {documentTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
                    <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Extra notes</span>
              <textarea value={formData.extraNotes} onChange={(event) => updateField("extraNotes", event.target.value)} className="mt-2 min-h-28 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900" placeholder="Mention user accounts, subscriptions, AI features, shipping limits, or anything specific." />
            </label>
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
              {legalDisclaimer}
            </div>
            {error ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                <span>{error}</span>
              </div>
            ) : null}
            {success ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                <span>{success}</span>
              </div>
            ) : null}
            <button type="submit" disabled={isLoading || !canSubmit} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileCode2 className="h-4 w-4" aria-hidden="true" />}
              {isLoading ? "Generating legal pages..." : "Generate Legal Pages"}
            </button>
          </form>

          <div className="min-h-[640px] rounded-xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950 sm:p-6">
            {documents.length ? (
              <div className="flex h-full flex-col">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {documents.map((document, index) => (
                      <button key={document.title} type="button" onClick={() => setActiveTab(index)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === index ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                        {document.title}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => submitForm()} disabled={isLoading} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                    Regenerate
                  </button>
                </div>

                {activeDocument ? (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ActionButton onClick={() => copyDocument(activeDocument)} icon={<Copy className="h-4 w-4" />}>{copiedTitle === activeDocument.title ? "Copied" : "Copy"}</ActionButton>
                      <ActionButton onClick={() => downloadFile(`${slugify(activeDocument.title)}.md`, activeDocument.markdown, "text/markdown")} icon={<Download className="h-4 w-4" />}>Markdown</ActionButton>
                      <ActionButton onClick={() => downloadFile(`${slugify(activeDocument.title)}.html`, activeDocument.html, "text/html")} icon={<Download className="h-4 w-4" />}>HTML</ActionButton>
                      {allowPdfExport ? <ActionButton onClick={() => downloadPdf(activeDocument)} icon={<Download className="h-4 w-4" />}>PDF</ActionButton> : null}
                      <ActionButton dark onClick={() => downloadFile("legal-pages.md", documentsToMarkdown(documents), "text/markdown")} icon={<Download className="h-4 w-4" />}>All Markdown</ActionButton>
                      <ActionButton dark onClick={() => downloadFile("legal-pages.html", documentsToHtml(documents), "text/html")} icon={<Download className="h-4 w-4" />}>All HTML</ActionButton>
                    </div>
                    <div className="mt-5 flex-1 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                      <pre className="h-full min-h-[440px] overflow-auto whitespace-pre-wrap bg-slate-950 p-5 text-sm leading-7 text-slate-100">
                        {activeDocument.markdown}
                      </pre>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="flex h-full min-h-[590px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-white text-blue-700 shadow-sm dark:bg-slate-950">
                  <FileCode2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">Your documents will appear here</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Fill in the generator form to create editable legal page drafts. Logged-in users automatically save generated documents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}{required ? <span className="text-blue-700"> *</span> : null}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900" placeholder={placeholder} required={required} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm font-medium text-slate-800 dark:text-slate-200">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
    </label>
  );
}

function ActionButton({ children, icon, onClick, dark = false }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; dark?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${dark ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"}`}>
      {icon}
      {children}
    </button>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
