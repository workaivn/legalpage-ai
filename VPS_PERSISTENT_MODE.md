# VPS Persistent Mode

LegalPage AI keeps file-backed JSON storage for local development, CodeCanyon deployments, and VPS installations.

## Storage Provider

Outside Vercel, the app uses:

```text
FileStorageProvider
```

This provider reads and writes:

```text
data/legalpage-ai.json
```

## What Is Stored

The JSON data store contains:

- Users
- Sessions
- Documents
- Templates
- AI settings
- Subscriptions
- Invoices
- Credit transactions
- Teams
- Coupons
- Referrals
- Affiliate payouts
- White label settings
- Onboarding profiles
- Email logs
- Audit logs

## First Run

If `data/legalpage-ai.json` does not exist, the app creates it automatically with seeded demo data.

## Recommended VPS Setup

1. Upload the project to your VPS.
2. Run:

```bash
npm install
npm run build
npm run start
```

3. Make sure the app has write permission for:

```text
data/
```

4. Back up the data file regularly:

```text
data/legalpage-ai.json
```

## Production Safety

For small CodeCanyon installations, file-backed JSON storage is simple and easy to deploy.

For larger SaaS businesses, replace `src/lib/store.ts` with a database-backed provider while keeping the same `StorageProvider` interface.

## Storage Providers

LegalPage AI includes:

```text
StorageProvider
FileStorageProvider
MemoryStorageProvider
```

This keeps local/VPS deployments persistent while making Vercel demos safe on read-only infrastructure.
