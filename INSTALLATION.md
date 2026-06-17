# Installation Guide

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- An AI provider API key for OpenAI, Gemini, or Anthropic

## Steps

1. Upload the project files to your server or local machine.
2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Add at least one provider key:

```env
OPENAI_API_KEY=your_key
```

5. Start development mode:

```bash
npm run dev
```

6. Build for production:

```bash
npm run build
npm run start
```

## Demo Data

Demo data is created automatically in `data/legalpage-ai.json`. Delete that file and restart the app to reseed fresh demo data.

## Default Login

- User: `demo@legalpage.ai` / `password123`
- Admin: `admin@legalpage.ai` / `password123`
