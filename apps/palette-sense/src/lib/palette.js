// Palette domain logic — ported from the imported Palette Sense design.
//
// `buildPalette` is the LOCAL deterministic generator. In Milestone 1 it acts
// as the engine behind Generate so the full UI is demoable without a backend.
// In Milestone 3 the Generate action will instead POST to /api/generate and the
// returned palette will be run through `decoratePalette` (below) to attach the
// same derived fields the UI consumes (ratio / bg / text / surfDark / surfLight).
import {
  clamp, hexToRgb, rgbToHsl, hsl, lum, contrast, isHex, mulberry32, hashStr,
} from './color.js'
import { hueName, nameColor, nameAdjs } from './naming.js'

export const MOODS = [
  'calm', 'energetic', 'edgy', 'elegant', 'playful', 'minimal',
  'bold', 'high-contrast', 'warm', 'cool', 'muted',
]

// Real-world surfaces first (the "visualize your colors in action" piece),
// then the abstract studies. Fewer, richer previews by design.
export const PATTERNS = [
  ['landing', 'Landing'], ['dynamic', 'Dynamic'], ['uiset', 'UI set'],
  ['ui', 'Dashboard'], ['editorial', 'Editorial'], ['aurora', 'Aurora'],
  ['type', 'Type'], ['bauhaus', 'Bauhaus'], ['blend', 'Blend'],
]

export const EXAMPLES = [
  { label: 'Calm SaaS', main: '3B6FE0', moods: ['calm', 'minimal'], size: 5, intent: 'a trustworthy analytics dashboard' },
  { label: 'Edgy fintech', main: 'FF5C38', moods: ['edgy', 'bold', 'high-contrast'], size: 5, intent: 'a crypto trading terminal' },
  { label: 'Warm editorial', main: 'E0913B', moods: ['elegant', 'warm', 'muted'], size: 5, intent: 'a longform reading experience' },
]

export const AA_TIP =
  'AA means text at this contrast is comfortably readable for most people. 4.5:1 is the standard for normal text; 3:1 passes for large or bold text.'

export function chooseHarmony(moods) {
  const has = (m) => moods.includes(m)
  if (has('minimal') || has('muted')) return { name: 'Monochromatic', offs: [0, 0, 0] }
  if (has('high-contrast')) return { name: 'Complementary', offs: [0, 180, 150] }
  if (has('bold') || has('energetic')) return { name: 'Triadic', offs: [0, 120, 240] }
  if (has('edgy')) return { name: 'Split-complementary', offs: [0, 156, 204] }
  if (has('playful')) return { name: 'Triadic', offs: [0, 128, 232] }
  if (has('elegant') || has('calm')) return { name: 'Analogous', offs: [0, 28, -26] }
  return { name: 'Analogous', offs: [0, 32, -28] }
}

export function intentBias(intent) {
  const t = String(intent || '').toLowerCase()
  const m = []
  if (/ocean|sea|water|aqua|sky|calm|trust|finance|bank|medical|health|tech/.test(t)) m.push('cool')
  if (/sun|warm|cozy|food|autumn|earth|coffee|editorial|luxury|craft/.test(t)) m.push('warm')
  let dSat = 0
  let dHue = null
  if (/forest|nature|eco|organic|plant|green/.test(t)) dHue = 140
  if (/crypto|neon|game|night|energy|sport/.test(t)) dSat += 8
  if (/luxury|premium|minimal|elegant|refined/.test(t)) dSat -= 10
  return { extraMood: m, dSat, dHue }
}

