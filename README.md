# StarWall by AGRON

Scaffold for the StarWall marketing and product site — a maritime security intelligence product.

## Stack

- Next.js 14, TypeScript, App Router, `src/`
- Tailwind CSS with the StarWall design tokens
- Google fonts via `next/font`: Cormorant Garamond (`font-heading`), Inter (`font-body`), Space Grotesk (`font-ui`), JetBrains Mono (`font-mono`)

## Run locally

```bash
npm install
npm run dev
```

Dev server: `http://127.0.0.1:3000`

Helm (the watch advisor) calls Anthropic from `src/app/api/assistant/route.ts`. Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY`. `.env*.local` is gitignored. Without the key the panel still opens; sending a message returns a configuration error instead of a reply.

`NEXT_PUBLIC_SITE_URL` is used for canonical metadata, Open Graph, `robots.txt`, and `sitemap.xml`. Locally it defaults to `http://127.0.0.1:3000`. On Vercel it falls back to `https://$VERCEL_URL` if you leave it blank.

## PDF overview

The homepage “Download overview (PDF)” button uses the one-page leaflet in `public/overview-leaflet.jpg` as a thumbnail and serves `public/starwall-overview.pdf`.

Bridge walkthrough stills go in `public/bridge/`:

- `public/bridge/radar-normal.png`
- `public/bridge/risk-elevated.png`
- `public/bridge/recommended-action.png`
- `public/bridge/event-log-new.png`

## Routes

Shared sticky header and footer wrap every route via the root layout.

| Path | Heading |
|---|---|
| `/` | StarWall — Overview |
| `/how-it-works` | How it works |
| `/interface` | Interface (scenario-linked Situational Picture) |
| `/interface/connections` | System Connections Map |
| `/levels` | Levels |
| `/pricing` | Pricing configurator (object, software, container, extras) |
| `/technology` | Technology |
| `/faq` | FAQ |
| `/containers` | AGRON Containers |
| `/containers/detection` | Detection Suite |
| `/containers/countermeasures` | Countermeasures |
| `/containers/tiers` | Container Tiers |
| `/containers/specs` | Specifications |
| `/containers/deployment` | Deployment |
| `/about` | Why StarWall — who builds it |
| `/contact` | Contact |
| `/login` | Sign in (email/password or Google) |
| `/signup` | Create an account |
| `/forgot-password` | Password reset request |
| `/tasks` | All tasks (gated; sign in first) |
| `/backend` | StarWall Backend (gated) |
| `/backend/users` | User Management (Super Admin) |
| `/backend/privacy` | Data & Privacy (gated) |
| `/privacy` | Privacy Policy (public) |
| `/terms` | Terms of Service (public) |

## Brand, theme, and language

The only site logo is `public/SW3.png`. Do not substitute another mark.

Header and footer include a sun/moon theme switch (light/dark, stored in the browser) and a ten-language menu: English, Spanish, French, German, Russian, Ukrainian, Arabic, Chinese, Japanese, Hebrew. The choice is stored in `localStorage` (`starwall-locale`) and survives navigation. Arabic and Hebrew set `dir="rtl"`; Arabic also loads Noto Sans Arabic for body and headings.

Helm, the watch advisor, sits as a living icon at the bottom-right of every page. Speech/type languages fold into a dropdown inside the panel.

`/interface`, `/backend`, and `/tasks` carry a DEMO / LIVE mode switch (`localStorage` key `starwall-mode`, default DEMO). DEMO is the full illustrative simulation. LIVE is an honest empty deployment: no fake contacts, events, or equipment status. Helm stays available in both modes.

## Authentication

Sign-in is NextAuth.js (Auth.js) at `/api/auth/[...nextauth]`:

- **Credentials** — email + password, stored in Prisma (`User.role`, `passwordHash`, `lastSignInAt`). New sign-ups default to **Operator**.
- Pre-pilot role accounts (local SQLite): `super@starwall.demo` / Super Admin, `admin@starwall.demo` / Admin, `operator@starwall.demo` / Operator, `viewer@starwall.demo` / Viewer. Passwords are listed on `/login`.
- **Google** — “Continue with Google”. This needs a real OAuth client that only you can create.

