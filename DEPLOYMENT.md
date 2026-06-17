# Deployment Guide

## Environment Variables

Set these variables in your hosting panel:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

You only need one active provider key. Provider keys can also be configured in the Settings page.

## Build Commands

```bash
npm install
npm run build
npm run start
```

## File Storage

LegalPage AI uses `data/legalpage-ai.json` for users, sessions, documents, templates, settings, and analytics. On serverless platforms, persistent file storage may reset between deployments. For production SaaS at scale, replace `src/lib/store.ts` with a database adapter while keeping the same `AppDatabase` contract.

## Vercel Demo Mode

Vercel has a read-only deployment filesystem, so LegalPage AI automatically switches to in-memory demo storage on Vercel. It does not create or modify `data/legalpage-ai.json` there.

See `VERCEL_DEMO_MODE.md`.

## VPS Persistent Mode

For local development, CodeCanyon deployments, and VPS installs, LegalPage AI keeps persistent JSON file storage through `FileStorageProvider`.

See `VPS_PERSISTENT_MODE.md`.

## Security Checklist

- Change demo account passwords after installation.
- Use HTTPS in production.
- Prefer environment variables for API keys.
- Restrict filesystem access to the project directory.
- Back up `data/legalpage-ai.json` regularly.
