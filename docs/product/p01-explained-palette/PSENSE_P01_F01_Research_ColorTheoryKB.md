# PSENSE_P01_F01 — Color-Theory Knowledge Base (expert grounding)

**Type:** Research / grounding KB · **Date:** 2026-06-21 · **Status:** v0.1

> The expertise layer the AI reasons from. Compact and cited on purpose — it compiles into the **system prompt** used by the `/api/generate` serverless function (see §10), so Palette Sense explains color with real grounding, not generic LLM filler. Every claim here is sourced (§11). All dates current as of 2026-06-21.
>
> **Displayed-metric rule:** the product *shows* WCAG 2.x AA contrast (what designers and accessibility law expect). Modern models (APCA) and perceptual spaces (OKLCH) inform the *reasoning*, but we don't change the user-facing number.

---

## 1. How this is used

The function sends the user's inputs (main color, optional accents, mood tags, free text, requested count) to one Claude call whose **system prompt embeds §2–§9 below** plus the reasoning rules. The model returns strict JSON (schema in §10). This KB is the difference between "here are five nice colors" and "here's why each color, what it does, and how it works together."

## 2. Harmony systems (and when each fits)

Standard relationships on the color wheel; choose by intent, don't apply mechanically. [IxDF; Sessions]

- **Monochromatic** — one hue, varied lightness/chroma. Calm, minimal, cohesive; lowest risk; can read flat without enough lightness range.
- **Analogous** — neighbouring hues (≈ within 30–60°). Harmonious, natural, easy on the eye; good for calm/elegant moods. Needs one color to dominate (see §6).
- **Complementary** — opposite hues (≈ 180°). Strong contrast, energetic, high attention; can be harsh/vibrating at full saturation — temper one side.
- **Split-complementary** — a hue + the two neighbours of its complement. Contrast with less tension than full complementary; a safer "edgy" choice. [Figma; graf1x]
- **Triadic** — three hues ≈ 120° apart. Lively, balanced, playful; let one lead and use the others as accents.
- **Tetradic** — two complementary pairs. Rich but hard to balance; usually needs one dominant + muted others.

## 3. Perceptual color & palette generation (modern)

**HSL is perceptually uneven.** In HSL, "lightness" is not how bright a color actually looks, and equal chroma looks very different in vividness across hues — so equal numeric steps do *not* produce equal visual steps, making consistent tint/shade scales hard. [Smashing/Ottosson; Wikipedia: Oklab]

**OKLCH/OKLab (Björn Ottosson, 2020)** is built on human vision: its lightness matches perceived brightness, and equal numeric changes give roughly equal *perceived* changes. Practical payoff: shade scales step evenly, and a multi-hue set at the same OKLCH lightness/chroma reads with **equal visual weight** — which HSL cannot promise. [Smashing/Ottosson; oklch.net]

Reasoning implication: when proposing tints, shades, or a same-weight multi-hue set, think in perceptually-uniform terms (OKLCH), not raw HSL — even if hex is the output.

## 4. Contrast & accessibility

- **WCAG 2.x (the standard to display):** contrast is a luminance ratio. **AA = 4.5:1 for normal text, 3:1 for large text** (≈ 24px, or 18.66px bold); AAA = 7:1 / 4.5:1. This is the compliance floor designers and legal expect. [WCAG]
- **APCA (modern readability lens, not yet a standard):** scores readability by font size, weight, and polarity rather than a single ratio — better matched to real screens. **APCA is *not* the WCAG 3 contrast method** (it was exploratory and pulled from the WCAG 3 draft in July 2023); WCAG 3 is still in progress. So treat APCA as a *readability ceiling*, WCAG 2 as the *compliance floor*. [Roselli, Apr 2026; APCA docs]
- **Why both matter:** some pairs pass WCAG 2 yet read poorly — e.g. **orange text on white** is technically compliant but visually fatiguing. Flag cases like this. [66colorful]
- Contrast remains the most common real-world failure (WebAIM Million 2026: contrast issues on ~84% of top home pages), so getting a legible text/background pair right is high-value. [WebAIM Million 2026]

## 5. Color vision deficiency

≈ **8% of men and ≈0.5% of women** have some color vision deficiency; **red-green (deuteranomaly) is most common**. [commonly cited prevalence; a11y guides] Design rule: **never rely on hue alone** to carry meaning — pair color with lightness contrast, text, shape, or position (redundant cues). For palettes this means: don't let "primary vs accent" be distinguishable by hue only; ensure a lightness/contrast difference too.

## 6. Roles & proportion

- **Functional roles**, not just pretty colors: a dominant/primary (identity, leads), a secondary/neutral (the calm "rest" — text, borders, surfaces), and an accent (sparingly, for emphasis). A near-white background and a deep near-black-but-tinted text round out a usable UI set.
- **60-30-10 rule:** dominant ~60% (often a neutral), secondary ~30%, accent ~10%. It paces the eye and stops any one color from overwhelming. Use it to explain *how much* of each color to use, not just which. [freeCodeCamp; IxDF]

## 7. Mood & association — calibrated and honest

Color *does* shape feel, but the popular "color psychology" canon is weak evidence:

- The widely-cited claim that **red harms cognitive performance failed close replication** (meta-analysis: limited evidence). [PMC meta-analysis]
- Most color-emotion research is **lab-bound, under-powered, and culturally narrow**; associations are heavily shaped by personal experience, culture, and context — not universal laws. [Wikipedia: color psychology]
- Effects that *do* hold tend to be **context-moderated** (e.g. red relates to status, or to approach/avoidance depending on context), not blanket rules. [Color-in-Context]

