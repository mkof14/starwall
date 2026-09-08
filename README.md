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

Local production server (stays up; starts Postgres and Next if they are down):

```bash
npm run ensure
```

Then open `http://127.0.0.1:3000` (and `http://127.0.0.1:43180` for the preview port).

To keep it running in the foreground and restart anything that dies:

```bash
npm run up
```

Cloud Agent environments run `scripts/ensure-site.sh` on every boot (`start` in `.cursor/environment.json`) and keep `npm run up` in a terminal. On this machine a cron job also checks once a minute and brings the site back if it is down.

The supervisor writes the current public URL to `/tmp/starwall-public-url.txt`. Quick-tunnel hostnames change when cloudflared restarts.

Pilot (the watch advisor) calls Anthropic from `src/app/api/assistant/route.ts`. Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY`. `.env*.local` is gitignored. Without the key the panel still opens; sending a message returns a configuration error instead of a reply.

`NEXT_PUBLIC_SITE_URL` is used for canonical metadata, Open Graph, `robots.txt`, and `sitemap.xml`. Locally it defaults to `http://127.0.0.1:3000`. On Vercel it falls back to `https://$VERCEL_URL` if you leave it blank.

## PDF overview

The homepage “Download overview (PDF)” button uses the one-page leaflet in `public/overview-leaflet.jpg` as a thumbnail and serves `public/starwall-overview.pdf`.

The Technology page embeds the briefing deck `public/starwall-intelligence-platform.pdf`.

Bridge walkthrough stills go in `public/bridge/`:

- `public/bridge/radar-normal.png`
- `public/bridge/risk-elevated.png`
- `public/bridge/recommended-action.png`
- `public/bridge/event-log-new.png`

## Routes

Shared sticky header and footer wrap every route via the root layout. The header keeps the main product pages. Levels, FAQ, and AGRON Container live in the footer.

| Path | Heading |
|---|---|
| `/` | StarWall — Overview |
| `/how-it-works` | How it works |
| `/interface` | Interface (scenario-linked Situational Picture) |
| `/interface/connections` | System Connections Map |
| `/levels` | Levels |
| `/pricing` | Plans — four levels, comparison, how pricing is built, request form |
| `/technology` | Technology (briefing deck + equipment catalog) |
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
| `/admin/starwall/pricing` | Internal Price Book and quote desk (gated, AGRON commercial roles) |
| `/backend` | StarWall Backend (gated) |
| `/backend/users` | User Management (Super Admin) |
| `/backend/privacy` | Data & Privacy (gated) |
| `/privacy` | Privacy Policy (public) |
| `/terms` | Terms of Service (public) |

## Brand, theme, and language

The only site logo is `public/SW3.png`. Do not substitute another mark.

Header and footer include a sun/moon theme switch (light/dark, stored in the browser) and a ten-language menu: English, Spanish, French, German, Russian, Ukrainian, Arabic, Chinese, Japanese, Hebrew. The choice is stored in `localStorage` (`starwall-locale`) and survives navigation. Arabic and Hebrew set `dir="rtl"`; Arabic also loads Noto Sans Arabic for body and headings.

Pilot, the watch advisor, sits as a living icon at the bottom-right of every page. Speech/type languages fold into a dropdown inside the panel.

`/interface`, `/backend`, and `/tasks` carry a DEMO / LIVE mode switch (`localStorage` key `starwall-mode`, default DEMO). DEMO is the full illustrative simulation. LIVE is an honest empty deployment: no fake contacts, events, or equipment status. Pilot stays available in both modes.

## Authentication

Sign-in is NextAuth.js (Auth.js) at `/api/auth/[...nextauth]`:

- **Credentials** — email + password, stored in Prisma (`User.role`, `passwordHash`, `lastSignInAt`). New sign-ups default to **Operator**.
- Pre-pilot role accounts (local Postgres seed): `super@starwall.demo` / Super Admin, `admin@starwall.demo` / Admin, `operator@starwall.demo` / Operator, `viewer@starwall.demo` / Viewer. Passwords are listed on `/login`.
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

Translated now: marketing chrome (nav, footer), all public pages, Pilot chrome, the Connections Map legend, the LIVE banner, `/backend`, and `/tasks`. Arabic and Hebrew also load Noto Sans for body and headings.

Still English: sign-in / sign-up / forgot-password forms (credentials and role names stay as printed), the Bridge HUD itself (scenario library, Crisis Mode, instrument skins — forced `dir="ltr"` so RTL languages do not break the watch picture), product names (StarWall, Bridge, Support Center, Pilot, tier codes LIGHT / ADVANCED / INTELLIGENCE / CUSTOM), and Pilot replies (those follow the spoken/typed language when an API key is set).

## Deploy on Vercel

This is a standard Next.js 14 App Router app. Do **not** set `output: "standalone"`.

