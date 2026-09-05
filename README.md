# StarWall by AGRON

Marketing and product site for StarWall — intelligence, integration, and decision-support for yacht, marina, port, and private-island security.

This is a dedicated StarWall site (not a section of agron1.com). The first slice is the project scaffold: App Router routes, shared chrome, design tokens, and holding copy until the source documents are attached.

## Stack

- Next.js 14 (App Router) and TypeScript
- Tailwind CSS, themed from the tokens in `docs/SPEC.md` §4
- Framer Motion (one motion moment per page)
- `next/font` — Cormorant Garamond, Inter, Space Grotesk, JetBrains Mono

## Run locally

```bash
npm install
npm run dev
```

The dev server binds to `http://127.0.0.1:43180`.

```bash
npm run lint    # Next lint + banned-term copy check
npm run build
```

## Routes

| Path | Page |
|---|---|
| `/` | Overview |
| `/how-it-works` | Capabilities, architecture, scenario |
| `/interface` | AGRON Bridge demo (placeholder until the HTML prototype is ported) |
| `/levels` | Service levels — Available now / In development |
| `/technology` | Integrations and OEM tiers |
| `/faq` | FAQ |
| `/contact` | Briefing request form |

## Still needed

- `StarWall_Logo_Kit_v0.1.zip` — replace the typographic wordmark and favicon
- Source copy: Website Content Spec, Software Intelligence, MVP Scope, Integration Catalog, Services & Capabilities, FAQ draft
- `agron_bridge.html` — native Bridge port
- Email provider for `/api/contact` (Resend, Formspree, or an existing AGRON channel). The form currently accepts submissions locally and does not send mail.

## Conventions

- “Star” and “Wall” are always two colors. Full name “StarWall by AGRON” only in a page hero; “StarWall” everywhere else.
- Do not use Node, Command (as a feature name), Dominate, or Autonomous. `npm run lint:copy` enforces this in `app/` and `components/`.
- No testimonials, partner logos, or usage statistics until they are real.
