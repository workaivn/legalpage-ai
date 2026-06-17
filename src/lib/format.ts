import type { GeneratedDocument } from "@/lib/types";

export const legalDisclaimer =
  "This document is AI-generated and does not constitute legal advice. You should review it with a qualified legal professional before publishing or relying on it.";

export function documentsToMarkdown(documents: GeneratedDocument[]) {
  return documents.map((document) => document.markdown.trim()).join("\n\n---\n\n");
}

export function documentsToHtml(documents: GeneratedDocument[]) {
  const body = documents
    .map(
      (document) => `
<article>
${document.html}
</article>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Legal Pages</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.65; color: #172033; max-width: 860px; margin: 48px auto; padding: 0 20px; }
    article { border-bottom: 1px solid #e5e7eb; padding-bottom: 32px; margin-bottom: 32px; }
    h1, h2, h3 { line-height: 1.2; color: #101827; }
    p, li { color: #384152; }
    .disclaimer { border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 12px; padding: 16px; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

export function markdownToBasicHtml(markdown: string) {
  const escaped = escapeHtml(markdown);
  const lines = escaped.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h3>${line.slice(4)}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h2>${line.slice(3)}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h1>${line.slice(2)}</h1>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${line.slice(2)}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    const className = line.includes("does not constitute legal advice") ? ' class="disclaimer"' : "";
    html.push(`<p${className}>${line}</p>`);
  }

  if (inList) {
    html.push("</ul>");
  }

  return html.join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
