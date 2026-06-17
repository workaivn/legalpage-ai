# Release Checklist

Use this checklist before publishing LegalPage AI to CodeCanyon or deploying it for a client.

## Code Quality

- [ ] Run `npm install`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Run `npm audit --omit=dev`
- [ ] Confirm there are no TypeScript errors
- [ ] Confirm there are no lint errors
- [ ] Confirm there are no production-blocking vulnerabilities

## Environment

- [ ] Copy `.env.example` to `.env`
- [ ] Set `NEXT_PUBLIC_APP_URL`
- [ ] Add OpenAI key if using OpenAI
- [ ] Add Gemini key if using Gemini
- [ ] Add Anthropic key if using Anthropic
- [ ] Add Stripe secret key if using Stripe
- [ ] Add Stripe webhook secret
- [ ] Add Stripe Pro price ID
- [ ] Add Stripe Agency price ID
- [ ] Add LemonSqueezy API key if using LemonSqueezy
- [ ] Add LemonSqueezy store ID
- [ ] Add LemonSqueezy Pro variant ID
- [ ] Add LemonSqueezy Agency variant ID
- [ ] Add LemonSqueezy webhook secret

## Authentication

- [ ] Confirm login works
- [ ] Confirm registration works
- [ ] Confirm forgot password flow logs reset email
- [ ] Change demo passwords before production
- [ ] Confirm admin routes require admin access
- [ ] Confirm dashboard routes require authentication

## AI Generation

- [ ] Confirm active AI provider is configured
- [ ] Generate Privacy Policy
- [ ] Generate Terms of Service
- [ ] Generate Cookie Policy
- [ ] Generate Refund Policy
- [ ] Generate one advanced policy such as AI Usage Policy or DPA
- [ ] Confirm disclaimer appears in generated documents
- [ ] Confirm provider errors are user-friendly

## Templates

- [ ] Confirm template library loads
- [ ] Confirm all categories appear
- [ ] Confirm template filters work
- [ ] Confirm starting from a template prefills generator defaults
- [ ] Confirm Free plan template restrictions work

## Document Management

- [ ] Confirm generated documents save for authenticated users
- [ ] Confirm edit works
- [ ] Confirm duplicate works
- [ ] Confirm delete works
- [ ] Confirm search works
- [ ] Confirm status filter works

## Exports

- [ ] Confirm Markdown export
- [ ] Confirm HTML export
- [ ] Confirm PDF export for paid plan
- [ ] Confirm PDF export is blocked for Free plan
- [ ] Confirm Free plan watermark appears
- [ ] Confirm exports create analytics records
- [ ] Confirm PDF export consumes credits

## Billing

- [ ] Confirm billing dashboard loads
- [ ] Confirm Free, Pro, and Agency plans appear
- [ ] Configure Stripe checkout
- [ ] Test Stripe checkout in test mode
- [ ] Configure Stripe webhook
- [ ] Test Stripe webhook signature validation
- [ ] Configure LemonSqueezy checkout
- [ ] Test LemonSqueezy checkout
- [ ] Configure LemonSqueezy webhook
- [ ] Test LemonSqueezy webhook signature validation
- [ ] Confirm manual checkout fallback works for local demos
- [ ] Confirm upgrade flow
- [ ] Confirm downgrade flow
- [ ] Confirm cancellation flow
- [ ] Confirm billing history records invoices

## Usage and Credits

- [ ] Confirm usage dashboard loads
- [ ] Confirm generation count updates
- [ ] Confirm remaining quota updates
- [ ] Confirm credit balance updates
- [ ] Confirm export count updates
- [ ] Confirm provider usage updates
- [ ] Confirm generation is blocked when Free quota is exceeded
- [ ] Confirm generation is blocked when credits are insufficient

## Team Workspace

- [ ] Confirm Team page loads
- [ ] Confirm Agency gate works
- [ ] Confirm team creation works
- [ ] Confirm member invite works
- [ ] Confirm member removal works
- [ ] Confirm invite email log is created

## White Label

- [ ] Confirm White Label page loads
- [ ] Confirm Agency gate works
- [ ] Save custom company name
- [ ] Save custom logo URL
- [ ] Save custom colors
- [ ] Save branding removal setting

## Affiliate System

- [ ] Confirm referral dashboard loads
- [ ] Confirm referral link is generated
- [ ] Confirm referral tracking by email works
- [ ] Confirm referral registration captures ref code
- [ ] Confirm earnings display
- [ ] Confirm admin commission setting works

## Coupons

- [ ] Confirm admin coupon page loads
- [ ] Create percentage coupon
- [ ] Create fixed coupon
- [ ] Set expiration date
- [ ] Set usage limit
- [ ] Toggle coupon active/inactive
- [ ] Apply coupon during checkout

## Admin

- [ ] Confirm admin dashboard loads
- [ ] Confirm users page loads
- [ ] Confirm documents page loads
- [ ] Confirm templates page loads
- [ ] Confirm AI settings page loads
- [ ] Confirm analytics page loads
- [ ] Confirm monetization page loads
- [ ] Confirm coupons page loads
- [ ] Confirm emails page loads
- [ ] Confirm audit logs page loads
- [ ] Confirm MRR and ARR display
- [ ] Confirm revenue by month displays
- [ ] Confirm provider usage displays

## SEO

- [ ] Confirm metadata title and description
- [ ] Confirm Open Graph metadata
- [ ] Confirm Twitter card metadata
- [ ] Confirm structured data script
- [ ] Confirm `/sitemap.xml`
- [ ] Confirm `/robots.txt`

## Documentation

- [ ] Review `README.md`
- [ ] Review `INSTALLATION.md`
- [ ] Review `DEPLOYMENT.md`
- [ ] Review `ADMIN_GUIDE.md`
- [ ] Review `BILLING_SETUP.md`
- [ ] Review `STRIPE_SETUP.md`
- [ ] Review `LEMONSQUEEZY_SETUP.md`
- [ ] Review `AFFILIATE_SYSTEM.md`
- [ ] Review `LICENSE.md`
- [ ] Review `CHANGELOG.md`
- [ ] Review `.env.example`

## Marketplace Assets

- [ ] Review `marketplace-description.md`
- [ ] Review `marketplace-features.md`
- [ ] Review `marketplace-faq.md`
- [ ] Review `screenshot-captions.md`
- [ ] Review `envato-item-description.html`
- [ ] Review `codecanyon-keywords.txt`
- [ ] Review `support-policy.md`
- [ ] Review `release-checklist.md`
- [ ] Capture clean production screenshots
- [ ] Compress final package
- [ ] Exclude `.env`
- [ ] Exclude `node_modules`
- [ ] Exclude `.next`

## Production Notes

- [ ] Replace demo credentials
- [ ] Back up `data/legalpage-ai.json`
- [ ] Use HTTPS
- [ ] Configure payment webhooks with production URLs
- [ ] Verify provider API billing limits
- [ ] Review legal disclaimer copy
- [ ] Test full customer journey from registration to paid export
