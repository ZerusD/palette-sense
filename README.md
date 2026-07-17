# Palette Sense

A portfolio + learning prototype: a minimalist color tool where the **AI's reasoning is the product**. You set a main color (plus optional accents), a mood, and how many colors you want; one AI call returns a harmonious palette and an always-on explanation of *why each color is there, what it does, and how it helps* — grounded in color theory.

This folder is a **kit instance** bootstrapped from `../pm-starter-kit`.

## Why it's different (honestly)

Generators like Coolors are faster and more powerful at *making* palettes — but they **paywall the reasoning** (per-color meaning/usage and the visualizer are Pro). Palette Sense isn't competing on generation breadth; it competes on **explained, intent-driven color**: the rationale is free, front-and-centre, and the designer stays in control. Plus a minimalist/edgy aesthetic and accessibility made legible to non-designers.

## Docs (read in this order)

1. `docs/product/overviews/DEFINITION_BRIEF.md` — strategy / why.
2. `docs/product/p01-explained-palette/PSENSE_P01_F01_PRD_PaletteSense.md` — requirements / what (prototype-light), incl. the JSON schema, data flow, and UX direction.

## Stack (v1)

React + Vite + Tailwind SPA · one Vercel serverless function · Anthropic API (Claude Sonnet), one call per Generate · Vercel Hobby. Key server-side only.

## Status

v1 built and verified locally: the imported Claude Design UI, the KB-grounded
single-call `/api/generate`, validation, and the real-world "palette in
context" previews live in [`apps/palette-sense/`](apps/palette-sense/) (see its
README for run/deploy instructions). Vercel deploy: in progress.
