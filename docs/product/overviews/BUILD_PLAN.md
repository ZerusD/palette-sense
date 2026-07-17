# Build Plan — Palette Sense (v1 prototype)

**Layer:** Execution / how to build · **Consumes:** PRD `PSENSE_P01_F01` + the color-theory KB `PSENSE_P01_F01_Research_ColorTheoryKB.md` + the Claude Design export · **Date:** 2026-06-21

> A throwaway, polished portfolio prototype — optimize for a clean live demo and inspectable code, not scale/auth/persistence.

## 1. Prototype thesis

A designer sets a main color (+ optional accents), a mood, and a palette size; **one Anthropic call** returns a harmonious palette and an **always-on explanation of why each color is there** — grounded in the color-theory KB. The reasoning is the star.

## 2. Stack decision

React + Vite + Tailwind SPA (implement the imported Claude Design UI) · one Vercel serverless function `/api/generate` · Anthropic Messages API, **Claude Sonnet, one call per Generate**, with **prompt caching** on the KB system prompt · Vercel Hobby. No database, no auth, no router.

*Justification:* the work is a static front end + one stateless function; Sonnet's synthesis carries the rationale quality; caching the static KB prefix makes a knowledge-dense prompt almost free per call.

## 3. Scope

**In:** the imported UI (controls + palette/patterns + persistent rationale panel); `/api/generate`; the KB-grounded system prompt; strict-JSON parsing + validation; AA contrast display + tooltip; copy-to-clipboard; running/error states.

**Out (ruthless):** accounts, paywall/Pro, saved library, profile pages, export beyond copy, image extraction, any second screen.

## 4. Demo acceptance criteria

Done when a viewer can: set colors + mood + size and Generate with no instructions; see a palette of the **requested size** with roles, names, click-to-copy hex, and AA contrast (with the plain-language tooltip); read an **always-on rationale** — overall mood + a specific "why" per color; switch among the pattern previews; and do it from a public Vercel link with the **key never exposed**, degrading to a friendly error on a malformed response.

## 5. Repo / file layout

```
apps/palette-sense/
  README.md
  index.html
  src/
    App.jsx                 # imported Claude Design UI, wired to /api/generate
    components/             # Controls, PaletteList, Patterns, RationalePanel
    lib/validate.js         # JSON schema + hex + count validation
  api/
    generate.js            # one Anthropic Sonnet call; key from env; prompt caching
    colorTheoryPrompt.js    # the compiled system prompt (KB §10), as a constant
  .env.local                # ANTHROPIC_API_KEY (gitignored)
  package.json
  vercel.json
```

## 6. Milestones → tasks

1. **Import + scaffold** — import the Claude Design project; stand up the Vite + React + Tailwind app from it (no API). See the layout.
2. **System prompt** — drop the compiled prompt from the KB (`PSENSE_P01_F01_Research_ColorTheoryKB.md` §10) into `colorTheoryPrompt.js`.
3. **`/api/generate`** — one Sonnet call: system = the KB prompt (cached), user = the request JSON; key from env, server-side; return the model's JSON. *(Build against a mock first if useful, then real.)*
4. **Validate** — parse strict JSON; check schema + each hex + `palette.length === count`; friendly error on failure.
5. **Wire UI** — controls → POST; render palette (roles, names, hex-copy, AA contrast + tooltip), the persistent rationale panel (mood + per-color why), and the pattern previews.
6. **Polish + deploy** — minimalist/edgy pass; deploy to Vercel; add the env var; smoke-test the live link.

## 7. Context to hand Claude Code

- System prompt + reasoning rules + schema: KB `PSENSE_P01_F01_Research_ColorTheoryKB.md` §8–§10.
- Requirements + data contract: PRD `PSENSE_P01_F01_PRD` §6–§8.
- UI: the imported Claude Design project (the look) — build against it.

## 8. Setup checklist (you've done most of this)

- **GitHub** — have it; Claude Code creates/pushes the repo.
- **Anthropic key + spend cap** — have it; reuse the same key (one $20-capped key covers all prototypes).
- **Vercel** — create a new project from this repo (separate deploy, per hub-and-spoke). Add `ANTHROPIC_API_KEY` as an env var. Key stays server-side only.
- **Cost:** one cheap call per Generate, small output, KB prompt cached → fractions of a cent per generate; the spend cap is the backstop.

## 9. Throwaway & handoff note

Experience demonstrator, not production. After it works, grow the light PRD to full and keep the KB as a reusable artifact.

## 10. Kickoff

The ready-to-paste Claude Code prompt (Claude Design import + build instructions) lives in `CLAUDE_CODE_HANDOFF.md`.

---

## GATE

- Stack chosen + scope ruthless. The kickoff handoff is self-contained once the Claude Design import line is filled in.
- Before building: confirm the Claude Design export link is in the handoff; everything else (key, accounts) is ready.
