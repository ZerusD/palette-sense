// Pattern visualizers + harmony wheel — ported from the imported design.
// Each returns a React node (built with React.createElement, like the source)
// applying the palette in context on a chosen surface color.
import React from 'react'
import {
  shade, readable, lum, contrast, hexToRgb, rgbToHex, rgbToHsl, mulberry32, hashStr,
} from './color.js'

const h = React.createElement

export function buildPattern(pid, palette, surf) {
  const byRole = {}
  palette.forEach((c) => { byRole[c.role] = c.hex })
  const primary = byRole.primary || palette[0].hex
  const accent = byRole.accent || primary
  const secondary = byRole.secondary || accent
  const neutral = byRole.neutral || byRole.text || primary
  const chrom = [primary, accent, secondary, neutral]
  const isDark = lum(surf) < 0.45
  const ink = byRole.text && contrast(byRole.text, surf) > 2.6 ? byRole.text : readable(surf)
  const W = 400, Hh = 250
  const svg = (kids) =>
    h('svg', { viewBox: '0 0 ' + W + ' ' + Hh, width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid slice', style: { display: 'block' } }, kids)

  if (pid === 'ui') {
    const panel = isDark ? shade(surf, 6) : shade(surf, -4)
    const hair = isDark ? shade(surf, 15) : shade(surf, -13)
    const sub = isDark ? shade(ink, -32) : shade(ink, 32)
    const hi = readable(primary)
    const X = 46, Y = 26, CW = 308, CH = 198, clip = 'psuiclip'
    const g = []
    g.push(h('rect', { key: 'p', x: X, y: Y, width: CW, height: CH, fill: panel }))
    g.push(h('rect', { key: 'hd', x: X, y: Y, width: CW, height: 48, fill: primary }))
    g.push(h('circle', { key: 'av', cx: X + 26, cy: Y + 24, r: 11, fill: hi }))
    g.push(h('rect', { key: 't1', x: X + 47, y: Y + 16, width: 120, height: 7, rx: 3.5, fill: hi }))
    g.push(h('rect', { key: 't2', x: X + 47, y: Y + 28, width: 74, height: 6, rx: 3, fill: hi, opacity: 0.65 }))
    g.push(h('rect', { key: 'l1', x: X + 22, y: Y + 74, width: 198, height: 9, rx: 4.5, fill: ink, opacity: 0.92 }))
    g.push(h('rect', { key: 'l2', x: X + 22, y: Y + 92, width: 250, height: 7, rx: 3.5, fill: sub }))
    g.push(h('rect', { key: 'l3', x: X + 22, y: Y + 106, width: 228, height: 7, rx: 3.5, fill: sub }))
    g.push(h('rect', { key: 'cp1', x: X + 22, y: Y + 126, width: 56, height: 21, rx: 10.5, fill: accent }))
    g.push(h('rect', { key: 'cp2', x: X + 84, y: Y + 126, width: 56, height: 21, rx: 10.5, fill: secondary, opacity: 0.92 }))
    g.push(h('rect', { key: 'btn', x: X + 22, y: Y + 158, width: 88, height: 26, rx: 7, fill: accent }))
    g.push(h('rect', { key: 'bl', x: X + 38, y: Y + 169, width: 56, height: 5, rx: 2.5, fill: readable(accent) }))
    const bx = X + 158, by = Y + 186, bars = [30, 48, 26, 56, 40, 62]
    bars.forEach((b, i) => g.push(h('rect', { key: 'b' + i, x: bx + i * 24, y: by - b, width: 15, height: b, rx: 3, fill: i % 2 ? secondary : primary })))
    const defs = h('defs', { key: 'd' }, h('clipPath', { id: clip }, h('rect', { x: X, y: Y, width: CW, height: CH, rx: 14 })))
    return svg([
      h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf }),
      defs,
      h('g', { key: 'g', clipPath: 'url(#' + clip + ')' }, g),
      h('rect', { key: 'br', x: X, y: Y, width: CW, height: CH, rx: 14, fill: 'none', stroke: hair, strokeWidth: 1 }),
    ])
  }
  // Real-world surfaces: the palette applied to modern web/app layouts with
  // real type and controls — the "visualize your colors in action" piece.
  const panel = isDark ? shade(surf, 5) : shade(surf, -4)
  const hair = isDark ? shade(surf, 14) : shade(surf, -12)
  const sub = isDark ? shade(ink, -30) : shade(ink, 30)
  const onPrimary = readable(primary)

  if (pid === 'landing') {
    const kids = [h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })]
    // ambient accent glow behind the hero (the "alive" moment)
    kids.push(h('defs', { key: 'd' },
      h('radialGradient', { id: 'psheroglow' },
        h('stop', { offset: '0%', stopColor: accent, stopOpacity: 0.45 }),
        h('stop', { offset: '100%', stopColor: accent, stopOpacity: 0 }))))
    kids.push(h('ellipse', { key: 'glow', cx: 330, cy: 42, rx: 160, ry: 115, fill: 'url(#psheroglow)' }))
    // nav
    kids.push(h('circle', { key: 'logo', cx: 30, cy: 26, r: 5, fill: accent }))
    kids.push(h('text', { key: 'brand', x: 42, y: 30, fill: ink, style: { font: '700 11px var(--font-sans)', letterSpacing: '-0.02em' } }, 'palette'))
    ;['Product', 'Docs', 'Pricing'].forEach((label, i) =>
      kids.push(h('text', { key: 'nav' + i, x: 222 + i * 44, y: 30, fill: sub, textAnchor: 'middle', style: { font: '500 9px var(--font-sans)' } }, label)))
    kids.push(h('rect', { key: 'navbtn', x: 342, y: 15, width: 38, height: 20, rx: 10, fill: primary }))
    kids.push(h('text', { key: 'navbtnl', x: 361, y: 28.5, fill: onPrimary, textAnchor: 'middle', style: { font: '600 8.5px var(--font-sans)' } }, 'Sign up'))
    // display headline with one accent-colored phrase
    kids.push(h('text', { key: 'h1a', x: 30, y: 110, fill: ink, style: { font: '700 30px var(--font-sans)', letterSpacing: '-0.045em' } }, 'Ship your story'))
    kids.push(h('text', { key: 'h1b', x: 30, y: 144, style: { font: '700 30px var(--font-sans)', letterSpacing: '-0.045em' } },
      h('tspan', { key: 't1', fill: ink }, 'in '),
      h('tspan', { key: 't2', fill: primary }, 'living color'),
      h('tspan', { key: 't3', fill: ink }, '.')))
    // two short lines so the subline never runs under the stat card (x ≥ 268)
    kids.push(h('text', { key: 'sub1', x: 30, y: 164, fill: sub, style: { font: '400 10px var(--font-sans)' } }, 'Every hue placed with intent —'))
    kids.push(h('text', { key: 'sub2', x: 30, y: 177, fill: sub, style: { font: '400 10px var(--font-sans)' } }, 'from first draft to launch day.'))
    // CTA pair: solid primary + quiet ghost
    kids.push(h('rect', { key: 'cta1', x: 30, y: 193, width: 94, height: 27, rx: 6, fill: primary }))
    kids.push(h('text', { key: 'cta1l', x: 77, y: 210.5, fill: onPrimary, textAnchor: 'middle', style: { font: '600 10px var(--font-sans)' } }, 'Get started'))
    kids.push(h('rect', { key: 'cta2', x: 134, y: 193, width: 80, height: 27, rx: 6, fill: 'none', stroke: hair }))
    kids.push(h('text', { key: 'cta2l', x: 174, y: 210.5, fill: ink, textAnchor: 'middle', style: { font: '600 10px var(--font-sans)' } }, 'See docs'))
    // floating stat card
    kids.push(h('rect', { key: 'card', x: 268, y: 98, width: 104, height: 96, rx: 10, fill: panel, stroke: hair }))
    kids.push(h('circle', { key: 'cdot', cx: 286, cy: 118, r: 6, fill: secondary }))
    kids.push(h('text', { key: 'cval', x: 282, y: 148, fill: ink, style: { font: '700 20px var(--font-sans)', letterSpacing: '-0.03em' } }, '+48%'))
    kids.push(h('text', { key: 'clab', x: 283, y: 161, fill: sub, style: { font: '500 8px var(--font-sans)' } }, 'brand recall'))
    ;[10, 16, 8, 20, 14].forEach((v, i) =>
      kids.push(h('rect', { key: 'sb' + i, x: 283 + i * 15, y: 184 - v, width: 9, height: v, rx: 2, fill: i === 3 ? accent : neutral })))
    return svg(kids)
  }
  if (pid === 'aurora') {
    // algorithmic piece: parametric sine ribbons sweeping toward a glossy
    // specular orb — glossy/futuristic counterpoint to the editorial surface.
    // Deterministic math, palette-driven; accent is spent on the brightest edge.
    const kids = [h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })]
    kids.push(h('defs', { key: 'defs' },
      h('linearGradient', { id: 'psaur1', x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
        h('stop', { offset: '0%', stopColor: primary, stopOpacity: 0 }),
        h('stop', { offset: '45%', stopColor: primary, stopOpacity: 0.9 }),
        h('stop', { offset: '100%', stopColor: accent, stopOpacity: 0.95 })),
      h('linearGradient', { id: 'psaur2', x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
        h('stop', { offset: '0%', stopColor: secondary, stopOpacity: 0 }),
        h('stop', { offset: '60%', stopColor: secondary, stopOpacity: 0.75 }),
        h('stop', { offset: '100%', stopColor: primary, stopOpacity: 0.9 })),
      h('radialGradient', { id: 'psorb', cx: '35%', cy: '30%', r: '80%' },
        h('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: 0.95 }),
        h('stop', { offset: '20%', stopColor: accent, stopOpacity: 0.95 }),
        h('stop', { offset: '68%', stopColor: primary }),
        h('stop', { offset: '100%', stopColor: shade(primary, -26) })),
      h('filter', { id: 'psaurblur', x: '-40%', y: '-40%', width: '180%', height: '180%' },
        h('feGaussianBlur', { stdDeviation: 10 }))))

    // ribbon: closed band around a parametric sine centerline, lower-left → upper-right
    const ribbon = (yBase, amp, freq, phase, width) => {
      const top = [], bot = []
      for (let i = 0; i <= 24; i++) {
        const t = i / 24
        const x = t * 460 - 30
        const y = yBase - t * 120 + Math.sin(t * Math.PI * freq + phase) * amp
        top.push(x.toFixed(1) + ' ' + (y - width / 2).toFixed(1))
        bot.push(x.toFixed(1) + ' ' + (y + width / 2).toFixed(1))
      }
      return 'M ' + top.join(' L ') + ' L ' + bot.reverse().join(' L ') + ' Z'
    }
    kids.push(h('path', { key: 'glow', d: ribbon(214, 26, 1.6, 0.4, 36), fill: 'url(#psaur1)', filter: 'url(#psaurblur)', opacity: 0.55 }))
    kids.push(h('path', { key: 'rb1', d: ribbon(214, 26, 1.6, 0.4, 13), fill: 'url(#psaur1)' }))
    kids.push(h('path', { key: 'rb2', d: ribbon(236, 20, 1.3, 1.7, 7), fill: 'url(#psaur2)', opacity: 0.85 }))
    kids.push(h('path', { key: 'rb3', d: ribbon(192, 30, 1.9, 2.6, 2.5), fill: 'url(#psaur2)', opacity: 0.5 }))
    kids.push(h('path', { key: 'hairline', d: ribbon(172, 34, 2.2, 4.1, 1), fill: neutral, opacity: 0.4 }))

    // glossy orb with specular highlight + one thin orbit
    kids.push(h('circle', { key: 'orbit', cx: 310, cy: 76, r: 56, fill: 'none', stroke: neutral, strokeWidth: 0.75, opacity: 0.5 }))
    kids.push(h('circle', { key: 'orbdot', cx: 310 + 56 * Math.cos(-0.6), cy: 76 + 56 * Math.sin(-0.6), r: 3, fill: accent }))
    kids.push(h('circle', { key: 'orb', cx: 310, cy: 76, r: 38, fill: 'url(#psorb)' }))
    kids.push(h('ellipse', { key: 'spec', cx: 297, cy: 60, rx: 12, ry: 6.5, fill: '#ffffff', opacity: 0.55, transform: 'rotate(-24 297 60)' }))

    // quiet dot-grid texture anchoring the lower-left field
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        kids.push(h('circle', { key: 'tx' + r + c, cx: 34 + c * 13, cy: 36 + r * 13, r: 1.3, fill: neutral, opacity: 0.45 }))
      }
    }
    return svg(kids)
  }
  if (pid === 'currents') {
    // "Chromatic Currents" — seeded algorithmic art (see the DS doc in
    // docs/product/p01-explained-palette). Each chromatic color is a body on an
    // invisible hue wheel at its real hue angle, mass set by role; streamlines
    // integrate through the summed swirl field. The palette is the seed, so the
    // same palette always reproduces the identical artwork.
    const kids = [h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })]
    const CX = 200, CY = 125, WHEEL_R = 62
    const roleMass = { primary: 1.0, accent: 0.45, secondary: 0.6, neutral: 0.3 }
    const bodies = palette
      .filter((c) => roleMass[c.role])
      .map((c) => {
        const hue = rgbToHsl(hexToRgb(c.hex)).h
        const a = ((hue - 90) * Math.PI) / 180
        return {
          x: CX + WHEEL_R * Math.cos(a),
          y: CY + WHEEL_R * Math.sin(a),
          m: roleMass[c.role],
          hex: c.hex,
          role: c.role,
        }
      })
    if (!bodies.length) return svg(kids)
    const rng = mulberry32(hashStr(palette.map((c) => c.hex).join('') + 'currents'))

    // faint hue-wheel tick ring — the silent architecture
    kids.push(h('circle', { key: 'wheel', cx: CX, cy: CY, r: WHEEL_R + 34, fill: 'none', stroke: neutral, strokeWidth: 0.5, opacity: 0.25 }))

    const field = (x, y) => {
      let fx = 0.15, fy = -0.06 // base drift so edge lines still travel
      for (const b of bodies) {
        const dx = b.x - x, dy = b.y - y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const fall = b.m / (1 + (d / 95) * (d / 95)) / d
        fx += (-dy * 1.0 + dx * 0.22) * fall
        fy += (dx * 1.0 + dy * 0.22) * fall
      }
      return [fx, fy]
    }
    const nearest = (x, y) => {
      let best = bodies[0], bd = Infinity
      for (const b of bodies) {
        const d = (b.x - x) ** 2 + (b.y - y) ** 2
        const w = d / (b.m * b.m) // heavier bodies claim more territory
        if (w < bd) { bd = w; best = b }
      }
      return best
    }

    const lines = []
    for (let i = 0; i < 64; i++) {
      let x = rng() * 440 - 20, y = rng() * 290 - 20
      const owner = nearest(x, y)
      const pts = []
      for (let s = 0; s < 46; s++) {
        pts.push(x.toFixed(1) + ',' + y.toFixed(1))
        const [fx, fy] = field(x, y)
        const mag = Math.sqrt(fx * fx + fy * fy)
        if (mag < 0.004) break
        x += (fx / mag) * 5
        y += (fy / mag) * 5
        if (x < -30 || x > 430 || y < -30 || y > 280) break
      }
      if (pts.length > 6) lines.push({ pts: pts.join(' '), owner, o: 0.18 + rng() * 0.5 })
    }
    // draw calm lines first, accent wakes last (with a soft glow underlay)
    lines.filter((l) => l.owner.role !== 'accent').forEach((l, i) =>
      kids.push(h('polyline', { key: 'ln' + i, points: l.pts, fill: 'none', stroke: l.owner.hex, strokeWidth: 1.2, strokeLinecap: 'round', opacity: l.o })))
    lines.filter((l) => l.owner.role === 'accent').forEach((l, i) => {
      kids.push(h('polyline', { key: 'ag' + i, points: l.pts, fill: 'none', stroke: l.owner.hex, strokeWidth: 4, strokeLinecap: 'round', opacity: 0.12 }))
      kids.push(h('polyline', { key: 'al' + i, points: l.pts, fill: 'none', stroke: l.owner.hex, strokeWidth: 1.6, strokeLinecap: 'round', opacity: Math.min(0.95, l.o + 0.3) }))
    })
    // the bodies: halo + core, sized by mass
    bodies.forEach((b, i) => {
      kids.push(h('circle', { key: 'halo' + i, cx: b.x, cy: b.y, r: (4 + b.m * 6) * 2.4, fill: b.hex, opacity: 0.14 }))
      kids.push(h('circle', { key: 'body' + i, cx: b.x, cy: b.y, r: 4 + b.m * 6, fill: b.hex, opacity: 0.95 }))
    })
    return svg(kids)
  }
  if (pid === 'editorial') {
    const kids = [h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })]
    // kicker
    kids.push(h('text', { key: 'kick', x: 36, y: 44, fill: accent, style: { font: '600 8px var(--font-mono)', letterSpacing: '0.18em' } }, 'FIELD NOTES — № 07'))
    // serif display headline with an accent word
    kids.push(h('text', { key: 'h1', x: 34, y: 82, fill: ink, style: { font: '700 27px Georgia, serif', letterSpacing: '-0.01em' } }, 'The quiet power'))
    kids.push(h('text', { key: 'h2', x: 34, y: 112, style: { font: 'italic 700 27px Georgia, serif' } },
      h('tspan', { key: 'w1', fill: ink }, 'of a chosen '),
      h('tspan', { key: 'w2', fill: primary }, 'hue')))
    // byline
    kids.push(h('circle', { key: 'av', cx: 41, cy: 134, r: 6, fill: secondary }))
    kids.push(h('text', { key: 'meta', x: 53, y: 137, fill: sub, style: { font: '500 8px var(--font-sans)' } }, 'Bea Duarte · 6 min read'))
    kids.push(h('rect', { key: 'rule', x: 36, y: 150, width: 328, height: 1, fill: hair }))
    // body copy
    ;['Color is never decoration. In the hands of a',
      'careful designer it is hierarchy, rhythm and',
      'voice — the first thing a reader feels before',
      'a single word lands.'].forEach((line, i) =>
      kids.push(h('text', { key: 'b' + i, x: 36, y: 170 + i * 13, fill: sub, style: { font: '400 8.5px Georgia, serif' } }, line)))
    // pull quote with accent bar
    kids.push(h('rect', { key: 'qbar', x: 252, y: 162, width: 3, height: 48, fill: accent }))
    ;['“Restraint is what', 'makes the accent', 'sing.”'].forEach((line, i) =>
      kids.push(h('text', { key: 'q' + i, x: 264, y: 176 + i * 14, fill: ink, style: { font: 'italic 600 10.5px Georgia, serif' } }, line)))
    // tags
    ;[['Craft', secondary], ['Theory', neutral]].forEach(([t, c], i) => {
      kids.push(h('rect', { key: 'tag' + i, x: 36 + i * 58, y: 226, width: 50, height: 16, rx: 8, fill: 'none', stroke: c }))
      kids.push(h('text', { key: 'tagl' + i, x: 61 + i * 58, y: 237, textAnchor: 'middle', fill: ink, style: { font: '500 7.5px var(--font-sans)' } }, t))
    })
    return svg(kids)
  }
  if (pid === 'bauhaus') {
    const kids = [h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })]
    kids.push(h('circle', { key: 'c1', cx: 108, cy: 120, r: 78, fill: primary }))
    kids.push(h('path', { key: 'half', d: 'M 250 40 A 80 80 0 0 1 250 200 Z', fill: accent }))
    kids.push(h('path', { key: 'tri', d: 'M 298 58 L 380 58 L 339 150 Z', fill: secondary }))
    kids.push(h('rect', { key: 'bar', x: 186, y: 30, width: 16, height: 190, fill: neutral }))
    kids.push(h('circle', { key: 'c2', cx: 108, cy: 120, r: 30, fill: surf }))
    kids.push(h('circle', { key: 'c3', cx: 339, cy: 198, r: 22, fill: primary }))
    kids.push(h('path', { key: 'arc', d: 'M 36 212 A 72 72 0 0 1 108 140', fill: 'none', stroke: accent, strokeWidth: 14 }))
    return svg(kids)
  }
  if (pid === 'type') {
    const kids = [h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })]
    kids.push(h('text', { key: 'big', x: 36, y: 154, fill: ink, style: { fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 132, letterSpacing: '-0.05em' } }, 'Aa'))
    kids.push(h('rect', { key: 'ul', x: 40, y: 176, width: 148, height: 10, fill: accent }))
    kids.push(h('text', { key: 'cap', x: 40, y: 212, fill: isDark ? shade(ink, -26) : shade(ink, 26), style: { fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 15, letterSpacing: '0.04em' } }, 'The quick brown fox'))
    chrom.forEach((c, i) => kids.push(h('rect', { key: 'sw' + i, x: 300, y: 40 + i * 42, width: 62, height: 30, rx: 6, fill: c })))
    return svg(kids)
  }
  if (pid === 'blend') {
    const cs = [primary, accent, secondary, neutral].filter(Boolean)
    const rgbs = cs.map((c) => hexToRgb(c))
    const n = rgbs.length
    const base = rgbToHex({ r: rgbs.reduce((a, b) => a + b.r, 0) / n, g: rgbs.reduce((a, b) => a + b.g, 0) / n, b: rgbs.reduce((a, b) => a + b.b, 0) / n })
    const spots = [[58, 52], [346, 44], [372, 210], [52, 206], [206, 126], [252, 186]]
    const fid = 'psblendf'
    const defs = h('defs', { key: 'd' }, h('filter', { id: fid, x: '-40%', y: '-40%', width: '180%', height: '180%' }, h('feGaussianBlur', { stdDeviation: 44 })))
    const blobs = spots.map((p, i) => h('ellipse', { key: 'e' + i, cx: p[0], cy: p[1], rx: 154, ry: 142, fill: cs[i % n] }))
    return svg([h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: base }), defs, h('g', { key: 'g', filter: 'url(#' + fid + ')' }, blobs)])
  }
  return svg([h('rect', { key: 'bg', x: 0, y: 0, width: W, height: Hh, fill: surf })])
}

