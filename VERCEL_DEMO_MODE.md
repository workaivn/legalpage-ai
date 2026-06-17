# Vercel Demo Mode

LegalPage AI automatically detects Vercel and switches to demo-mode storage.

## Why Demo Mode Exists

Vercel serverless functions use a read-only deployment filesystem. Writing to files such as `data/legalpage-ai.json` causes this error:

```text
EROFS: read-only file system
open '/var/task/data/legalpage-ai.json'
```

To prevent that, LegalPage AI uses `MemoryStorageProvider` on Vercel.

## Automatic Detection

The app enables demo mode when either environment variable exists:

```env
VERCEL=1
VERCEL_ENV=production
```

These are automatically provided by Vercel.

## Demo Mode Behavior

On Vercel:

- The app does not write to the filesystem.
- The app does not create or modify `data/legalpage-ai.json`.
- Demo data is seeded in memory.
- Data resets automatically on cold starts.
- A banner appears at the top of the app:

```text
Running in Demo Mode on Vercel. Data resets automatically.
```

## Demo Accounts

These accounts work in Vercel demo mode:

```text
demo@legalpage.ai / password123
admin@legalpage.ai / password123
```

## Demo Pages That Work

- Login
- User dashboard
- Admin dashboard
- Templates
- Billing
- AI Settings
- Generator

## Generator Behavior

If an AI provider key is configured, LegalPage AI uses the selected provider.

If no provider key is configured, Vercel demo mode uses deterministic demo document generation so the product can still be tested without OpenAI, Gemini, or Anthropic credentials.

## Important Production Note

Vercel demo mode is suitable for public demos, marketplace previews, and sales demos.

It is not persistent storage. For a real production SaaS deployment, use a database adapter or deploy on a VPS with persistent disk storage.
