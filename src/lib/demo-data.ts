import { legalDisclaimer, markdownToBasicHtml } from "@/lib/format";
import type { AppDatabase, BillingSettings, CreditSettings, DocumentRecord, LegalTemplate, ProviderSettings, User } from "@/lib/types";

type CommerceDemoData = Pick<
  AppDatabase,
  | "subscriptions"
  | "invoices"
  | "creditTransactions"
  | "teams"
  | "teamMembers"
  | "coupons"
  | "referrals"
  | "affiliatePayouts"
  | "whiteLabels"
  | "onboardingProfiles"
  | "billingSettings"
  | "creditSettings"
  | "emailLogs"
  | "auditLogs"
>;

const now = new Date().toISOString();

export const demoPassword = "password123";

export const demoUsers: User[] = [
  {
    id: "usr_admin",
    name: "Avery Admin",
    email: "admin@legalpage.ai",
    passwordHash: "",
    role: "admin",
    createdAt: now,
  },
  {
    id: "usr_demo",
    name: "Maya Founder",
    email: "demo@legalpage.ai",
    passwordHash: "",
    role: "user",
    createdAt: now,
  },
];

export const defaultSettings: ProviderSettings = {
  activeProvider: "openai",
  openaiModel: "gpt-4o-mini",
  geminiModel: "gemini-1.5-flash",
  anthropicModel: "claude-3-5-haiku-latest",
};

export const defaultBillingSettings: BillingSettings = {
  stripePriceIds: {
    pro: "price_replace_with_stripe_pro",
    agency: "price_replace_with_stripe_agency",
  },
  lemonSqueezyVariantIds: {
    pro: "replace_with_lemon_pro_variant",
    agency: "replace_with_lemon_agency_variant",
  },
  defaultProvider: "stripe",
  commissionRate: 20,
};

export const defaultCreditSettings: CreditSettings = {
  generationCost: 1,
  pdfExportCost: 1,
};

export const demoTemplates: LegalTemplate[] = [
  {
    id: "tpl_saas_startup",
    name: "SaaS Startup Pack",
    category: "SaaS",
    description: "Policies for subscription software with accounts, analytics, payments, and support workflows.",
    documentTypes: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy", "Data Processing Agreement"],
    tone: "Direct, founder-friendly, commercially balanced",
    popularity: 96,
    isFeatured: true,
    formDefaults: {
      businessType: "SaaS",
      refundPolicyType: "14-day refund window for first subscription payments",
      targetMarket: "Global",
      analyticsProvider: "Plausible or Google Analytics",
      paymentProvider: "Stripe",
    },
    createdAt: now,
  },
  {
    id: "tpl_ai_startup",
    name: "AI Product Compliance Pack",
    category: "AI Startup",
    description: "AI-specific terms, usage rules, disclaimers, privacy language, and acceptable use restrictions.",
    documentTypes: ["Privacy Policy", "Terms of Service", "AI Usage Policy", "Acceptable Use Policy", "Disclaimer"],
    tone: "Professional, cautious, transparent",
    popularity: 92,
    isFeatured: true,
    formDefaults: {
      businessType: "AI Tool",
      refundPolicyType: "Refunds reviewed case by case for billing errors",
      targetMarket: "Global",
      extraNotes: "AI features may generate outputs that require user review.",
    },
    createdAt: now,
  },
  {
    id: "tpl_ecommerce",
    name: "Ecommerce Store Pack",
    category: "Ecommerce",
    description: "Storefront-ready pages covering orders, refunds, cookies, payments, shipping, and customer data.",
    documentTypes: ["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"],
    tone: "Clear, customer-friendly, practical",
    popularity: 88,
    isFeatured: true,
    formDefaults: {
      businessType: "Ecommerce",
      refundPolicyType: "30-day returns for unused physical products",
      paymentProvider: "Stripe, PayPal, or Shopify Payments",
    },
    createdAt: now,
  },
  {
    id: "tpl_mobile_app",
    name: "Mobile App Pack",
    category: "Mobile App",
    description: "App policy drafts for account data, device permissions, subscriptions, analytics, and app stores.",
    documentTypes: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"],
    tone: "Plain English, app-store friendly",
    popularity: 81,
    isFeatured: false,
    formDefaults: {
      businessType: "Mobile App",
      refundPolicyType: "Refunds handled by the relevant app store where applicable",
      targetMarket: "Global",
    },
    createdAt: now,
  },
  {
    id: "tpl_agency",
    name: "Digital Agency Pack",
    category: "Agency",
    description: "Legal pages for agencies collecting leads, running analytics, publishing case studies, and selling services.",
    documentTypes: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"],
    tone: "Premium, service-business oriented",
    popularity: 74,
    isFeatured: false,
    formDefaults: {
      businessType: "Other",
      refundPolicyType: "Service fees are non-refundable after work begins",
    },
    createdAt: now,
  },
  {
    id: "tpl_blog_affiliate",
    name: "Blog and Affiliate Pack",
    category: "Blog",
    description: "Publishing policies for newsletters, analytics, affiliate links, cookies, and copyright notices.",
    documentTypes: ["Privacy Policy", "Cookie Policy", "Affiliate Disclosure", "Copyright Notice", "Disclaimer"],
    tone: "Friendly, transparent, reader-first",
    popularity: 79,
    isFeatured: false,
    formDefaults: {
      businessType: "Blog",
      refundPolicyType: "Digital downloads are non-refundable unless required by law",
      extraNotes: "The site may use affiliate links and sponsored content.",
    },
    createdAt: now,
  },
  {
    id: "tpl_marketplace",
    name: "Marketplace Platform Pack",
    category: "Marketplace",
    description: "Marketplace policies for buyer-seller transactions, platform rules, payments, content, and dispute handling.",
    documentTypes: ["Privacy Policy", "Terms of Service", "Acceptable Use Policy", "Cookie Policy", "Refund Policy"],
    tone: "Firm, clear, platform-oriented",
    popularity: 84,
    isFeatured: false,
    formDefaults: {
      businessType: "Other",
      refundPolicyType: "Refunds depend on seller terms and platform dispute rules",
      paymentProvider: "Stripe Connect",
    },
    createdAt: now,
  },
];

