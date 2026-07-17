// Evocative color + palette naming — ported from the imported design.
// Deterministic given (hex, seed) so names are stable across re-renders.
import { rgbToHsl, hexToRgb } from './color.js'

export function hueName(h) {
  const fams = [
    [12, ['Crimson', 'Scarlet', 'Ruby']],
    [28, ['Coral', 'Ember', 'Persimmon']],
    [42, ['Amber', 'Tangerine', 'Rust']],
    [58, ['Gold', 'Honey', 'Saffron']],
    [74, ['Citron', 'Chartreuse', 'Lemon']],
    [100, ['Lime', 'Fern', 'Moss']],
    [140, ['Sage', 'Emerald', 'Jade']],
    [165, ['Teal', 'Pine', 'Spruce']],
    [190, ['Aqua', 'Lagoon', 'Cyan']],
    [210, ['Sky', 'Cerulean', 'Azure']],
    [240, ['Cobalt', 'Sapphire', 'Marine']],
    [268, ['Indigo', 'Iris', 'Periwinkle']],
    [292, ['Violet', 'Amethyst', 'Lavender']],
    [318, ['Purple', 'Orchid', 'Plum']],
    [338, ['Magenta', 'Fuchsia', 'Mulberry']],
    [400, ['Rose', 'Blush', 'Cerise']],
  ]
  for (let i = 0; i < fams.length; i++) {
    if (h < fams[i][0]) return fams[i][1]
  }
  return fams[0][1]
}

export function nameColor(hex, seed) {
  const c = rgbToHsl(hexToRgb(hex))
  const s = c.s, l = c.l, h = c.h
  const pick = (arr) => arr[Math.floor(Math.abs(h + (seed || 0))) % arr.length]
  if (s < 12) {
    let set
    if (l < 16) set = ['Onyx', 'Obsidian', 'Pitch']
    else if (l < 34) set = ['Charcoal', 'Graphite', 'Slate']
    else if (l < 58) set = ['Stone', 'Ash', 'Pewter']
    else if (l < 80) set = ['Fog', 'Dove', 'Mist']
    else set = ['Bone', 'Porcelain', 'Linen']
    return pick(set)
  }
  const base = pick(hueName(h))
  let mod = ''
  if (l < 22) mod = 'Deep '
  else if (l < 36) mod = 'Dusk '
  else if (l > 80) mod = 'Pale '
  else if (l > 66) mod = 'Soft '
  else if (s > 80) mod = 'Vivid '
  else if (s < 30) mod = 'Muted '
  return mod + base
}

export function nameAdjs(moods, darkBg) {
  const p = []
  const a = (...x) => p.push(...x)
  const has = (m) => moods.includes(m)
  if (has('calm')) a('Quiet', 'Still', 'Hushed')
  if (has('energetic')) a('Electric', 'Kinetic', 'Bright')
  if (has('edgy')) a('Sharp', 'Stark', 'Raw')
  if (has('elegant')) a('Refined', 'Velvet', 'Noble')
  if (has('playful')) a('Sunny', 'Lively', 'Pop')
  if (has('minimal')) a('Bare', 'Plain', 'Clean')
  if (has('bold')) a('Bold', 'Vivid', 'Loud')
  if (has('high-contrast')) a('Crisp', 'Hard', 'Stark')
  if (has('warm')) a('Warm', 'Amber', 'Sun')
  if (has('cool')) a('Cool', 'Tide', 'Frost')
  if (has('muted')) a('Dusty', 'Faded', 'Worn')
  if (!p.length) a(darkBg ? 'Ember' : 'Daylight', 'Modern', 'Composed')
  return p
}
