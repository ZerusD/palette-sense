// Color math — ported verbatim from the imported Palette Sense design.
// Pure functions (no `this`). Used by palette generation, pattern rendering,
// contrast/AA badges, and shade/tint ramps.

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export function hexToRgb(hex) {
  hex = String(hex).replace('#', '').trim()
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const n = parseInt(hex, 16)
  const v = isNaN(n) ? 0 : n
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
}

export function rgbToHex(o) {
  const f = (x) => ('0' + Math.round(clamp(x, 0, 255)).toString(16)).slice(-2)
  return '#' + f(o.r) + f(o.g) + f(o.b)
}

export function rgbToHsl(o) {
  let r = o.r / 255, g = o.g / 255, b = o.b / 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
  let h = 0, s = 0, l = (mx + mn) / 2
  if (mx !== mn) {
    const d = mx - mn
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (mx === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToRgb(o) {
  let h = (((o.h % 360) + 360) % 360) / 360
  let s = clamp(o.s, 0, 100) / 100
  let l = clamp(o.l, 0, 100) / 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const k = (t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    r = k(h + 1 / 3); g = k(h); b = k(h - 1 / 3)
  }
  return { r: r * 255, g: g * 255, b: b * 255 }
}

export const hsl = (h, s, l) => rgbToHex(hslToRgb({ h, s, l }))

export function shade(hex, dl) {
  const c = rgbToHsl(hexToRgb(hex))
  return hsl(c.h, c.s, clamp(c.l + dl, 0, 100))
}

export function rampStop(hex, dl, ds) {
  const c = rgbToHsl(hexToRgb(hex))
  return hsl(c.h, clamp(c.s + (ds || 0), 0, 100), clamp(c.l + dl, 0, 100))
}

export function relLum(o) {
  const f = (c) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(o.r) + 0.7152 * f(o.g) + 0.0722 * f(o.b)
}

export const lum = (hex) => relLum(hexToRgb(hex))

export function contrast(a, b) {
  const L1 = lum(a), L2 = lum(b)
  const hi = Math.max(L1, L2), lo = Math.min(L1, L2)
  return (hi + 0.05) / (lo + 0.05)
}

export const readable = (bg) => (lum(bg) > 0.42 ? '#17120d' : '#f6f1e7')

export const isHex = (s) => /^[0-9a-fA-F]{6}$/.test(String(s || '').trim())
export const san = (v) => String(v || '').replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase()
export const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1)

export function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// WCAG 2.x AA classification for a contrast ratio.
export function aaInfo(ratio) {
  if (ratio >= 4.5) return { label: 'AA', tone: 'success' }
  if (ratio >= 3) return { label: 'AA large', tone: 'warning' }
  return { label: 'Low', tone: 'neutral' }
}
