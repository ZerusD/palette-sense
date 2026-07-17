# Product Definition Brief — Palette Sense

**Prefix:** PSENSE · **Stage:** 0-to-1 (portfolio + learning prototype) · **Layer:** Strategy / why · **Status:** Locked v1 · **Date:** 2026-06-21

> Strategy layer only. Right-sized Stage 1 for a small tool. Downstream PRD resolves upward to this.

## Objective

Structure Palette Sense before building: what it is, who it's for, what it wins on, and the v1 — so the build stays minimalist and doesn't sprawl as features were added (always-on rationale, variable size, richer patterns).

## Relevant sources

- Be's concept + feedback (2026-06-21): minimalist/edgy aesthetic; AI output as an always-present panel explaining *why each color*; user-selectable palette size; richer patterns; AA contrast made legible.
- Coolors review (dated 2026-06-21) — see Facts.
- Interactive preview built in Cowork (2026-06-21).

## 1. Thesis

Palette Sense is a minimalist color tool where the **AI's reasoning is the product**. The designer sets a main color (plus optional accents), a mood, and how many colors they want; **one AI call** returns a harmonious, professional palette and — always on screen, never paywalled — explains the **mood and effect** and, per color, **why it's there, what it does, and how it helps**, grounded in color theory. It wins on **explained, intent-driven color**, not on generation speed or breadth.

**What it is NOT:** a fast random generator (Coolors/Khroma), an accounts/Pro SaaS that paywalls the insight, or a full design-system/token tool. It stays a small, opinionated, *explanatory* tool.

## 2. Target user & core problem

**Who (Facts):** designers and design-minded builders (canonical: Be and peers) choosing a palette for a brand, site, or UI, who want colors that *work together for a reason* they can articulate — not just a pretty row of swatches.

**Core problem (Interpretation):** generators give you colors fast but not the *why*. You're left guessing whether a palette fits the mood you want, how the colors function (which is primary, which supports, which to use sparingly), and whether it's accessible — and the tools that do explain (Coolors' meaning/usage) lock it behind Pro.

**Assumption (validate in demo):** designers (and especially people learning design) value an always-on, plain-language rationale enough that it's the reason to use this over a faster generator. Validate by showing peers.

## 3. Value pillars (USPs)

1. **Explained color** — *promise:* always-on, free reasoning — the overall mood/effect plus a per-color "why this color, what it does, how it helps." *Hard to copy:* it's the thing generators tease and paywall; making it the free centrepiece is the whole positioning.
2. **Designer in control** — *promise:* you set the base colors, the mood, and the count; the AI proposes and explains, never overrides your intent. *Hard to copy:* it's a stance (assistive, not autonomous), encoded in the UX.
3. **Accessible, minimalist craft** — *promise:* WCAG AA contrast shown and explained in plain language; a restrained, edgy aesthetic; the palette previewed in real patterns. *Hard to copy (as a portfolio signal):* taste and restraint.

## 4. Foundations

The single grounded AI call (Anthropic Sonnet → strict JSON) · color-theory grounding · the secure serverless proxy (key server-side) · the design system (minimalist/edgy).

## 5. Product principles

- **The reasoning is the product** — explain, don't just generate.
- **Designer in control** — the AI proposes and explains; the designer decides.
- **One call, cost-aware** — AI runs only on Generate, one call, never a loop.
- **Insight over filler** — per-color rationale is specific and useful, never platitudes.
- **Minimalist & edgy craft** — restraint over big-and-bold.
- **Accessible & legible to non-designers** — show AA contrast and explain what it means.
- **Secrets server-side, always.**

## 6. Locked vs. open

**Locked:** thesis; three pillars; principles; single-AI-call architecture; v1 scope (input → one call → palette + always-on rationale + patterns + AA contrast w/ tooltip + selectable size); minimalist/edgy aesthetic; Claude-ecosystem constraint.

**Open:** exact pattern set (expand + make more intricate — decide in build); model (Sonnet vs Haiku); palette-size range (default 3–6); final layout of the rationale panel; export (Phase 1).

## 7. Non-goals (and who owns it if real)

- **No paywalled insight / Pro tiers** — the reasoning stays free; that's the point.
- **No fast random "spacebar" generation race** — Coolors owns that; we're intent-driven.
- **No accounts, saved-palette library, or profile pages** in v1 — Phase 1+.
- **No design-system/token export or image extraction** in v1 — Phase 2.

## 8. Phase / proof-point framing

- **Phase 0 — v1 (committed).** Input (colors + mood + size) → one AI call → palette with always-on per-color rationale + mood/effect + pattern previews + AA contrast with a plain-language tooltip. **Proves:** *explained, intent-driven color feels more useful than a faster generator, in a clean minimalist tool.*
- **Phase 1 — export & share (deferred):** copy CSS/JSON, shareable link.
- **Phase 2 — extend (deferred):** image extraction, more visualize surfaces.

## 9. Idea-evaluation test (does a feature belong?)

1. Does it make the **reasoning** clearer or more useful? 2. Does it keep the **designer in control**? 3. Is it **minimalist/edgy**, not bloated? 4. Does it run in the Claude ecosystem with **one cheap call**?

---

## Output-contract summary

- **Facts:** Coolors (dated 2026-06-21) — free gives up to 5-color palettes + a WCAG AA/AAA contrast checker; **Pro ($3/mo) unlocks the per-color meaning/usage insight and the palette visualizer.** It generates fast (spacebar) and broadly. AI color tools are a crowded, mature category (Coolors, Khroma, Huemint, Adobe Color).
- **Interpretations:** the defensible, on-brand slice is **explained, intent-driven color with the rationale free and front-and-centre** — precisely what the leaders tease and paywall. The portfolio signal is AI-product judgment + restraint, not feature breadth.
- **Assumptions:** designers value always-on rationale enough to prefer it for intent-driven work (validate in demo).
- **Recommendations:** keep v1 minimalist; make the rationale panel the signature; one AI call; resist the urge to chase Coolors on breadth.
- **Risks:** (1) generic-feeling output/explanations in a polished category — mitigate via "insight over filler" + grounding. (2) scope creep from the bigger feature set — mitigate via non-goals + the idea-evaluation test. (3) thin moat (explanation is promptable) — accept; the point is a shipped, tasteful, well-judged portfolio piece.
- **Open questions:** see §6 Open.
- **Next actions:** Stage 2 PRD (prototype-light) — feature requirements, the JSON schema, data flow, and UX direction.

## GATE

- **Pillar into the PRD:** P01 — Explained color (carries P02 control + P03 craft).
- **Phase:** Phase 0 — v1.
- **Build-vs-spec fork:** mostly conceptually clear (we have a working preview) → PRD-light then build; the only experiential unknown is whether the *rationale quality* lands, which the prototype answers.
- **Decision owed:** confirm the two-column layout (output + persistent rationale panel) under the top controls, and the palette-size range (default 3–6).
