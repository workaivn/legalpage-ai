# Affiliate System

LegalPage AI includes referral links, referral tracking, earnings, commission settings, and payout records.

## User Features

- Referral link on `/dashboard/affiliate`
- Referral tracking by email
- Earnings summary
- Referral history

## Admin Features

- Commission rate control on `/admin/monetization`
- Affiliate payout records in the data store
- Referral analytics events

## Referral Flow

1. User shares `/register?ref=<referralCode>`.
2. New user registers.
3. Registration creates a referral record with `signed_up` status.
4. Subscription conversion can mark the referral converted and assign commission.

## Commission

The default commission rate is 20 percent and can be changed by admins.