export function createSeedDatabase(passwordHash: string): AppDatabase {
  const users = demoUsers.map((user) => ({ ...user, passwordHash }));
  const documents = createDemoDocuments();
  const commerce = createCommerceDemoData();

  return {
    users,
    sessions: [],
    documents,
    templates: demoTemplates,
    settings: defaultSettings,
    analytics: [
      { id: "evt_1", userId: "usr_demo", type: "generation", provider: "openai", templateId: "tpl_saas_startup", createdAt: daysAgo(2) },
      { id: "evt_2", userId: "usr_demo", type: "export", provider: "openai", templateId: "tpl_saas_startup", createdAt: daysAgo(1) },
      { id: "evt_3", userId: "usr_admin", type: "generation", provider: "gemini", templateId: "tpl_ai_startup", createdAt: daysAgo(10) },
    ],
    ...commerce,
  };
}

export function createCommerceDemoData(): CommerceDemoData {
  return {
    subscriptions: [
      {
        id: "sub_demo_pro",
        userId: "usr_demo",
        planId: "pro",
        provider: "manual",
        status: "active",
        currentPeriodStart: daysAgo(8),
        currentPeriodEnd: daysFromNow(22),
        cancelAtPeriodEnd: false,
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
      },
      {
        id: "sub_admin_agency",
        userId: "usr_admin",
        planId: "agency",
        provider: "manual",
        status: "active",
        currentPeriodStart: daysAgo(4),
        currentPeriodEnd: daysFromNow(26),
        cancelAtPeriodEnd: false,
        createdAt: daysAgo(4),
        updatedAt: daysAgo(4),
      },
    ],
    invoices: [
      { id: "inv_demo_1", userId: "usr_demo", subscriptionId: "sub_demo_pro", provider: "manual", amount: 2900, currency: "USD", status: "paid", createdAt: daysAgo(8) },
      { id: "inv_admin_1", userId: "usr_admin", subscriptionId: "sub_admin_agency", provider: "manual", amount: 7900, currency: "USD", status: "paid", createdAt: daysAgo(4) },
    ],
    creditTransactions: [
      { id: "cr_demo_grant", userId: "usr_demo", amount: 1000, reason: "monthly_grant", createdAt: daysAgo(8) },
      { id: "cr_demo_gen", userId: "usr_demo", amount: -3, reason: "generation", createdAt: daysAgo(2) },
      { id: "cr_admin_grant", userId: "usr_admin", amount: 2500, reason: "monthly_grant", createdAt: daysAgo(4) },
    ],
    teams: [{ id: "team_admin", ownerId: "usr_admin", name: "Avery Legal Studio", createdAt: daysAgo(3) }],
    teamMembers: [{ id: "tm_admin_owner", teamId: "team_admin", userId: "usr_admin", email: "admin@legalpage.ai", role: "owner", status: "active", createdAt: daysAgo(3) }],
    coupons: [
      { id: "coupon_launch25", code: "LAUNCH25", type: "percentage", amount: 25, expiresAt: daysFromNow(60), usageLimit: 100, usedCount: 4, active: true, createdAt: daysAgo(6) },
      { id: "coupon_agency10", code: "AGENCY10", type: "fixed", amount: 1000, usageLimit: 25, usedCount: 1, active: true, createdAt: daysAgo(2) },
    ],
    referrals: [
      { id: "ref_demo_1", referrerUserId: "usr_demo", email: "founder@example.com", status: "clicked", commissionAmount: 0, createdAt: daysAgo(3) },
      { id: "ref_demo_2", referrerUserId: "usr_demo", referredUserId: "usr_admin", status: "converted", commissionAmount: 1580, createdAt: daysAgo(1) },
    ],
    affiliatePayouts: [{ id: "pay_demo_1", userId: "usr_demo", amount: 1580, status: "pending", createdAt: daysAgo(1) }],
    whiteLabels: [
      {
        userId: "usr_admin",
        companyName: "Avery Legal Studio",
        primaryColor: "#2563eb",
        accentColor: "#7c3aed",
        removeBranding: true,
        updatedAt: daysAgo(1),
      },
    ],
    onboardingProfiles: [
      { userId: "usr_demo", businessType: "SaaS", country: "United States", aiProvider: "openai", preferredTemplates: ["tpl_saas_startup"], completedAt: daysAgo(8) },
      { userId: "usr_admin", businessType: "AI Tool", country: "United States", aiProvider: "openai", preferredTemplates: ["tpl_ai_startup"], completedAt: daysAgo(4) },
    ],
    billingSettings: defaultBillingSettings,
    creditSettings: defaultCreditSettings,
    emailLogs: [
      { id: "email_demo_welcome", userId: "usr_demo", to: "demo@legalpage.ai", type: "welcome", subject: "Welcome to LegalPage AI", body: "Your workspace is ready.", status: "sent", createdAt: daysAgo(8) },
    ],
    auditLogs: [
      { id: "audit_seed", action: "seed.database", targetType: "system", metadata: { version: 1 }, createdAt: now },
    ],
  };
}