export function rationale(role, ratio, harm, darkBg) {
  switch (role) {
    case 'primary':
      return 'Your anchor. It sets the overall tone and carries recognition — reach for it on primary actions, key surfaces, and the first thing you want the eye to find.'
    case 'accent':
      return 'The spark. Drawn from a ' + harm.name.toLowerCase() + ' relationship to your primary, it adds just enough tension to highlight links, selected states, and a single call to action.'
    case 'secondary':
      return 'A supporting voice. It extends the palette for secondary buttons, tags, and data categories without competing with the primary.'
    case 'neutral':
      return 'The quiet workhorse. Use it for borders, dividers, muted text, and disabled states — structure you feel but never notice.'
    case 'background':
      return 'The stage. Its ' + (darkBg ? 'deep, low-chroma' : 'soft, near-white') + ' cast gives everything room to breathe and keeps long sessions easy on the eyes.'
    case 'text':
      return 'Built for reading. It clears WCAG AA against the background at ' + ratio + ':1, so body copy stays comfortable for as many people as possible.'
    default:
      return ''
  }
}

export function moodExpl(moods, harm, darkBg, palette) {
  const m = moods.length ? moods.map((x) => x.replace('-', ' ')).join(', ') : 'balanced'
  const prim = palette.find((c) => c.role === 'primary')
  const acc = palette.find((c) => c.role === 'accent')
  const rel = {
    Complementary: 'sit opposite each other on the wheel',
    Triadic: 'are spaced evenly around the wheel',
    'Split-complementary': 'pair your color with two near-opposites',
    Analogous: 'sit close together on the wheel',
    Monochromatic: 'share one hue at different depths',
    'Custom blend': 'combine the colors you chose',
  }[harm.name]
  return 'A ' + harm.name.toLowerCase() + ' scheme, tuned for ' + m + '. ' +
    (prim ? prim.name : 'Your primary') + ' and ' + (acc ? acc.name : 'the accent') + ' ' + rel +
    ', so the set stays harmonious while still giving the eye one clear place to land. The ' +
    (darkBg ? 'deep' : 'light') + ' ground lets the colors carry the energy.'
}

// Derive the UI-facing fields for a palette of { hex, role, name } items:
// per-item contrast ratio against the appropriate reference role, the
// background/text anchors, and dark/light surface colors for pattern previews.
// Used both by buildPalette (below) and, later, by API responses.
function decorate({ paletteName, harmonyType, moodExplanation, palette }, nHue) {
  const map = {}
  palette.forEach((c) => { map[c.role] = c.hex })
  const bg = map.background || '#0e0d0b'
  const text = map.text || '#f6f1e7'
  const decorated = palette.map((c) => {
    const ref = c.role === 'background' ? text : bg
    const ratio = Math.round(contrast(c.hex, ref) * 10) / 10
    return { ...c, ratio, refRole: c.role === 'background' ? 'text' : 'background' }
  })
  const fallbackHue = nHue == null ? 30 : nHue
  const surfDark = lum(bg) < 0.5 ? bg : hsl(fallbackHue, 12, 9)
  const surfLight = lum(bg) >= 0.5 ? bg : hsl(fallbackHue, 10, 96)
  return { paletteName, harmonyType, moodExplanation, palette: decorated, surfDark, surfLight, bg, text }
}

