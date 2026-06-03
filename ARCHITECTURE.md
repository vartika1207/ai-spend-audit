# Architecture

```mermaid
flowchart TD
  A[Visitor] --> B[Landing Page]
  B --> C[Spend Input Form]
  C --> D[LocalStorage Persistence]
  C --> E[/api/audit]
  E --> F[Deterministic Audit Engine]
  F --> G[Supabase audits table]
  G --> H[Public Audit Page]
  H --> I[Lead Capture Form]
  I --> J[/api/lead]
  J --> K[Supabase leads table]
  J --> L[Resend transactional email]
  H --> M[Open Graph / Twitter Preview]
```

## Data flow
The user enters team size, use case, tool, plan, spend, and seats. The form state is persisted in localStorage. On submit, the payload goes to `/api/audit`, which validates input with Zod and runs the deterministic audit engine. The result is stored in Supabase and returned with a unique ID. The user is redirected to `/audit/[id]`, which renders the public report without email or company details. The lead capture form stores email and optional company fields separately.

## Stack choice
Next.js + TypeScript was chosen because it supports a polished React frontend, backend API routes, server-rendered metadata for shareable audit pages, and fast deployment on Vercel. Tailwind keeps styling lightweight and custom. Supabase was chosen because it gives a real Postgres backend quickly.

## Scaling to 10k audits/day
I would move the in-memory fallback out completely, add Supabase row-level security policies, put the audit engine behind rate limiting, cache public audit pages, add background jobs for emails, and instrument audit funnel events. I would also separate pricing data into a versioned table so historical reports remain reproducible after vendor pricing changes.
