# Stripe Setup

1. Create Stripe products for Pro and Agency.
2. Create monthly recurring prices.
3. Add these environment variables:

```env
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...
```

4. In Stripe Dashboard, create a webhook endpoint:

```text
https://your-domain.com/api/webhooks/stripe
```

5. Enable these events:

- `checkout.session.completed`
- `invoice.payment_failed`

6. Restart the app after changing environment variables.

Stripe checkout sessions include user and plan metadata so webhooks can activate subscriptions and grant credits.
