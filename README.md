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
| `/technology` | Technology |
| `/faq` | FAQ |
| `/containers` | AGRON Containers |
| `/containers/detection` | Detection Suite |
| `/containers/countermeasures` | Countermeasures |
| `/containers/tiers` | Container Tiers |
| `/containers/specs` | Specifications |
| `/containers/deployment` | Deployment |
| `/contact` | Contact |
| `/login` | Sign in (email/password or Google) |
| `/signup` | Create an account |
| `/forgot-password` | Password reset request |
| `/tasks` | All tasks (gated; sign in first) |
| `/backend` | StarWall Backend (gated) |
| `/backend/privacy` | Data & Privacy (gated) |
| `/privacy` | Privacy Policy (public) |
| `/terms` | Terms of Service (public) |

## Brand, theme, and language

The only site logo is `public/SW3.png`. Do not substitute another mark.

Header and footer include a sun/moon theme switch (light/dark, stored in the browser) and a ten-language menu: English, Spanish, French, German, Russian, Ukrainian, Arabic, Chinese, Japanese, Hebrew. The choice is stored in `localStorage` (`starwall-locale`) and survives navigation. Arabic and Hebrew set `dir="rtl"`; Arabic also loads Noto Sans Arabic for body and headings.

Helm, the watch advisor, sits as a living icon at the bottom-right of every page. Speech/type languages fold into a dropdown inside the panel.

`/interface`, `/backend`, and `/tasks` carry a DEMO / LIVE mode switch (`localStorage` key `starwall-mode`, default DEMO). DEMO is the full illustrative simulation. LIVE is an honest empty deployment: no fake contacts, events, or equipment status. The assistant stays available in both modes.

## Authentication

Sign-in is NextAuth.js (Auth.js) at `/api/auth/[...nextauth]`:

- **Credentials** — email + password, stored in a local JSON file (`data/users.json`, or `/tmp` on Vercel). This is a demo store. Replace it with a real database (e.g. Postgres via Prisma) before production.
- **Google** — “Continue with Google”. This needs a real OAuth client that only you can create.

Create a Google Cloud OAuth app: **Google Cloud Console → APIs & Services → Credentials → Create credentials → OAuth client ID** (Web application). Add authorized redirect URI `https://YOUR_DOMAIN/api/auth/callback/google` (and `http://127.0.0.1:3000/api/auth/callback/google` for local). Copy the client ID and secret into `.env.local`. These values cannot be generated here.

Environment placeholders (see `.env.local.example`):

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`. After a successful sign-in the site opens `/interface` and the header shows an initial avatar with **Sign out**.

`/signup` creates a credentials account. `/forgot-password` shows a standard confirmation without revealing whether the email exists. Reset mail is not wired yet (Resend or similar before launch).

`/backend` and `/tasks` still require a signed-in session.

Translated now: marketing chrome (nav, footer), all public pages, Helm chrome, the Connections Map legend, the LIVE banner, `/backend`, `/login`, and `/tasks`. Arabic and Hebrew also load Noto Sans for body and headings.

Still English: the Bridge HUD itself (scenario library, Crisis Mode, instrument skins — forced `dir="ltr"` so RTL languages do not break the watch picture), product names (StarWall, Bridge, Support Center, Helm, tier codes LIGHT / ADVANCED / INTELLIGENCE / CUSTOM), and Helm replies (those follow the spoken/typed language when an API key is set).

## Deploy on Vercel

This is a standard Next.js 14 App Router app. Do **not** set `output: "standalone"`.

1. Import the Git repository in Vercel (Framework Preset: Next.js).
2. Set environment variables:
   - `ANTHROPIC_API_KEY` — required for Helm replies. Without it Helm still opens and returns a configuration error.
   - `NEXT_PUBLIC_SITE_URL` — production origin, e.g. `https://your-project.vercel.app`.
   - `NEXTAUTH_URL` — same production origin.
   - `NEXTAUTH_SECRET` — random secret for session tokens.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from the Google Cloud OAuth client. Without them the Google button is visible but sign-in cannot complete.
3. Deploy. `vercel.json` pins the framework and a single region (`iad1`).

Production checks locally before a deploy:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

`/api/contact` accepts briefing requests and acknowledges them (no inbox is wired by default). `/api/admin` is the live administration service used by `/backend`: heartbeat, backups, diagnostics, access changes, integration tests, and audit export.
