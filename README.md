# LegalPage AI

LegalPage AI is a commercial SaaS starter for generating, saving, editing, and exporting AI-assisted legal page drafts.

It includes a polished marketing site, authentication, user dashboard, document management, template library, provider settings, admin panel, demo data, and exports for Markdown, HTML, and PDF.

## Features

- Next.js App Router, TypeScript, Tailwind CSS
- Email/password authentication with cookie sessions
- User dashboard with metrics and recent documents
- Save, edit, duplicate, delete, search, and filter documents
- Legal generators for Privacy Policy, Terms of Service, Cookie Policy, Refund Policy, GDPR Notice, Disclaimer, AUP, DPA, AI Usage Policy, Affiliate Disclosure, and Copyright Notice
- OpenAI, Gemini, and Anthropic provider support
- Markdown, HTML, and PDF exports
- Template marketplace with seven categories
- Admin panel for users, documents, templates, AI settings, and analytics
- SEO metadata, Open Graph, Twitter cards, structured data, sitemap, and robots.txt
- File-backed JSON storage for simple CodeCanyon installation
- Free, Pro, and Agency subscription plans
- Stripe and LemonSqueezy checkout/webhook integration
- Usage quotas, credits, billing history, coupons, referrals, affiliate payouts, team workspaces, and white label mode

## Demo Accounts

- User: `demo@legalpage.ai` / `password123`
- Admin: `admin@legalpage.ai` / `password123`

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

The app seeds demo users, documents, templates, settings, and analytics into `data/legalpage-ai.json` on first run.

## Monetization

Customer routes:

- `/dashboard/billing`
- `/dashboard/usage`
- `/dashboard/team`
- `/dashboard/white-label`
- `/dashboard/affiliate`

Admin routes:

- `/admin/monetization`
- `/admin/coupons`
- `/admin/emails`
- `/admin/audit`

Setup docs:

- `BILLING_SETUP.md`
- `STRIPE_SETUP.md`
- `LEMONSQUEEZY_SETUP.md`
- `AFFILIATE_SYSTEM.md`

## Legal Notice

Generated documents are AI-generated drafts and do not constitute legal advice. Users should review drafts with a qualified legal professional before publishing.
