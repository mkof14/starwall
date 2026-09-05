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

Dev server: `http://127.0.0.1:43180`

## Routes

Shared sticky header and footer wrap every route via the root layout. The homepage is the short entry point (hero + four handoff cards). Other pages are still placeholder `<h1>`s until later content tasks.

| Path | Heading |
|---|---|
| `/` | StarWall — Overview |
| `/how-it-works` | How it works |
| `/interface` | Interface |
| `/levels` | Levels |
| `/technology` | Technology |
| `/faq` | FAQ |
| `/contact` | Contact |

## Wordmark

When “StarWall” is a heading or logo-style text, render **Star** and **Wall** in two colors — never one flat color. Star is navy or white depending on the background; Wall is always the orange accent (`#F15A00`).
