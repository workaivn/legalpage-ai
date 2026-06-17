# Billing Setup

LegalPage AI includes a complete subscription layer with Free, Pro, and Agency plans.

## Plans

- Free: 5 generations per month, basic templates, watermarked exports
- Pro: unlimited generations, all templates, PDF export, priority AI models
- Agency: Pro features plus team workspace, white label, and branding removal

## Billing Providers

Supported providers:

- Stripe
- LemonSqueezy

The billing page lets users choose a provider during checkout. If provider keys are not configured, the app uses the built-in manual checkout path for local demos, still recording subscriptions, invoices, credits, emails, analytics, and audit logs.

## Usage and Credits

Default costs:

- 1 generation = 1 credit
- 1 PDF export = 1 credit

Admins can change costs in the JSON data store under `creditSettings`.

## Billing Routes

- `/dashboard/billing`
- `/dashboard/usage`
- `/api/webhooks/stripe`
- `/api/webhooks/lemonsqueezy`

## Admin Routes

- `/admin/monetization`
- `/admin/coupons`
- `/admin/emails`
- `/admin/audit`
