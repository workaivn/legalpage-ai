import { businessTypes, targetMarkets, type GeneratorFormData } from "@/lib/types";

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateGeneratorData(input: unknown): GeneratorFormData {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid request body.");
  }

  const data = input as Partial<GeneratorFormData>;
  const requiredFields: Array<keyof GeneratorFormData> = [
    "projectName",
    "websiteUrl",
    "businessType",
    "country",
    "contactEmail",
    "refundPolicyType",
    "targetMarket",
  ];

  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== "string") {
      throw new Error(`Missing required field: ${field}.`);
    }
  }

  if (!businessTypes.includes(data.businessType as GeneratorFormData["businessType"])) {
    throw new Error("Invalid business type.");
  }

  if (!targetMarkets.includes(data.targetMarket as GeneratorFormData["targetMarket"])) {
    throw new Error("Invalid target market.");
  }

  if (!validateEmail(data.contactEmail!)) {
    throw new Error("Enter a valid contact email.");
  }

  return {
    projectName: data.projectName!.trim(),
    websiteUrl: data.websiteUrl!.trim(),
    businessType: data.businessType as GeneratorFormData["businessType"],
    country: data.country!.trim(),
    contactEmail: data.contactEmail!.trim(),
    collectsPersonalData: Boolean(data.collectsPersonalData),
    usesCookies: Boolean(data.usesCookies),
    analyticsProvider: String(data.analyticsProvider || "Not specified").trim(),
    paymentProvider: String(data.paymentProvider || "Not specified").trim(),
    refundPolicyType: data.refundPolicyType!.trim(),
    targetMarket: data.targetMarket as GeneratorFormData["targetMarket"],
    extraNotes: String(data.extraNotes || "").trim(),
  };
}