export function buildPalette(p) {
  const seed = p.seed || 0
  const rng = mulberry32(hashStr(p.main + '|' + (p.moods || []).join(',') + '|' + p.size + '|' + seed))
  const jit = (a) => (rng() * 2 - 1) * a
  const base = rgbToHsl(hexToRgb('#' + p.main))
  const H = base.h
  let moods = (p.moods || []).slice()
  const ib = intentBias(p.intent)
  ib.extraMood.forEach((m) => { if (!moods.includes(m)) moods.push(m) })
  const has = (m) => moods.includes(m)
  let satBias = 0
  if (has('bold') || has('energetic') || has('playful')) satBias += 14
  if (has('high-contrast')) satBias += 8
  if (has('muted')) satBias -= 26
  if (has('calm') || has('minimal')) satBias -= 16
  if (has('elegant')) satBias -= 8
  satBias += ib.dSat
  const lightLeaning = (has('minimal') || has('elegant') || has('calm') || has('muted')) &&
    !(has('edgy') || has('bold') || has('high-contrast'))
  const darkBg = !lightLeaning
  let nHue = H
  if (has('warm')) nHue = 34
  else if (has('cool')) nHue = 212
  else if (ib.dHue != null) nHue = ib.dHue
  const harm = chooseHarmony(moods)
  const baseL = clamp(base.l, 40, 64)
  const map = {}
  map.background = darkBg
    ? hsl(nHue, clamp(10 + (has('warm') || has('cool') ? 3 : 0), 6, 18), clamp(9 + jit(2), 6, 14))
    : hsl(nHue, clamp(8, 4, 12), clamp(96 + jit(1.5), 93, 98))
  map.text = darkBg
    ? hsl(nHue, 16, clamp(92 + jit(2), 88, 96))
    : hsl(nHue, 28, clamp(15 + jit(2), 10, 20))
  map.primary = hsl(H, clamp(base.s + satBias * 0.5 + jit(3), 30, 92), clamp(baseL + jit(2), 38, 66))
  {
    const sBoost = harm.name === 'Monochromatic' ? -6 : 10
    const lTone = harm.name === 'Monochromatic' ? baseL + 16 : base.l + 6
    map.accent = hsl(H + harm.offs[1] + jit(4), clamp(base.s + satBias * 0.5 + sBoost + jit(3), 36, 95), clamp(lTone + jit(3), 42, 72))
  }
  {
    const lTone = harm.name === 'Monochromatic' ? baseL - 14 : base.l + 10
    map.secondary = hsl(H + harm.offs[2] + jit(4), clamp(base.s + satBias * 0.4 + jit(3), 30, 88), clamp(lTone + jit(3), 30, 74))
  }
  map.neutral = hsl(nHue, clamp(12 + jit(2), 6, 22), darkBg ? 48 : 54)
  if (isHex(p.c2)) map.accent = ('#' + p.c2).toUpperCase()
  if (isHex(p.c3)) {
    if (p.size >= 6) map.secondary = ('#' + p.c3).toUpperCase()
    else map.neutral = ('#' + p.c3).toUpperCase()
  }
  const custom = isHex(p.c2) || isHex(p.c3)
  const roleSets = {
    3: ['background', 'primary', 'accent'],
    4: ['background', 'text', 'primary', 'accent'],
    5: ['background', 'text', 'primary', 'accent', 'neutral'],
    6: ['background', 'text', 'primary', 'accent', 'secondary', 'neutral'],
  }
  const roles = roleSets[p.size] || roleSets[5]
  const palette = roles.map((role) => {
    const hex = (map[role] || map.primary).toUpperCase()
    const ref = role === 'background' ? map.text : map.background
    const ratio = Math.round(contrast(hex, ref) * 10) / 10
    return { hex, role, name: nameColor(hex, seed), ratio, refRole: role === 'background' ? 'text' : 'background', rationale: rationale(role, ratio, harm, darkBg) }
  })
  const surfDark = lum(map.background) < 0.5 ? map.background : hsl(nHue, 12, 9)
  const surfLight = lum(map.background) >= 0.5 ? map.background : hsl(nHue, 10, 96)
  const adj = nameAdjs(moods, darkBg)
  const noun = hueName(H)
  const paletteName = adj[Math.floor(seed * 3 + 1) % adj.length] + ' ' + noun[Math.floor(seed) % noun.length]
  const harmonyType = custom ? 'Custom blend' : harm.name
  const moodExplanation = moodExpl(moods, harm, darkBg, palette)
  return { paletteName, harmonyType, moodExplanation, palette, surfDark, surfLight, bg: map.background, text: map.text }
}

// Attach UI-facing derived fields to a validated API response, normalizing
// hex casing and role names. The KB prompt suggests compound functional roles
// ("primary/identity", "accent/emphasis") — the UI, wheel, and patterns key on
// the first segment, lowercase.
export function decoratePalette(api) {
  const palette = (api.palette || []).map((c) => ({
    ...c,
    hex: String(c.hex).toUpperCase(),
    role: String(c.role).toLowerCase().split('/')[0].trim(),
  }))
  const bgItem = palette.find((c) => c.role === 'background')
  let nHue = 30
  if (bgItem) nHue = rgbToHsl(hexToRgb(bgItem.hex)).h
  return decorate({ ...api, palette }, nHue)
}
