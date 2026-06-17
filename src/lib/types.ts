export const businessTypes = ["SaaS", "Mobile App", "Ecommerce", "Blog", "AI Tool", "Other"] as const;
export const targetMarkets = ["Global", "US", "EU", "UK", "Canada", "Australia"] as const;
export const templateCategories = ["SaaS", "Mobile App", "Ecommerce", "AI Startup", "Agency", "Blog", "Marketplace"] as const;
export const documentTypes = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Refund Policy",
  "GDPR Compliance Notice",
  "Disclaimer",
  "Acceptable Use Policy",
  "Data Processing Agreement",
  "AI Usage Policy",
  "Affiliate Disclosure",
  "Copyright Notice",
] as const;
export const providerTypes = ["openai", "gemini", "anthropic"] as const;
export const documentStatuses = ["Draft", "Published", "Archived"] as const;
export const planIds = ["free", "pro", "agency"] as const;
export const billingProviders = ["stripe", "lemonsqueezy"] as const;
export const subscriptionStatuses = ["trialing", "active", "past_due", "canceled", "expired"] as const;
export const invoiceStatuses = ["paid", "open", "failed", "void"] as const;
export const couponTypes = ["percentage", "fixed"] as const;

export type BusinessType = (typeof businessTypes)[number];
export type TargetMarket = (typeof targetMarkets)[number];
export type DocumentType = (typeof documentTypes)[number];
export type TemplateCategory = (typeof templateCategories)[number];
export type ProviderType = (typeof providerTypes)[number];
export type DocumentStatus = (typeof documentStatuses)[number];
export type UserRole = "user" | "admin";
export type PlanId = (typeof planIds)[number];
export type BillingProvider = (typeof billingProviders)[number];
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];
export type InvoiceStatus = (typeof invoiceStatuses)[number];
export type CouponType = (typeof couponTypes)[number];

export type GeneratorFormData = {
  projectName: string;
  websiteUrl: string;
  businessType: BusinessType;
  country: string;
  contactEmail: string;
  collectsPersonalData: boolean;
  usesCookies: boolean;
  analyticsProvider: string;
  paymentProvider: string;
  refundPolicyType: string;
  targetMarket: TargetMarket;
  extraNotes: string;
};

export type GeneratedDocument = {
  title: DocumentType;
  markdown: string;
  html: string;
};

export type GenerateResponse = {
  documents: GeneratedDocument[];
  generatedAt: string;
  provider: ProviderType;
  savedDocumentIds?: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  onboardingCompleted?: boolean;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  resetToken?: string;
  resetExpiresAt?: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: string;
};

export type DocumentRecord = {
  id: string;
  userId: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  projectName: string;
  templateId?: string;
  provider: ProviderType;
  markdown: string;
  html: string;
  formData: GeneratorFormData;
  createdAt: string;
  updatedAt: string;
};

export type LegalTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  documentTypes: DocumentType[];
  tone: string;
  popularity: number;
  isFeatured: boolean;
  formDefaults: Partial<GeneratorFormData>;
  createdAt: string;
};

export type ProviderSettings = {
  activeProvider: ProviderType;
  openaiApiKey?: string;
  openaiModel: string;
  geminiApiKey?: string;
  geminiModel: string;
  anthropicApiKey?: string;
  anthropicModel: string;
};

export type BillingPlan = {
  id: PlanId;
  name: string;
  priceMonthly: number;
  generationsPerMonth: number | "unlimited";
  creditsPerMonth: number;
  basicTemplatesOnly: boolean;
  watermarkExports: boolean;
  pdfExport: boolean;
  priorityModels: boolean;
  teamWorkspace: boolean;
  whiteLabel: boolean;
  removeBranding: boolean;
};

export type Subscription = {
  id: string;
  userId: string;
  planId: PlanId;
  provider: BillingProvider | "manual";
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  userId: string;
  subscriptionId?: string;
  provider: BillingProvider | "manual";
  providerInvoiceId?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  hostedInvoiceUrl?: string;
  createdAt: string;
};

export type CreditTransaction = {
  id: string;
  userId: string;
  amount: number;
  reason: "monthly_grant" | "generation" | "pdf_export" | "admin_adjustment" | "subscription_change";
  documentId?: string;
  createdAt: string;
};

export type Team = {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  teamId: string;
  userId?: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "active" | "invited";
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  amount: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
};

export type Referral = {
  id: string;
  referrerUserId: string;
  referredUserId?: string;
  email?: string;
  status: "clicked" | "signed_up" | "converted" | "paid";
  commissionAmount: number;
  createdAt: string;
};

export type AffiliatePayout = {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
};

export type WhiteLabelSettings = {
  userId: string;
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  removeBranding: boolean;
  updatedAt: string;
};

export type OnboardingProfile = {
  userId: string;
  businessType: BusinessType;
  country: string;
  aiProvider: ProviderType;
  preferredTemplates: string[];
  completedAt: string;
};

export type BillingSettings = {
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  stripePriceIds: Record<Exclude<PlanId, "free">, string>;
  lemonSqueezyApiKey?: string;
  lemonSqueezyStoreId?: string;
  lemonSqueezyVariantIds: Record<Exclude<PlanId, "free">, string>;
  defaultProvider: BillingProvider;
  commissionRate: number;
};

export type CreditSettings = {
  generationCost: number;
  pdfExportCost: number;
};

export type EmailLog = {
  id: string;
  userId?: string;
  to: string;
  type: "welcome" | "trial_ending" | "subscription_success" | "payment_failed" | "password_reset";
  subject: string;
  body: string;
  status: "queued" | "sent";
  createdAt: string;
};

export type AuditLog = {
  id: string;
  userId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
};

export type AnalyticsEvent = {
  id: string;
  userId?: string;
  type:
    | "generation"
    | "export"
    | "login"
    | "register"
    | "template_start"
    | "checkout"
    | "subscription_change"
    | "coupon_applied"
    | "referral"
    | "team_invite";
  provider?: ProviderType;
  templateId?: string;
  createdAt: string;
};

export type AppDatabase = {
  users: User[];
  sessions: Session[];
  documents: DocumentRecord[];
  templates: LegalTemplate[];
  settings: ProviderSettings;
  analytics: AnalyticsEvent[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  creditTransactions: CreditTransaction[];
  teams: Team[];
  teamMembers: TeamMember[];
  coupons: Coupon[];
  referrals: Referral[];
  affiliatePayouts: AffiliatePayout[];
  whiteLabels: WhiteLabelSettings[];
  onboardingProfiles: OnboardingProfile[];
  billingSettings: BillingSettings;
  creditSettings: CreditSettings;
  emailLogs: EmailLog[];
  auditLogs: AuditLog[];
};
