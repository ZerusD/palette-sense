// Top controls: main color (+ optional 2nd/3rd), mood chips, intent, size, Generate.
// Mirrors the imported design's controls section.
import React from 'react'
import Tabs from './ui/Tabs.jsx'
import Button from './ui/Button.jsx'
import { IconPlus, IconX, IconSparkle, IconShuffle } from './icons.jsx'
import { isHex } from '../lib/color.js'
import { MOODS } from '../lib/palette.js'

const overline = {
  font: 'var(--type-overline)',
  letterSpacing: 'var(--tracking-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}
const optional = { color: 'var(--text-faint)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }
const hexField = {
  display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px',
  background: 'var(--surface-inset)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
}
const hexInput = {
  width: 84, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)',
  font: 'var(--type-mono)', fontSize: 'var(--text-base)', letterSpacing: '0.05em', textTransform: 'uppercase',
}
const hiddenColorInput = {
  position: 'absolute', left: '-50%', top: '-50%', width: '200%', height: '200%',
  opacity: 0, cursor: 'pointer', border: 'none', padding: 0, margin: 0,
}
const swStyle = (empty, hex) => ({
  position: 'relative', width: 42, height: 42, borderRadius: 'var(--radius-md)',
  background: empty ? 'var(--surface-inset)' : hex,
  border: empty ? '1px dashed var(--border-strong)' : '1px solid var(--border-strong)',
  boxShadow: 'var(--edge-top)', cursor: 'pointer', overflow: 'hidden', flex: 'none',
})
const chipBase = {
  display: 'inline-flex', alignItems: 'center', gap: 7, height: 32, padding: '0 13px',
  borderRadius: 'var(--radius-sm)', font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
  cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.01em',
  transition: 'all var(--dur-fast) var(--ease-out)',
}

export default function Controls({ state, h, accent, mainValid }) {
  const s = state
  const [genHover, setGenHover] = React.useState(false)
  const [hoverChip, setHoverChip] = React.useState(null)
  const [hoverSw, setHoverSw] = React.useState(null)

  const mainHex = '#' + s.main
  const c2Has = isHex(s.c2)
  const c3Has = isHex(s.c3)
  const isGenerating = s.status === 'generating'

  // returns element props (style + hover handlers) for a color swatch label
  const swatchProps = (key, picker) => ({
    style: { ...picker, filter: hoverSw === key ? 'brightness(1.08)' : undefined },
    onMouseEnter: () => setHoverSw(key),
    onMouseLeave: () => setHoverSw(null),
  })

  const genBtnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 9, height: 44, padding: '0 22px',
    borderRadius: 'var(--radius-md)', border: '1px solid transparent', background: accent.color,
    color: accent.ink, font: 'var(--weight-semibold) var(--text-md)/1 var(--font-sans)',
    letterSpacing: '-0.01em', cursor: 'pointer', boxShadow: accent.glow + ', var(--edge-top)',
    transition: 'filter var(--dur-fast) var(--ease-out)',
    filter: genHover ? 'brightness(1.06)' : undefined,
  }
  const spinnerStyle = {
    width: 14, height: 14, borderRadius: '50%',
    border: '2px solid color-mix(in oklab, ' + accent.ink + ' 30%, transparent)',
    borderTopColor: accent.ink, animation: 'ps-spin .7s linear infinite', display: 'inline-block', flex: 'none',
  }

  return (
    <section
      style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--edge-top)', borderRadius: 'var(--radius-lg)', padding: '22px 24px 24px',
      }}
    >
      {/* color inputs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 28 }}>
        {/* main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={overline}>Main color <span style={{ color: 'var(--accent)' }}>*</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label {...swatchProps('main', swStyle(false, mainValid ? mainHex : '#3a352e'))}>
              <input type="color" value={mainValid ? mainHex : '#3B82C4'} onChange={h.onMainPick} aria-label="Pick main color" style={hiddenColorInput} />
            </label>
            <div style={hexField}>
              <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>#</span>
              <input value={s.main} onChange={h.onMainHex} maxLength={6} placeholder="2A6FDB" spellCheck={false} style={hexInput} />
            </div>
          </div>
          {s.status === 'error' && !mainValid && (
            <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--danger)' }}>
              Enter a 6-digit hex, e.g. 2A6FDB
            </span>
          )}
        </div>

        {/* second */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={overline}>Second <span style={optional}>· optional</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label {...swatchProps('c2', swStyle(!c2Has, '#' + s.c2))}>
              <input type="color" value={c2Has ? '#' + s.c2 : '#7A7367'} onChange={h.onC2Pick} aria-label="Pick second color" style={hiddenColorInput} />
              {!c2Has && (
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <IconPlus />
                </span>
              )}
            </label>
            <div style={hexField}>
              <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>#</span>
              <input value={s.c2} onChange={h.onC2Hex} maxLength={6} placeholder="——" spellCheck={false} style={hexInput} />
            </div>
            {c2Has && (
              <button onClick={h.clearC2} aria-label="Clear second color" style={clearBtn}><IconX /></button>
            )}
          </div>
        </div>

        {/* third */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={overline}>Third <span style={optional}>· optional</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label {...swatchProps('c3', swStyle(!c3Has, '#' + s.c3))}>
              <input type="color" value={c3Has ? '#' + s.c3 : '#7A7367'} onChange={h.onC3Pick} aria-label="Pick third color" style={hiddenColorInput} />
              {!c3Has && (
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <IconPlus />
                </span>
              )}
            </label>
            <div style={hexField}>
              <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>#</span>
              <input value={s.c3} onChange={h.onC3Hex} maxLength={6} placeholder="——" spellCheck={false} style={hexInput} />
            </div>
            {c3Has && (
              <button onClick={h.clearC3} aria-label="Clear third color" style={clearBtn}><IconX /></button>
            )}
          </div>
        </div>
      </div>

      {/* mood chips */}
      <div style={{ marginTop: 24 }}>
        <span style={overline}>Mood <span style={optional}>· choose any</span></span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {MOODS.map((k) => {
            const on = s.moods.includes(k)
            const style = on
              ? { ...chipBase, background: 'var(--accent-soft)', border: '1px solid var(--accent-soft-bd)', color: 'var(--coral-200)' }
              : { ...chipBase, background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }
            if (!on && hoverChip === k) style.borderColor = 'var(--border-strong)'
            return (
              <button
                key={k}
                onClick={() => h.toggleMood(k)}
                onMouseEnter={() => setHoverChip(k)}
                onMouseLeave={() => setHoverChip(null)}
                style={style}
              >
                {on && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flex: 'none', boxShadow: '0 0 6px var(--accent)' }} />}
                {k.replace('-', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* intent + size + generate */}
      <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 20 }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={overline}>Describe the intent <span style={optional}>· optional</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, height: 44, padding: '0 14px', background: 'var(--surface-inset)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-faint)', display: 'inline-flex', flex: 'none' }}><IconSparkle size={15} /></span>
            <input
              value={s.intent}
              onChange={h.onIntent}
              placeholder="“a calm analytics dashboard”, “warm editorial”…"
              spellCheck={false}
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', font: 'var(--type-body)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={overline}>Colors</span>
          <Tabs
            variant="pill"
            items={[3, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) }))}
            value={String(s.size)}
            onChange={h.onSize}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button variant="secondary" size="lg" onClick={h.surpriseMe}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <IconShuffle size={15} />
              Surprise me
            </span>
          </Button>
          <button
            onClick={h.generate}
            onMouseEnter={() => setGenHover(true)}
            onMouseLeave={() => setGenHover(false)}
            style={genBtnStyle}
          >
            {isGenerating ? <span style={spinnerStyle} /> : <IconSparkle size={16} />}
            {s.status === 'result' ? 'Regenerate' : 'Generate'}
          </button>
        </div>
      </div>

      {s.status === 'result' && s.dirty && (
        <div style={{ marginTop: 14, font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--warning)' }} />
          Inputs changed — regenerate to update the palette.
        </div>
      )}
    </section>
  )
}

const clearBtn = {
  appearance: 'none', border: 'none', background: 'none', cursor: 'pointer',
  color: 'var(--text-faint)', display: 'inline-flex', padding: 4,
}