export function harmonyWheel(palette) {
  const S = 136, c = S / 2, R = 47
  const chrom = palette.filter((p) => ['primary', 'accent', 'secondary'].includes(p.role))
  const kids = [h('circle', { key: 'ring', cx: c, cy: c, r: R, fill: 'none', stroke: 'var(--border-default)', strokeWidth: 1 })]
  for (let i = 0; i < 24; i++) {
    const a = ((i * 15 - 90) * Math.PI) / 180
    kids.push(h('circle', { key: 't' + i, cx: c + (R + 8) * Math.cos(a), cy: c + (R + 8) * Math.sin(a), r: 1, fill: 'var(--text-faint)' }))
  }
  const pts = chrom.map((p) => {
    const hsv = rgbToHsl(hexToRgb(p.hex))
    const a = ((hsv.h - 90) * Math.PI) / 180
    const rad = R * 0.4 + (hsv.s / 100) * R * 0.6
    return { x: c + rad * Math.cos(a), y: c + rad * Math.sin(a), hex: p.hex }
  })
  if (pts.length > 1) {
    kids.push(h('polygon', { key: 'poly', points: pts.map((p) => p.x + ',' + p.y).join(' '), fill: 'color-mix(in oklab, var(--surface-raised) 60%, transparent)', stroke: 'var(--border-strong)', strokeWidth: 1.4 }))
  }
  pts.forEach((p, i) => {
    kids.push(h('circle', { key: 'o' + i, cx: p.x, cy: p.y, r: 9, fill: p.hex, stroke: 'var(--surface-panel)', strokeWidth: 2.5 }))
  })
  return h('svg', { viewBox: '0 0 ' + S + ' ' + S, width: S, height: S, style: { display: 'block' } }, kids)
}
