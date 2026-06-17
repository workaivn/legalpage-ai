import type { GeneratorFormData } from "@/lib/types";

export const emptyFormData: GeneratorFormData = {
  projectName: "",
  websiteUrl: "",
  businessType: "SaaS",
  country: "",
  contactEmail: "",
  collectsPersonalData: true,
  usesCookies: true,
  analyticsProvider: "",
  paymentProvider: "",
  refundPolicyType: "Standard 14-day refund window",
  targetMarket: "Global",
  extraNotes: "",
};
