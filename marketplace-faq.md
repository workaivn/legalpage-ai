# Marketplace FAQ

## Is LegalPage AI a complete SaaS application?

Yes. LegalPage AI includes authentication, dashboard, document management, AI generation, templates, exports, subscriptions, billing integrations, usage tracking, credits, coupons, referrals, teams, white label mode, admin analytics, documentation, and demo data.

## Does it include Stripe?

Yes. LegalPage AI includes Stripe checkout session creation and a secure Stripe webhook route with signature verification. You need to add your own Stripe secret key, webhook secret, and recurring price IDs.

## Does it include LemonSqueezy?

Yes. LemonSqueezy checkout and webhook support are included. You need to configure your LemonSqueezy API key, store ID, variant IDs, and webhook secret.

## Can I run the app without Stripe or LemonSqueezy keys?

Yes. For local demos, LegalPage AI includes a manual checkout fallback that activates subscriptions, creates invoices, grants credits, logs emails, and records analytics. For production, configure Stripe or LemonSqueezy.

## Is this a legal advice product?

No. LegalPage AI generates AI-assisted legal document drafts. Every generated document includes a disclaimer stating that the document is AI-generated and does not constitute legal advice. Users should review documents with qualified legal counsel before publishing.

## Which AI providers are supported?

LegalPage AI supports OpenAI, Gemini, and Anthropic Claude. Admins can switch providers and configure model names/API keys.

## Is a database required?

Version 1 uses a file-backed JSON data store for easy CodeCanyon installation and demonstration. The data layer is centralized in `src/lib/store.ts`, so developers can replace it with a database adapter for larger production deployments.

## Does it include subscriptions?

Yes. The app includes Free, Pro, and Agency plans, plan gates, billing history, invoices, subscription status, upgrades, downgrades, cancellations, usage quotas, and credits.

## What is included in the Free plan?

The Free plan includes 5 generations per month, basic templates, and watermarked exports.

## What is included in the Pro plan?

The Pro plan includes unlimited generations, all templates, PDF export, and priority AI model access.

## What is included in the Agency plan?

The Agency plan includes Pro features plus team workspace, white label settings, branding removal, shared workspace foundation, and agency-focused controls.

## Does it support PDF export?

Yes. PDF export is included and gated by plan. PDF export consumes credits and is tracked in analytics.

## Are exports watermarked?

Free-plan exports include a LegalPage AI watermark. Paid plans remove export watermarking.

## Does it include a coupon system?

Yes. Admins can create percentage or fixed discounts, set expiration dates, define usage limits, and toggle coupon status.

## Does it include an affiliate system?

Yes. Users get referral links, referral tracking, earnings summaries, and referral history. Admins can configure commission rates and review payout records in the data store.

## Does it include an admin dashboard?

Yes. Admins can manage users, documents, templates, AI settings, analytics, monetization metrics, coupons, email logs, and audit logs.

## Does it include onboarding?

Yes. The first-login onboarding flow collects business type, country, preferred AI provider, and preferred templates.

## Can I customize the branding?

Yes. Agency users can configure white label settings including company name, logo URL, primary color, accent color, and branding removal.

## Is the UI responsive?

Yes. The application is responsive and designed for modern SaaS dashboards, landing pages, and mobile-friendly workflows.

## Can I sell this as my own SaaS?

You can customize and deploy the application according to the license terms under which you purchase it on CodeCanyon.

## Are demo accounts included?

Yes. Demo user and admin accounts are included for testing:

- User: `demo@legalpage.ai` / `password123`
- Admin: `admin@legalpage.ai` / `password123`

Change demo credentials before production deployment.

## Is documentation included?

Yes. Installation, deployment, admin, billing, Stripe, LemonSqueezy, affiliate, changelog, license, environment, and migration documentation are included.
