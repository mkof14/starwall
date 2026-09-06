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

The Bridge assistant on `/interface` calls Anthropic from `src/app/api/assistant/route.ts`. Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY`. `.env*.local` is gitignored. Without the key the panel still opens; sending a message returns a configuration error instead of a reply.

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
| `/interface` | Interface |
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

## Brand, theme, and language

The only site logo is `public/SW3.png`. Do not substitute another mark.

Header and footer include a sun/moon theme switch (light/dark, stored in the browser) and a language menu: English, Spanish, French, German, Russian, Ukrainian, Arabic, Chinese, Japanese, Hebrew. Arabic and Hebrew switch the page to RTL.
