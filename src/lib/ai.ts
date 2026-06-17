import "server-only";

import OpenAI from "openai";
import { documentTypes, type DocumentType, type GeneratedDocument, type GeneratorFormData, type ProviderSettings, type ProviderType } from "@/lib/types";
import { legalDisclaimer, markdownToBasicHtml } from "@/lib/format";

type ModelDocument = {
  title: string;
  markdown: string;
};

export async function generateDocumentsWithProvider({
  formData,
  settings,
  requestedDocuments = documentTypes,
}: {
  formData: GeneratorFormData;
  settings: ProviderSettings;
  requestedDocuments?: readonly DocumentType[];
}) {
  const provider = settings.activeProvider;
  const prompt = buildPrompt(formData, requestedDocuments);
  const content =
    provider === "openai"
      ? await callOpenAI(prompt, settings)
      : provider === "gemini"
        ? await callGemini(prompt, settings)
        : await callAnthropic(prompt, settings);

  const parsed = JSON.parse(content) as { documents?: ModelDocument[] };
  return {
    provider,
    documents: normalizeDocuments(parsed.documents || [], requestedDocuments),
  };
}

function buildPrompt(formData: GeneratorFormData, requestedDocuments: readonly DocumentType[]) {
  return `
Create legal page drafts for this project:

Project name: ${formData.projectName}
Website URL: ${formData.websiteUrl}
Business type: ${formData.businessType}
Country: ${formData.country}
Contact email: ${formData.contactEmail}
Collects personal data: ${formData.collectsPersonalData ? "Yes" : "No"}
Uses cookies: ${formData.usesCookies ? "Yes" : "No"}
Analytics provider: ${formData.analyticsProvider || "Not specified"}
Payment provider: ${formData.paymentProvider || "Not specified"}
Refund policy type: ${formData.refundPolicyType}
Target market: ${formData.targetMarket}
Extra notes: ${formData.extraNotes || "None"}

Generate these exact documents:
${requestedDocuments.map((item) => `- ${item}`).join("\n")}

Rules:
- English only.
- Include this exact disclaimer near the top of every document: "${legalDisclaimer}"
- Do not say the documents are legally guaranteed, lawyer-approved, compliant, or sufficient.
- Use Markdown.
- Use clear sections, concise clauses, and practical placeholders only when unavoidable.
- Tailor data, cookies, analytics, payments, refunds, AI usage, GDPR, affiliate, copyright, DPA, and marketplace language to the form input where relevant.
- Return JSON only in this exact shape:
{
  "documents": [
    { "title": "Privacy Policy", "markdown": "# Privacy Policy\\n..." }
  ]
}`;
}

async function callOpenAI(prompt: string, settings: ProviderSettings) {
  const apiKey = settings.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is missing. Add it in Settings or .env.");
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: settings.openaiModel || "gpt-4o-mini",
    temperature: 0.35,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You generate practical English-only legal page drafts for small digital businesses. You are careful, plain-spoken, and never claim legal certainty. Return only valid JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }
  return content;
}

async function callGemini(prompt: string, settings: ProviderSettings) {
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add it in Settings or .env.");
  }

  const model = settings.geminiModel || "gemini-1.5-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      generationConfig: { temperature: 0.35, responseMimeType: "application/json" },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    throw new Error("Gemini could not generate documents. Check your API key and model.");
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("No content returned from Gemini.");
  }
  return content as string;
}

async function callAnthropic(prompt: string, settings: ProviderSettings) {
  const apiKey = settings.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic API key is missing. Add it in Settings or .env.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: settings.anthropicModel || "claude-3-5-haiku-latest",
      max_tokens: 5000,
      temperature: 0.35,
      system:
        "You generate practical English-only legal page drafts for small digital businesses. You are careful, plain-spoken, and never claim legal certainty. Return only valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error("Anthropic could not generate documents. Check your API key and model.");
  }

  const data = await response.json();
  const content = data.content?.find((part: { type: string; text?: string }) => part.type === "text")?.text;
  if (!content) {
    throw new Error("No content returned from Anthropic.");
  }
  return content as string;
}

export function normalizeDocuments(modelDocuments: ModelDocument[], requestedDocuments: readonly DocumentType[]): GeneratedDocument[] {
  return requestedDocuments.map((title) => {
    const found = modelDocuments.find((document) => document.title === title);
    const markdown = ensureDisclaimer(found?.markdown || `# ${title}\n\n${legalDisclaimer}`);

    return {
      title,
      markdown,
      html: markdownToBasicHtml(markdown),
    };
  });
}

function ensureDisclaimer(markdown: string) {
  if (markdown.includes(legalDisclaimer)) {
    return markdown;
  }

  const lines = markdown.trim().split("\n");
  const [firstLine, ...rest] = lines;
  if (firstLine?.startsWith("# ")) {
    return [firstLine, "", legalDisclaimer, "", ...rest].join("\n");
  }

  return `${legalDisclaimer}\n\n${markdown.trim()}`;
}

export function normalizeProviderError(error: unknown, provider?: ProviderType) {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return "OpenAI rejected the API key. Check Settings or OPENAI_API_KEY, then try again.";
    }

    if (error.status === 429) {
      return "OpenAI rate limits or quota prevented generation. Check billing, limits, and usage.";
    }
  }

  if (error instanceof Error) {
    const message = error.message.replace(/sk-[A-Za-z0-9_-]+/g, "sk-****");
    return message;
  }

  return `${provider || "AI provider"} could not generate the documents right now.`;
}
