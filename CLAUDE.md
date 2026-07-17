# Operating Contract — Palette Sense

> Operating contract for AI-assisted product work in this repo. Claude Code auto-loads it; in Cowork, mirror essentials into `memory/PROJECT_MEMORY.md`.

## Project

- **Product:** Palette Sense (`PSENSE`)
- **One-line thesis:** A minimalist, intent-driven color tool where the AI's **reasoning is the product** — you set the base colors, mood, and palette size; one AI call returns a harmonious palette and explains *why each color, what it does, and how it helps*, grounded in color theory.
- **What it is NOT:** a fast random generator (Coolors), an accounts/Pro SaaS with paywalled insight, or a full design-system/token tool. The explanation stays free and front-and-centre — that's the whole point.
- **Stage:** 0-to-1 portfolio + learning prototype.

## How to work here

**The reasoning is the star.** Generators output swatches; this explains them. The always-on rationale (per-color "why", plus the overall mood/effect) is the differentiator — never bury it.

**Designer in control.** The designer sets the base colors, the mood, and the count. The AI proposes and explains; it never overrides the designer's intent.

**One call, cost-aware.** The AI is called only on Generate — one Anthropic call per generate, never in a loop. Key server-side only.

**Insight over filler.** Per-color rationale must be specific and useful ("this muted neutral keeps the bright accent from overwhelming the layout"), never platitudes ("a nice complementary color").

**Minimalist & edgy craft.** Restrained, confident, a little cool — not big-and-bold. Generous neutral space, refined type.

**Accessible & legible to non-designers.** Show WCAG AA contrast, and explain it in plain language (tooltips) so a non-designer understands what it means.

**Secrets server-side, always.** The Anthropic key lives in a Vercel env var, used only by the serverless function; never in client code or git.

## The 0-to-1 pipeline

`Definition → PRD (light) → Design Spec / build plan → prototype review.` Right-sized: this is a small tool — keep docs light, resist creep.

## Build context (for Claude Code)

- **Stack:** React + Vite + Tailwind SPA + one Vercel serverless function (`/api/generate`).
- **Runtime:** Anthropic Messages API, Claude Sonnet, **one call per Generate**, strict-JSON response.
- **Hosting:** Vercel Hobby. No database, no auth, no Pro tier.
