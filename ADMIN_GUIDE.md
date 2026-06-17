# Admin Guide

## Admin Login

Default admin:

- Email: `admin@legalpage.ai`
- Password: `password123`

Change this password before production use.

## Admin Areas

- Dashboard: total users, total generations, most used template, active provider, provider usage
- Users: registered accounts and roles
- Documents: all saved documents across users
- Templates: seeded template marketplace content
- AI Settings: active provider and model configuration
- Analytics: login, register, generation, export, and template-start events

## Provider Settings

Open `/admin/ai-settings` to set:

- OpenAI key and model
- Gemini key and model
- Anthropic key and model
- Active provider

Environment variables are used when no stored key exists.
