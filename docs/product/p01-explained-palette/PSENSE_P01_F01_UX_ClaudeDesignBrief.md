# Claude Design Brief — Palette Sense (UI)

**Use:** paste or upload into Claude Design as the prompt. **Reuse your existing design system** there (type, color, components, spacing) — this should look like part of your family, not a one-off. Derived from the PRD (`PSENSE_P01_F01_PRD`) and the color-theory KB. Design the front-end only; the AI logic is built later in Claude Code.

**Build in React + Vite + Tailwind** (matches the engineering stack — no conversion).

---

## What to design

A single-screen tool: a designer picks colors + a mood + how many colors they want, presses Generate, and gets a harmonious palette **plus an always-on explanation of why each color is there**. Two things must shine: the **palette in context** and the **persistent rationale**. Aesthetic: **minimalist, edgy, cool — restrained, not big-and-bold** (the opposite of Coolors' full-bleed bars). Generous neutral space; the colors are the only loud thing.

## Layout

- **Top — controls (full width):**
  - Main color: picker + hex entry (required).
  - Optional 2nd and 3rd colors (picker + hex).
  - Mood: a row of toggle chips — calm, energetic, edgy, elegant, playful, minimal, bold, high-contrast, warm, cool, muted (multi-select).
  - Free-text intent (optional).
  - **Palette-size selector: 3–6 (default 5).**
  - A clear **Generate** button.
- **Below — two columns:**
  - **Left (wider): the palette + patterns.**
    - Palette as a clean list/grid of swatches — each with its **hex (click-to-copy)**, a **role** label (primary / accent / neutral / background / text), a **name**, and an **AA contrast** indicator.
    - A **pattern preview** with a switcher of **6+ intricate patterns** (e.g. UI card, diagonal stripes, dot grid, checkerboard, concentric rings, Bauhaus shapes) showing the palette applied in context.
  - **Right (narrower): the persistent "Why these colors" panel — always visible.**
    - Palette name + harmony type.
    - The overall **mood/effect** explanation.
    - Then a **per-color rationale**: for each color, *why it's there, what it does, how it helps* (tied to a color dot so it maps to the swatch).

## The data it renders (so the design has the right slots)

```
{ paletteName, harmonyType, moodExplanation,
  palette: [ { hex, role, name, rationale } ] }   // length = chosen size
```

## Accessibility detail

Show **WCAG AA contrast** per relevant pair (text/background, accent/background) as a small, calm indicator. Add an **info tooltip in plain language for non-designers**, e.g.: *"AA means text at this contrast is comfortably readable for most people — 4.5:1 is the standard for normal text."*

## States

Initial (inviting, with 2–3 example setups to click) · generating (one call — a calm loading state) · result · friendly error (if the response is malformed). No empty walls of text.

## Out of scope — do NOT design

Accounts/login, a Pro tier or any paywall, a saved-palette library, profile pages, settings, or extra screens. One screen, one flow. (The reasoning is free and front-and-centre — that's the whole point.)

## Handoff

When done, **Export to Claude Code**. There it pairs with the build plan (`docs/product/overviews/BUILD_PLAN.md`, forthcoming) and the KB-grounded `/api/generate` function — the design provides the look; the build provides the single Anthropic call and the color-theory grounding.
