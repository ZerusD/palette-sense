// Response-contract validation (PRD §7 / requirement G2) — shared by the
// serverless function (before returning) and the client (before rendering).
// Returns null when valid, otherwise a short human-readable reason.

const HEX6 = /^#[0-9a-fA-F]{6}$/

export function validatePaletteResponse(data, count) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'response is not an object'
  const isStr = (v) => typeof v === 'string' && v.trim().length > 0
  if (!isStr(data.paletteName)) return 'missing paletteName'
  if (!isStr(data.harmonyType)) return 'missing harmonyType'
  if (!isStr(data.moodExplanation)) return 'missing moodExplanation'
  if (!Array.isArray(data.palette)) return 'palette is not an array'
  if (data.palette.length !== count) {
    return `expected ${count} colors, got ${data.palette.length}`
  }
  for (let i = 0; i < data.palette.length; i++) {
    const c = data.palette[i]
    if (!c || typeof c !== 'object') return `palette[${i}] is not an object`
    if (!HEX6.test(String(c.hex || ''))) return `palette[${i}].hex is not a "#RRGGBB" hex`
    if (!isStr(c.role)) return `palette[${i}].role is missing`
    if (!isStr(c.name)) return `palette[${i}].name is missing`
    if (!isStr(c.rationale)) return `palette[${i}].rationale is missing`
  }
  return null
}
