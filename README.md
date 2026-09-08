# Prague Morning Jobs (Joobly)

Job portal for Prague Morning — multilingual job listings for Prague and Czechia. Built with the Next.js App Router.

## Getting Started

Install dependencies with **pnpm** (recommended):

```bash
pnpm install
```

Copy environment variables into `.env.local`, then start the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Next.js development server |
| `pnpm build` | Production build (includes type-checking) |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |
| `pnpm tsc` / `pnpm typecheck` | TypeScript check without emitting files |
| `pnpm db:local` | Start an in-memory MongoDB for local work |
| `pnpm dev:local` | Run local MongoDB + `pnpm dev` together |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling**: SASS, Tailwind CSS, Material UI
- **Auth**: Clerk
- **State**: Redux Toolkit
- **Forms**: React Hook Form, Zod
- **Database**: MongoDB + Mongoose
- **Payments**: Stripe, PayPal
- **Editor**: CKEditor 5
- **Package manager**: pnpm

## Features

- Browse and filter job listings (location, language, work type, salary, and more)
- Favorite jobs for signed-in users
- Employer job posting and package/subscription flows
- User profiles for employers and job seekers
- Resume upload and contact flows
- Responsive layout for desktop and mobile

## Project layout

- `app/` — Next.js App Router pages and API routes
- `lib/` — shared UI, utils, auth helpers, and styles
- `models/` — Mongoose schemas (Job, User, …)
- `database/` — MongoDB connection helpers
- `scripts/` — local DB and maintenance scripts