1. Import the Git repository in Vercel (Framework Preset: Next.js).
2. Set environment variables:
   - `ANTHROPIC_API_KEY` — required for Pilot replies. Without it Pilot still opens and returns a configuration error.
   - `NEXT_PUBLIC_SITE_URL` — production origin, e.g. `https://your-project.vercel.app`.
   - `NEXTAUTH_URL` — same production origin.
   - `NEXTAUTH_SECRET` — random secret for session tokens.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from the Google Cloud OAuth client. Without them the Google button is visible but sign-in cannot complete.
   - `DATABASE_URL` — Neon / Vercel Postgres URL (add `?sslmode=require` if it is missing). Use the pooled connection string. The build runs `prisma migrate deploy` only when this is a hosted Postgres URL, so a missing database does not fail the Vercel deploy.
3. Deploy. `vercel.json` pins the framework and a single region (`iad1`). `npm run build` generates the Prisma client, applies migrations when a hosted `DATABASE_URL` is set, then runs `next build`.

## Postgres on Vercel (required)

SQLite (`file:./dev.db`) is not used. Serverless hosts cannot keep a local file, so accounts, audit rows, and cloud copies of Bridge records need a hosted Postgres database.

**Use Neon via Vercel Storage.** That is the recommended production database for this project (Vercel’s current Postgres offering is Neon). A self-hosted Postgres or a generic “bring your own server” setup is more work than this site needs. Supabase works if you already have a project there, but Neon is the shorter path on Vercel.

Do this in the Vercel dashboard (you have to click these — the agent cannot provision the database for you):

1. Open the StarWall project in [Vercel](https://vercel.com).
2. Go to **Storage → Create Database → Postgres** (Neon). Create it in the same region as the app (`iad1` if you keep the default).
3. Open the new database → **.env** or **Connect**. Copy the connection string into `DATABASE_URL` (the direct URI is safer for `prisma migrate deploy`; pooled also works at runtime).
4. If the URI is missing `sslmode=require`, append `?sslmode=require` (or `&sslmode=require` if the query string already exists).
5. Go to **Settings → Environment Variables** and set `DATABASE_URL` for **Production** and **Preview**.
6. Redeploy. When `DATABASE_URL` is a hosted Postgres URL, the build runs `npx prisma migrate deploy` and creates `User`, `Session`, `Event`, `Conversation`, `BlackBoxRecord`, `Equipment`, `NotificationRoute`, `AuditLog`, and `Integration`.
7. After the first successful deploy, sign in with a demo account from `/login` or create one on `/signup`. Seed accounts are created on first backend request when the database is empty.

Local development:

```bash
# Example local server (user/password/db all "starwall")
# DATABASE_URL in .env.local:
# postgresql://starwall:starwall@127.0.0.1:5432/starwall

npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Persistent storage

Two layers, local first:

- **IndexedDB** (via `idb`) in the browser — `events`, `conversations`, `sessionReports`, plus a local Black Box index. A refresh during a DEMO session restores the Event Log, Pilot history, and Black Box list. Switching to **LIVE** wipes those four stores so DEMO records cannot come back. The signed-in NextAuth session is left alone. Switching back to DEMO starts a fresh idle watch (seed Event Log lines only — not the previous scenario history) and an empty Black Box.
- **Prisma / Postgres** — accounts, RBAC, equipment checks, notification routes, integrations, the audit log, and the optional cloud copy of Bridge records. A Bridge record is written locally first (`Local`), then the badge becomes `Local + Cloud` only after `/api/blackbox` confirms the write.

Schema: `prisma/schema.prisma` (`User`, `Session`, `Event`, `Conversation`, `BlackBoxRecord`, `Equipment`, `NotificationRoute`, `AuditLog`, `Integration`).

```bash
npx prisma generate
npx prisma migrate deploy
```

`/backend` is a working pre-pilot admin: Super Admin only on `/backend/users`; Admin and above can run diagnostics and save notification routing; Operators can view and use the Bridge; Viewers see reports and the Black Box only. Equipment is checked every 30 seconds while `/backend` is open (simulated heartbeat until hardware is connected). DEMO/LIVE switches, role changes, diagnostics, and notify saves write real audit rows.

Production checks locally before a deploy:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

`/pricing` is a public product page: LIGHT, ADVANCED, INTELLIGENCE, and CUSTOM, a comparison matrix, environments, optional hardware, and how a configuration is priced. There are no dollar figures. The request form posts to `/api/contact`. Plan CTAs can still open `/contact?plan=ADVANCED` from older links.

`/admin/starwall/pricing` is the internal Master Price Book and quote desk. It is not linked from the public site. Super Admin and Admin receive commercial-admin access. Seeded desk accounts: `sales@starwall.demo` and `engineering@starwall.demo` (Operator on the Bridge, sales/engineering on the desk). License list prices are seeded (LIGHT $6,000, ADVANCED $18,000, INTELLIGENCE $42,000, CUSTOM starting $75,000). Every other catalog row is PRICE REQUIRED until AGRON enters real costs. Public APIs never return this book.

`/api/contact` accepts briefing requests and acknowledges them (no inbox is wired by default). `/backend` writes through `/api/equipment`, `/api/notifications`, `/api/audit`, `/api/integrations`, and `/api/users`. Unauthorized writes return 403.
