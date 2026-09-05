# StarWall Website — Technical Specification

# StarWall by AGRON — Technical Specification & Initial Build Tasks

This is a from-scratch build in Cursor (not an insert into the existing agron1.com codebase — that was the earlier `CURSOR_TASK_StarWall_Section.md` for a different scenario; use this document instead if the decision is a dedicated StarWall site/subdomain).

---

### 1. Goal & audience
A marketing and product site for StarWall by AGRON — an intelligence, integration, and decision-support system for yacht, marina, port, and private-island security. Audience: yacht owners and family offices, captains/security officers, marine insurance brokers, and potential investors/pilot partners. The site must read as a real, credible product — not a pitch deck.

### 2. Recommended stack
- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS, using the design tokens in section 4 as the Tailwind theme config — don't hardcode colors inline
- **Animation:** Framer Motion, used sparingly (see section 6 — one deliberate moment of motion per page, not decoration everywhere)
- **Fonts:** Google Fonts self-hosted via `next/font` — Cormorant Garamond (headings, marketing pages), Space Grotesk (the Bridge interface only), JetBrains Mono (data/coordinates in the Bridge interface only), Inter (body text)
- **Deployment target:** Vercel (or static export if hosting requirements differ — flag this if so, changes the routing setup)
- **Forms:** a simple contact/CTA form component posting to an email service (Resend, Formspree, or whatever the team already uses elsewhere at AGRON) — confirm before building, don't assume

### 3. Sitemap

```
/                 Overview — short hero + link cards to the sections below
/how-it-works     Capabilities, architecture diagram, scenario walkthrough
/interface        Interactive Bridge demo (AGRON Bridge)
/levels           Subscription tiers + Assess/Protect/Intelligence+Support mapping
/technology       Equipment integration catalog, OEM partner tiers
/faq              FAQ
/contact          Contact form (or a CTA section embedded on other pages instead — decide once, apply consistently)
```

Global: header (logo + nav across all 6 sections), footer (© AGRON Inc., link back to agron1.com, confidentiality/demo-data notice on any page showing the interface).

### 4. Design tokens

```
--orange:        #F15A00   (accent — always on "Wall" in the wordmark, and CTA buttons)
--navy:          #0F1922   (dark backgrounds)
--navy-text:     #1B2A3A   (dark text on light backgrounds)
--sand:          #E9E4DA   (muted text on dark backgrounds)
--grey:          #6B7280   (muted text on light backgrounds)
--ok:            #33D3A6   (risk level: normal — Bridge interface only)
--attn:          #E8B23D   (risk level: attention)
--crit:          #FF4757   (risk level: critical)
```

Wordmark rule (hard requirement, not a preference): "Star" and "Wall" always rendered in two different colors — never one flat color, in any weight or size. Full form "StarWall by AGRON" only in a page's first/hero mention; short form "StarWall" everywhere else (nav, running text, repeated mentions).

Logo assets: use the files in `StarWall_Logo_Kit_v0.1.zip` (dark/light horizontal lockup SVGs, monogram SVGs, favicon.ico) — don't recreate the logo in code.

**Banned terms — enforce in a lint/review pass, not just in the initial copy:** "Node" (use "Unit"/"Kit"/"Gateway"), "Command" as a feature name (use "Bridge"), "Dominate", "Autonomous" (in the sense of unsupervised physical action).

### 5. Content source mapping

| Page | Primary source document |
|---|---|
| `/` | StarWall Website Content Spec v0.1 (Hero section), condensed further per the "keep it short" rule |
| `/how-it-works` | StarWall Website Content Spec v0.1 ("How it works", "What StarWall does") + StarWall Software Intelligence v0.1 (sections 3–9, condensed) |
| `/interface` | `agron_bridge.html` — port this to a native page/component, see section 7 |
| `/levels` | StarWall by AGRON MVP Scope v0.1 (section 2, tier table) + StarWall Website Content Spec v0.1 ("StarWall and your service level") |
| `/technology` | StarWall Integration Catalog v0.1 (section 3, equipment categories) + StarWall by AGRON Services & Capabilities v0.1 (section 4, OEM partnership tiers) |
| `/faq` | See the FAQ copy already drafted in `CURSOR_TASK_StarWall_Enhancements.md` section 4 |

All of these documents exist already — pull exact wording from them for first-draft copy rather than re-generating it; only trim for length.

### 6. Motion & interaction principles
- One deliberate moment of motion per page — not ambient animation everywhere. The Bridge interface's radar sweep and the "Simulate alert" state change are the reference examples of motion that's justified by the subject matter.
- No animation that fires on scroll for its own sake (fade-ins on every section, staggered card reveals) — these read as generic template behavior.
- The `/` page hero may include a small decorative radar visual (ambient, no interactivity) per `CURSOR_TASK_StarWall_Enhancements.md` section 3.

### 7. The Interface page — integration detail
`agron_bridge.html` is a complete, working, self-contained prototype (inline SVG radar, vanilla JS state management for risk level / event log / simulate-alert flow). For this build:
- Port the markup to a React component (`app/interface/page.tsx` + child components for the radar, telemetry strip, event log, risk panel).
- Port the vanilla JS logic to React state (`useState` for risk level, event log array, contact visibility) — the state machine is simple (2 states: NORMAL / ELEVATED, toggled by two buttons) and should translate directly.
- Keep the exact visual design (HUD-bracket panels, compass-ring radar, telemetry strip) — this was deliberately designed to avoid looking like a generic dashboard template; don't simplify it back toward one.
- Keep the footer notice: "StarWall by AGRON — demo interface, illustrative data, not a live vessel."

### 8. Honesty requirements (non-negotiable, not a style choice)
- `/levels`: include the "Available now / In development" split from `CURSOR_TASK_StarWall_Enhancements.md` section 5 — don't present roadmap items as shipped.
- No client testimonials, partner logos, or usage statistics anywhere on the site until they're real. If placeholder sections exist during development, mark them `{/* TODO: real data before launch */}` and keep them out of the rendered page, not filled with invented numbers.
- Any mention of specialized/dual-use detection equipment integration keeps the legal caveat from the Integration Catalog (jurisdiction-specific review required, human authorization for anything beyond detection/analysis).

---
