# LemonSqueezy Setup

1. Create Pro and Agency subscription variants.
2. Add these environment variables:

```env
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_PRO_VARIANT_ID=
LEMONSQUEEZY_AGENCY_VARIANT_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
```

3. Configure a webhook endpoint:

```text
https://your-domain.com/api/webhooks/lemonsqueezy
```

4. Enable these events:

- `subscription_created`
- `subscription_payment_failed`

The webhook validates `x-signature` with HMAC SHA-256 before mutating subscriptions.
