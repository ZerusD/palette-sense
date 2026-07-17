# Palette Sense — app

React + Vite + Tailwind SPA implementing the imported Claude Design (Ember design
system). One screen: set a main color (+ optional accents), a mood, and a size →
**Generate** → a harmonious palette with an always-on per-color rationale.

## Run locally (with the real AI call)

```bash
npm install
cp .env.example .env.local      # put your ANTHROPIC_API_KEY in it
npx vercel dev --listen 3000    # terminal 1 — serves /api/generate
npm run dev                     # terminal 2 — Vite on :5173, proxies /api → :3000
```

Vite proxies `/api/*` to `localhost:3000`, so any server that answers
`POST /api/generate` there works — `vercel dev` for the real call, or a mock
for key-free demos.

## Status

| Milestone | Work |
|---|---|
| 1 ✅ | Imported design recreated; all UI states working. |
| 2 ✅ | `src/lib/colorTheoryPrompt.js` — the compiled KB system prompt (Research KB §10, mirrored verbatim). |
| 3 ✅ | `api/generate.js` — ONE Anthropic call per Generate (`claude-sonnet-4-6`, swappable to `claude-haiku-4-5`), official SDK, key from env server-side only, structured outputs for guaranteed-parseable JSON, low temperature, `cache_control` on the KB prompt. |
| 4 ✅ | `src/lib/validate.js` — schema + hex + `palette.length === count`, shared by server and client; friendly error card (input vs. engine failures) on any failure. |
| 5 ✅ | `run()` in `App.jsx` POSTs the PRD §7 request contract and renders the validated, `decoratePalette()`-decorated response. |
| 6 | Deploy to Vercel (root dir `apps/palette-sense`); add `ANTHROPIC_API_KEY` env var. |

### Honest notes

- **Prompt caching works** (verified live): the 1,105-token KB system prompt is
  written to cache on the first Generate and read from cache on subsequent ones
  (`cache_read_input_tokens: 1105` observed). Measured cost ≈ **1.6¢** for a
  cold call, **≈1.2¢** warm — dominated by the ~800 output tokens.
- **One call means one call:** a malformed model response returns a friendly
  error — it is never re-asked. The SDK's built-in retry covers only failed
  HTTP requests (429/5xx/network), not content.
- **Regenerate with identical inputs** may return a similar palette
  (temperature 0.3, chosen for reliable grounded output).

## Structure

```
api/
  generate.js           Vercel serverless function — the ONE Anthropic call
src/
  lib/
    colorTheoryPrompt.js  the compiled KB system prompt (source of truth: Research KB §10)
    validate.js         response-contract validation (schema + hex + count)
    color.js            color math (hex/hsl/rgb, contrast, AA, shade/tint, rng)
    naming.js           evocative color + palette names
    palette.js          buildPalette (local), decoratePalette (for API), constants
    patterns.jsx        10 pattern visualizers + the harmony wheel
    ui.js               badge style helper
  components/
    ui/Button.jsx       Ember Button (ported from the DS bundle)
    ui/Tabs.jsx         Ember Tabs (pill + underline)
    icons.jsx           inline Lucide-style icons
    Controls.jsx        top controls (colors, mood, intent, size, Generate)
    PaletteResult.jsx   swatches + contrast checks + pattern previews
    RationalePanel.jsx  the always-on "Why these colors" panel
    States.jsx          initial / loading / error states
  styles/tokens.css     Ember design tokens (verbatim from the import)
  index.css             Tailwind + app globals/keyframes
  App.jsx               state, handlers, layout
```

## Security

`ANTHROPIC_API_KEY` is read only inside `api/generate.js`, never in client code
or the bundle (the built `dist/` contains zero references to the SDK or key).
Server errors return generic messages — no upstream details leak to the
browser. `.env*` is gitignored; see `.env.example`.