function createDemoDocuments(): DocumentRecord[] {
  const docs = [
    {
      id: "doc_privacy_demo",
      title: "NimbusCRM Privacy Policy",
      type: "Privacy Policy" as const,
      status: "Published" as const,
      projectName: "NimbusCRM",
      templateId: "tpl_saas_startup",
      provider: "openai" as const,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1),
    },
    {
      id: "doc_ai_policy_demo",
      title: "PromptDesk AI Usage Policy",
      type: "AI Usage Policy" as const,
      status: "Draft" as const,
      projectName: "PromptDesk",
      templateId: "tpl_ai_startup",
      provider: "gemini" as const,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(3),
    },
    {
      id: "doc_refund_demo",
      title: "LumaShop Refund Policy",
      type: "Refund Policy" as const,
      status: "Archived" as const,
      projectName: "LumaShop",
      templateId: "tpl_ecommerce",
      provider: "anthropic" as const,
      createdAt: daysAgo(27),
      updatedAt: daysAgo(20),
    },
  ];

  return docs.map((doc) => {
    const markdown = `# ${doc.title}\n\n${legalDisclaimer}\n\n## Overview\nThis demo document shows how LegalPage AI stores, edits, exports, and manages generated legal pages for ${doc.projectName}.\n\n## Contact\nQuestions can be sent to hello@example.com.\n\n## Review\nReview this AI-generated draft with a qualified professional before publishing.`;

    return {
      ...doc,
      userId: doc.id === "doc_ai_policy_demo" ? "usr_admin" : "usr_demo",
      markdown,
      html: markdownToBasicHtml(markdown),
      formData: {
        projectName: doc.projectName,
        websiteUrl: "https://example.com",
        businessType: doc.templateId === "tpl_ai_startup" ? "AI Tool" : doc.templateId === "tpl_ecommerce" ? "Ecommerce" : "SaaS",
        country: "United States",
        contactEmail: "hello@example.com",
        collectsPersonalData: true,
        usesCookies: true,
        analyticsProvider: "Plausible",
        paymentProvider: "Stripe",
        refundPolicyType: "14-day refund window",
        targetMarket: "Global",
        extraNotes: "Demo content included for marketplace preview.",
      },
    };
  });
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}