Create a Google Cloud OAuth app: **Google Cloud Console → APIs & Services → Credentials → Create credentials → OAuth client ID** (Web application). Add authorized redirect URI `https://YOUR_DOMAIN/api/auth/callback/google` (and `http://127.0.0.1:3000/api/auth/callback/google` for local). Copy the client ID and secret into `.env.local`. These values cannot be generated here.

Environment placeholders (see `.env.local.example`):

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
```

Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`. After a successful sign-in the site opens `/interface` and the header shows an initial avatar with **Sign out**.

`/signup` creates a credentials account. `/forgot-password` shows a standard confirmation without revealing whether the email exists. Reset mail is not wired yet (Resend or similar before launch).

`/backend` and `/tasks` still require a signed-in session.

Translated now: marketing chrome (nav, footer), all public pages, Helm chrome, the Connections Map legend, the LIVE banner, `/backend`, and `/tasks`. Arabic and Hebrew also load Noto Sans for body and headings.

Still English: sign-in / sign-up / forgot-password forms (credentials and role names stay as printed), the Bridge HUD itself (scenario library, Crisis Mode, instrument skins — forced `dir="ltr"` so RTL languages do not break the watch picture), product names (StarWall, Bridge, Support Center, Helm, tier codes LIGHT / ADVANCED / INTELLIGENCE / CUSTOM), and Helm replies (those follow the spoken/typed language when an API key is set).

## Deploy on Vercel

This is a standard Next.js 14 App Router app. Do **not** set `output: "standalone"`.

1. Import the Git repository in Vercel (Framework Preset: Next.js).
2. Set environment variables:
   - `ANTHROPIC_API_KEY` — required for Helm replies. Without it Helm still opens and returns a configuration error.
   - `NEXT_PUBLIC_SITE_URL` — production origin, e.g. `https://your-project.vercel.app`.
   - `NEXTAUTH_URL` — same production origin.
   - `NEXTAUTH_SECRET` — random secret for session tokens.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from the Google Cloud OAuth client. Without them the Google button is visible but sign-in cannot complete.
   - `DATABASE_URL` — local default is SQLite (`file:./dev.db` next to `prisma/schema.prisma`). For production you can keep SQLite on the host or switch the Prisma datasource to PostgreSQL and point this at your connection string. After changing it, run `npx prisma db push`.
3. Deploy. `vercel.json` pins the framework and a single region (`iad1`).

## Persistent storage

Two layers, local first:

- **IndexedDB** (via `idb`) in the browser — `events`, `conversations`, `sessionReports`, plus a local Black Box index. A refresh during a DEMO session restores the Event Log, Helm history, and Black Box list.
- **Prisma** — local SQLite by default (`prisma/dev.db`), used for accounts, RBAC, equipment checks, notification routes, integrations, the audit log, and the optional cloud copy of Bridge records. A Bridge record is written locally first (`Local`), then the badge becomes `Local + Cloud` only after `/api/blackbox` confirms the write.

Schema: `prisma/schema.prisma` (`User`, `Session`, `Event`, `Conversation`, `BlackBoxRecord`, `Equipment`, `NotificationRoute`, `AuditLog`, `Integration`).

```bash
npx prisma generate
npx prisma db push
```

`/backend` is a working pre-pilot admin: Super Admin only on `/backend/users`; Admin and above can run diagnostics and save notification routing; Operators can view and use the Bridge; Viewers see reports and the Black Box only. Equipment is checked every 30 seconds while `/backend` is open (simulated heartbeat until hardware is connected). DEMO/LIVE switches, role changes, diagnostics, and notify saves write real audit rows.

Production checks locally before a deploy:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

`/pricing` is a live configurator: object type, StarWall tier, AGRON Container hardware, and extras. Monthly software and one-time equipment stay as two totals. CUSTOM / Exclusive show “Contact us for pricing” for that part. **Request exact quote** opens `/contact` with the configuration pre-filled.

`/api/contact` accepts briefing requests and acknowledges them (no inbox is wired by default). `/backend` writes through `/api/equipment`, `/api/notifications`, `/api/audit`, `/api/integrations`, and `/api/users`. Unauthorized writes return 403.