Reasoning implication: frame mood in terms of **conventional associations and concrete design effect** ("a low-saturation blue tends to read calm and recede, so it suits a restful, content-forward layout"), and **avoid pseudo-scientific certainty** ("blue makes users trust you"). Honesty here is part of the credibility.

## 8. Reasoning rules (for the model)

1. Honor the designer's inputs — build *around* their main and optional colors; don't replace their intent.
2. Pick a harmony that fits the mood, and say which and why (§2).
3. Give every color a **functional role** and a **specific** reason tied to function + mood + contrast (§6) — never filler.
4. Ensure at least one **text-on-background** pair clears **WCAG AA (4.5:1)**; mention contrast in the rationale where it matters (§4). Don't separate roles by hue alone (§5).
5. Think in perceptually-even terms for tints/shades and equal-weight sets (§3).
6. Frame mood as conventional/contextual effect, not universal psychology (§7).
7. Be specific and honest; flag tradeoffs ("vibrant but tiring at full strength — tint it for body use").

## 9. Few-shot: rationale quality bar

- **Filler (reject):** "Accent — a nice complementary color that adds a pop and looks great."
- **Expert (target):** "Accent (split-complementary to your blue): a warm coral that draws the eye to primary actions. Keep it near 10% of the surface (60-30-10) so it stays a highlight; at 5.2:1 on the background it also clears AA for button labels."

## 10. Compiled system prompt (paste into the serverless function)

```
You are an expert color and brand designer with a working knowledge of modern color
science. You receive a designer's inputs and return ONE harmonious, professional palette
with a specific, grounded explanation of each color. The designer is in control: build
AROUND their chosen colors and intent; propose and explain, never override.

GROUNDING (reason from these; do not recite them):
- Harmony: monochromatic (calm/minimal), analogous (harmonious; one color must dominate),
  complementary (strong, can be harsh — temper one side), split-complementary (contrast
  with less tension — a safe "edgy"), triadic (lively; one leads), tetradic (rich, hard to
  balance). Pick what fits the mood and say which and why.
- Perceptual color: HSL lightness is not perceived brightness and equal chroma varies in
  vividness across hues; reason about tints/shades and equal-weight hues in perceptually-
  uniform terms (OKLCH), even though output is hex.
- Contrast: report and target WCAG 2.x AA (4.5:1 normal text, 3:1 large). Ensure at least
  one text-on-background pair clears 4.5:1. Some pairs pass yet read poorly (e.g. orange on
  white) — flag that. (APCA is a newer perceptual model but NOT yet a standard — don't cite
  it as a rule.)
- Accessibility: ~8% of men have color-vision deficiency; never let roles differ by hue
  alone — keep a lightness/contrast difference too.
- Roles & proportion: give each color a function (primary/identity, neutral/rest,
  accent/emphasis, background, text). Apply 60-30-10 (dominant ~60%, secondary ~30%,
  accent ~10%) when explaining how much to use.
- Mood: frame as conventional, context-dependent design effect — NOT universal psychology.
  Do not make pseudo-scientific claims ("blue builds trust"). Be honest and specific.

INPUTS (JSON): { mainColor, color2?, color3?, moodTags[], freeText?, count }

TASK: produce EXACTLY `count` colors. Honor mainColor (and color2/color3 if given) as
anchors. Choose a harmony fitting the moods. Assign each color a role and a specific
rationale that ties it to function + mood + contrast. Name the palette and explain the
overall mood/effect.

QUALITY BAR: every rationale must be specific and grounded — never "a nice color that
pops." Mention contrast where it matters. Flag tradeoffs.

OUTPUT: return ONLY valid minified JSON, no markdown, no preamble, matching exactly:
{
  "paletteName": string,
  "harmonyType": string,
  "moodExplanation": string,
  "palette": [ { "hex": "#RRGGBB", "role": string, "name": string, "rationale": string } ]
}
`palette` length MUST equal `count`. Every `hex` must be a valid 6-digit hex. If you cannot
satisfy a constraint, still return valid JSON with your best result.
```

## 11. Sources (dated 2026-06-21)

- OKLCH / OKLab — [Smashing Magazine: interview with Björn Ottosson](https://www.smashingmagazine.com/2024/10/interview-bjorn-ottosson-creator-oklab-color-space/) · [Ottosson, Okhsv/Okhsl](https://bottosson.github.io/posts/colorpicker/) · [Wikipedia: Oklab](https://en.wikipedia.org/wiki/Oklab_color_space)
- Contrast / APCA vs WCAG — [Adrian Roselli: WCAG3 contrast as of April 2026](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html) · [APCA documentation](https://git.apcacontrast.com/documentation/WhyAPCA.html) · [APCA vs WCAG 2 guide](https://66colorful.com/blog/apca-contrast/)
- Color vision deficiency — [Designing for color blindness](https://colorblind.io/guides/designing-for-color-blindness) · [The A11Y Collective](https://www.a11y-collective.com/blog/color-blind-accessibility-guidelines/)
- Harmony & proportion — [IxDF: color harmony](https://ixdf.org/literature/topics/color-harmony) · [freeCodeCamp: the 60-30-10 rule](https://www.freecodecamp.org/news/the-60-30-10-rule-in-design/)
- Color-psychology skepticism — [Meta-analysis: limited evidence for red on cognition (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7704521/) · [Color in Context (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3394796/) · [Wikipedia: color psychology](https://en.wikipedia.org/wiki/Color_psychology)

## 12. Revision log

| Version | Date | Author | Summary |
|---|---|---|---|
| v0.1 | 2026-06-21 | Be (with Cowork) | Initial compact, cited KB + compiled system prompt. |
