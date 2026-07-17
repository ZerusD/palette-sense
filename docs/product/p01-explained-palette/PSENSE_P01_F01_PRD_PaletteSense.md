# PSENSE_P01_F01 — PRD: Palette Sense (v1)

**Mode:** PROTOTYPE-LIGHT · **Pillar:** P01 Explained color · **Phase:** Phase 0 (v1) · **Layer:** Requirements / what · **Date:** 2026-06-21

> Behavioral/observable requirements + the JSON contract, data flow, and UX direction for the build. Resolves upward to `DEFINITION_BRIEF.md`. PROTOTYPE-LIGHT: only demo-relevant sections completed.

## 1. Overview

Palette Sense v1: the designer sets a main color (+ optional accents), a mood, and a palette size; pressing Generate fires **one Anthropic call** that returns a harmonious palette plus reasoning. The output shows the palette as swatches *and* an **always-on rationale panel** explaining the overall mood/effect and, per color, why it's there, what it does, and how it helps — alongside pattern previews and plain-language AA contrast. Serves P01 (explained color); carries P02 (designer control) and P03 (accessible, minimalist craft).

## 2. Problem statement

Generators produce colors fast but not the *why*; the tools that do explain (Coolors' meaning/usage) **paywall it**. Designers — especially those still building their eye — are left guessing about mood-fit, each color's function, and accessibility. v1 makes the reasoning the free, always-on centrepiece. *(Facts/assumptions in `DEFINITION_BRIEF.md` §2.)*

## 3. Goals & non-goals

**Goals (testable):**

1. A first-time user generates an explained palette **without instructions**.
2. The user can **see, for every color, a specific reason** it's in the palette — not a generic label.
3. The user can **set the palette size** and the result honors it.
4. AA contrast is shown **and understandable to a non-designer** (plain-language tooltip).
5. A generate is **one AI call**, cheap, and degrades to a **friendly error** if the response is malformed.

**Non-goals:** paywalled insight/Pro tiers; random spacebar generation; accounts/saved library; token/design-system export; image extraction. *(Owned per `DEFINITION_BRIEF.md` §7.)*

## 4. User value

- "It told me **why** these colors — what each one does and when to use it."
- "It matched the **mood** I asked for, and explained the effect."
- "I stayed **in control** — my base color and intent drove it."
- "I can tell it's **accessible**, and I finally understand what AA means."
- "It looks **clean and sharp**, not loud."

## 5. Product principles (inherited)

The reasoning is the product · designer in control · one call, cost-aware · insight over filler · minimalist & edgy craft · accessible & legible · secrets server-side. *(Full text in `DEFINITION_BRIEF.md` §5.)*

## 6. Feature requirements

> P0 = ship-blocker · P1 = if-free · P2 = later.

### A. Input (designer control — P02)
- **A1 (P0):** Required main color via picker + hex entry.
- **A2 (P0):** Optional 2nd and 3rd colors (picker + hex).
- **A3 (P0):** Mood selection — a row of quick tags (calm, energetic, edgy, elegant, playful, minimal, bold, high-contrast, warm, cool, muted), multi-select.
- **A4 (P0):** Optional free-text intent box.
- **A5 (P0):** **Palette-size selector** — user picks how many colors (range 3–6, default 5).
- **A6 (P0):** A single **Generate** action; AI runs only on press.

### B. The AI call (foundation)
- **B1 (P0):** Exactly **one** Anthropic (Claude Sonnet) call per Generate — never a loop.
- **B2 (P0):** Key used **server-side only** (Vercel function + env var); never in client code or responses.
- **B3 (P0):** The model returns **only valid JSON** (no markdown/preamble) matching §7 schema, honoring the requested color count.
- **B4 (P0):** The call's system prompt **embeds the expert color-theory KB** (`PSENSE_P01_F01_Research_ColorTheoryKB.md` §10) so rationale is grounded, not generic. The KB is a static prefix → enable **prompt caching** to keep cost negligible.

### C. Palette output (P01)
- **C1 (P0):** Render the returned colors as swatches (count = requested), each with **hex (click-to-copy)**, a **role** label (primary/accent/neutral/background/…), and a **name**.
- **C2 (P0):** Show the **harmony type** used.

### D. Always-on rationale panel (the differentiator — P01)
- **D1 (P0):** A **persistent panel** (not a hidden tab) showing the **overall mood/effect** explanation.
- **D2 (P0):** **Per-color rationale** — for each swatch, *why this color, what it does, how it helps* — visible alongside or on the swatch, not buried.
- **D3 (P0):** Rationale must be **specific and grounded in color theory**, never filler.

### E. Patterns / visualize (P03)
- **E1 (P0):** Apply the palette to a set of **switchable pattern previews**.
- **E2 (P1):** **Expanded, more intricate** pattern set (candidates: stripes, dot grid, checker, concentric/arcs, Bauhaus shapes, isometric blocks, a poster/type sample, a UI card) — finalize ≥6 during build.

### F. Accessibility (P03)
- **F1 (P0):** Show WCAG **AA contrast** for the meaningful pairs (e.g. text/background, accent/background).
- **F2 (P0):** A **tooltip** explaining AA in plain language for non-designers (e.g. "AA = text at this contrast is comfortably readable for most people; 4.5:1 is the standard for normal text").

### G. Craft & robustness
- **G1 (P0):** **Minimalist, edgy/cool** aesthetic — restrained, not big-and-bold; generous neutral space; refined type.
- **G2 (P0):** **Validate** the JSON (schema + hex format); on malformed/failed response show a **friendly error**, not a crash.

### Summary table

| REQ | Group | Requirement | Priority |
|---|---|---|---|
| A1–A2 | Input | Main (req) + optional colors, picker+hex | P0 |
| A3–A4 | Input | Mood tags + free text | P0 |
| A5 | Input | Palette-size selector (3–6, default 5) | P0 |
| A6 | Input | Single Generate trigger | P0 |
| B1–B3 | AI call | One Sonnet call, key server-side, strict JSON honoring count | P0 |
| B4 | AI call | System prompt embeds the cited color-theory KB (grounded rationale) + prompt caching | P0 |
| C1–C2 | Palette | Swatches w/ hex-copy, role, name; harmony type | P0 |
| D1–D3 | Rationale | Always-on mood + per-color "why", specific | P0 |
| E1 | Patterns | Switchable pattern previews | P0 |
| E2 | Patterns | Expanded/intricate set (≥6) | P1 |
| F1–F2 | A11y | AA contrast + plain-language tooltip | P0 |
| G1 | Craft | Minimalist/edgy aesthetic | P0 |
| G2 | Robustness | Validate + friendly error | P0 |

## 7. Data contract & flow

**Request** (front-end → `/api/generate`):
```
{ mainColor, color2?, color3?, moodTags: string[], freeText?, count: number }
```

**Response** (model → strict JSON, validated):
```
{
  paletteName: string,                 // short, evocative
  harmonyType: string,                 // e.g. "analogous", "complementary"
  moodExplanation: string,             // overall mood & effect — panel header
  palette: [
    { hex: string, role: string, name: string, rationale: string }
    // rationale = why this color / what it does / how it helps
  ]                                    // length === requested count
}
```

**Flow:** user sets inputs → Generate → POST to `/api/generate` → serverless function calls Anthropic (Sonnet, one call, key from env) instructing strict-JSON per schema and the requested count → returns JSON → front-end validates (schema + each hex + count) → renders swatches + always-on rationale + patterns + AA contrast. Malformed/failed → friendly error.

## 8. UX direction (supersedes the earlier two-tab idea)

- **Layout:** controls across the **top**; below, **two columns** — left = palette + pattern previews; right = the **persistent rationale panel** (always visible). The mood/why is no longer a hidden tab; it's the standing right-hand companion. *(This is a change from the first preview — flagged for confirmation.)*
- **Aesthetic:** minimalist, edgy/cool, restrained; lots of neutral space; one or two type sizes; thin borders; the *colors* are the only loud thing.
- **Per-color rationale presentation:** on click/hover of a swatch, or inline under each swatch in the panel — designer can read each "why" without leaving the screen.
- **AA tooltip:** an info affordance next to each contrast indicator.

## 9. Success signals

| Dimension | Qualitative signal | Proxy |
|---|---|---|
| Explained value | "I understand why each color is here" | every swatch has a specific rationale *(threshold)* |
| Intent fit | "It matched my mood" | — *(human)* |
| Control | size + base colors honored | count returned === requested *(threshold)* |
| Accessibility legibility | non-designer understands AA | tooltip present + correct ratios *(threshold)* |
| Craft | reads minimalist/edgy, not generic | — *(human)* |

## 10. Risks & failure modes

| Failure | Likelihood | Severity | Mitigation |
|---|---|---|---|
| Generic rationale ("a nice accent") | Med | High | D3 "insight over filler"; prompt with good/bad examples; grounding |
| Malformed JSON breaks render | Med | Med | G2 strict validation + friendly error; low temperature; schema in prompt |
| Looks generic despite intent | Med | Med | G1 minimalist/edgy craft pass; restrained design |
| Scope creep from bigger feature set | Med | Med | Non-goals + idea-evaluation test |

## 11. Open questions

- Final pattern set (which ≥6, how intricate) — Owner: Be + build. Status: open.
- Palette-size range — default 3–6; confirm. Owner: Be.
- Rationale presentation: inline-under-swatch vs click-to-expand — Owner: Be; prototype decides.
- Model: Sonnet vs Haiku — Owner: Be; build plan.

## 12. Appendix

`[Deferred to full PRD at handoff]`

---

## Output-contract summary

- **Facts:** Coolors free = up to 5 colors + AA/AAA contrast checker; meaning/usage + visualizer are Pro (dated 2026-06-21). One Anthropic call returning strict JSON is straightforward and cheap.
- **Interpretations:** the always-on rationale panel (D1–D3) is the make-or-break; everything else is well-trodden.
- **Assumptions:** eyeball + peer judgment suffice for a portfolio v1.
- **Recommendations:** build P0s; spend the effort on the rationale prompt and the minimalist craft; keep it one call.
- **Risks:** see §10 — generic rationale is the top risk.
- **Open questions:** see §11.
- **Next actions:** confirm UX direction + size range → improved preview and/or Claude Code build (scaffold + `/api/generate`).

## GATE

- **P0 set agreed:** A1–A6, B1–B3, C1–C2, D1–D3, E1, F1–F2, G1–G2.
- **Decision owed before build:** confirm the two-column layout (persistent rationale panel) and the palette-size range.
- **Ready to build:** yes, once layout is confirmed — the JSON contract and data flow are set.
