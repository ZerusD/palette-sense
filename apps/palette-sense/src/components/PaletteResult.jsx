// Left column, result state: the palette strip (hover for shade/tint, click to
// copy), the per-color name/role/AA row, contrast checks, and pattern previews.
import React from 'react'
import Tabs from './ui/Tabs.jsx'
import { IconInfo, IconCheck } from './icons.jsx'
import { badgeStyle } from '../lib/ui.js'
import { rampStop, readable, contrast, cap, aaInfo } from '../lib/color.js'
import { buildPattern } from '../lib/patterns.jsx'
import { PATTERNS, AA_TIP } from '../lib/palette.js'

const overline = {
  font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)',
  textTransform: 'uppercase', color: 'var(--text-muted)',
}

export default function PaletteResult({ result: res, ui, h }) {
  const surfColor = ui.surface === 'dark' ? res.surfDark : res.surfLight
  const prim = res.palette.find((c) => c.role === 'primary')
  const acc = res.palette.find((c) => c.role === 'accent')

  const pairs = [{ label: 'Text · Background', a: res.text, b: res.bg }]
  if (acc) pairs.push({ label: 'Accent · Background', a: acc.hex, b: res.bg })
  if (prim) pairs.push({ label: 'Primary · Background', a: prim.hex, b: res.bg })
  const mini = (c, left) => ({ width: 16, height: 16, borderRadius: left ? '4px 0 0 4px' : '0 4px 4px 0', background: c, display: 'inline-block' })

  return (
    <div className="ps-rise">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <span style={overline}>The palette</span>
        <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>
          hover a color for its shade &amp; tint · click to copy
        </span>
      </div>

      {/* swatch strip */}
      <div style={{ display: 'flex', height: 154, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-strong)', boxShadow: 'var(--edge-top), var(--shadow-md)' }}>
        {res.palette.map((c, idx) => {
          const hov = ui.hoverSwatch === idx
          const cop = ui.copied === c.hex
          const baseInk = readable(c.hex)
          const shadeHex = rampStop(c.hex, -18, 6)
          const tintHex = rampStop(c.hex, 18, -8)
          const strip = (extra) => ({
            position: 'absolute', left: 0, right: 0, height: hov ? '34%' : '0%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
            padding: 0, margin: 0, cursor: 'pointer', overflow: 'hidden',
            transition: 'height .32s var(--ease-out)', ...extra,
          })
          const labelMono = (hex) => ({ font: 'var(--type-mono)', fontSize: 11, letterSpacing: '0.04em', color: readable(hex), opacity: hov ? 1 : 0, transition: 'opacity .2s .08s' })
          return (
            <div
              key={idx}
              onMouseEnter={() => h.setHoverSwatch(idx)}
              onMouseLeave={() => h.setHoverSwatch(null)}
              onClick={() => h.copyHex(c.hex)}
              title="Click to copy"
              style={{ position: 'relative', flex: 1, minWidth: 0, height: '100%', background: c.hex, cursor: 'pointer', overflow: 'hidden' }}
            >
              <button onClick={(e) => { e.stopPropagation(); h.copyHex(shadeHex) }} aria-label="Copy darker shade" style={strip({ top: 0, background: shadeHex })}>
                <span style={labelMono(shadeHex)}>{shadeHex}</span>
              </button>
              <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', textAlign: 'center', font: 'var(--type-mono)', fontSize: 12, letterSpacing: '0.04em', color: baseInk, opacity: hov ? 1 : 0, transition: 'opacity .2s .08s', pointerEvents: 'none' }}>
                {c.hex}
              </span>
              <button onClick={(e) => { e.stopPropagation(); h.copyHex(tintHex) }} aria-label="Copy lighter tint" style={strip({ bottom: 0, background: tintHex })}>
                <span style={labelMono(tintHex)}>{tintHex}</span>
              </button>
              <span style={{ position: 'absolute', left: 13, bottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-mono)', fontSize: 12, letterSpacing: '0.04em', color: baseInk, opacity: hov ? 0 : 1, transition: 'opacity .2s' }}>
                {cop ? 'Copied' : c.hex}
                {cop && <IconCheck />}
              </span>
            </div>
          )
        })}
      </div>

      {/* per-color info row */}
      <div style={{ display: 'flex', marginTop: 16 }}>
        {res.palette.map((c, idx) => {
          const aa = aaInfo(c.ratio)
          return (
            <div key={idx} style={{ flex: 1, minWidth: 0, paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.hex, flex: 'none', marginTop: 4, boxShadow: '0 0 0 1px var(--border-strong)' }} />
                <span style={{ font: 'var(--weight-medium) var(--text-base)/1.2 var(--font-sans)', color: 'var(--text-primary)', textWrap: 'pretty' }}>{c.name}</span>
              </div>
              <span style={overline}>{cap(c.role)}</span>
              <span style={badgeStyle(aa.tone, { alignSelf: 'flex-start' })}>{c.ratio.toFixed(1)}:1 · {aa.label}</span>
            </div>
          )
        })}
      </div>

      {/* contrast checks */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px', marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span style={overline}>Contrast</span>
          <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={h.tipOn} onMouseLeave={h.tipOff}>
            <span style={{ display: 'inline-flex', color: 'var(--text-faint)', cursor: 'help' }}><IconInfo /></span>
            {ui.tip && (
              <span style={{ position: 'absolute', bottom: '140%', left: -10, zIndex: 60, width: 250, whiteSpace: 'normal', padding: '11px 13px', borderRadius: 'var(--radius-md)', background: 'var(--ash-800)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-md)', font: 'var(--weight-regular) var(--text-xs)/1.5 var(--font-sans)', color: 'var(--text-secondary)' }}>
                {AA_TIP}
              </span>
            )}
          </span>
        </div>
        {pairs.map((p, i) => {
          const r = Math.round(contrast(p.a, p.b) * 10) / 10
          const aa = aaInfo(r)
          return (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-flex', flex: 'none' }}>
                <span style={mini(p.a, true)} />
                <span style={mini(p.b, false)} />
              </span>
              <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{p.label}</span>
              <span style={badgeStyle(aa.tone)}>{r.toFixed(1)}:1 · {aa.label}</span>
            </div>
          )
        })}
      </div>

      {/* pattern previews */}
      <div style={{ marginTop: 26, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--edge-top)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={overline}>Palette in context</span>
          <Tabs
            variant="pill"
            items={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
            value={ui.surface}
            onChange={h.onSurface}
          />
        </div>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
          <Tabs
            variant="pill"
            items={PATTERNS.map((p) => ({ value: p[0], label: p[1] }))}
            value={ui.pattern}
            onChange={h.onPattern}
          />
        </div>
        <div style={{ background: surfColor, width: '100%', aspectRatio: '400 / 250', display: 'block' }}>
          {buildPattern(ui.pattern, res.palette, surfColor)}
        </div>
      </div>
    </div>
  )
}
