// Left-column non-result states: initial (clickable examples), generating
// (calm skeleton), and a friendly error. Mirror the imported design.
import React from 'react'
import Button from './ui/Button.jsx'
import { IconAlert, IconArrowRight } from './icons.jsx'
import { EXAMPLES, buildPalette } from '../lib/palette.js'

const overline = {
  font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)',
  textTransform: 'uppercase', color: 'var(--text-muted)',
}

export function LoadingState({ size }) {
  const spinnerMuted = {
    width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--surface-raised)',
    borderTopColor: 'var(--accent)', animation: 'ps-spin .7s linear infinite', display: 'inline-block', flex: 'none',
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <span style={spinnerMuted} />
        <span style={{ font: 'var(--type-body-lg)', color: 'var(--text-secondary)' }}>Composing a {size}-color palette…</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {Array.from({ length: size }, (_, i) => (
          <div key={i} style={{ flex: '1 1 116px', minWidth: 116, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 13, padding: '6px 0' }}>
            <span className="ps-pulse" style={{ width: 66, height: 66, borderRadius: '50%', background: 'var(--surface-raised)' }} />
            <span className="ps-pulse" style={{ width: '64%', height: 11, borderRadius: 6, background: 'var(--surface-raised)' }} />
            <span className="ps-pulse" style={{ width: '40%', height: 8, borderRadius: 4, background: 'var(--surface-raised)' }} />
          </div>
        ))}
      </div>
      <div className="ps-pulse" style={{ marginTop: 30, aspectRatio: '400/250', width: '100%', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }} />
    </div>
  )
}

export function InitialState({ onUse }) {
  const [hoverEx, setHoverEx] = React.useState(null)
  const examples = EXAMPLES.map((ex) => {
    const res = buildPalette({ ...ex, seed: 0 })
    return {
      ex,
      label: ex.label,
      intentLabel: ex.intent,
      moodText: ex.moods.map((m) => m.replace('-', ' ')).join(' · '),
      dots: res.palette.map((c) => c.hex),
    }
  })
  return (
    <div>
      <span style={overline}>Start from an example</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }}>
        {examples.map((e, i) => {
          const hov = hoverEx === i
          return (
            <button
              key={i}
              onClick={() => onUse(e.ex)}
              onMouseEnter={() => setHoverEx(i)}
              onMouseLeave={() => setHoverEx(null)}
              style={{
                textAlign: 'left', appearance: 'none', cursor: 'pointer', background: 'var(--surface-card)',
                border: '1px solid ' + (hov ? 'var(--border-strong)' : 'var(--border-subtle)'),
                boxShadow: 'var(--edge-top)', borderRadius: 'var(--radius-lg)', padding: 18,
                display: 'flex', flexDirection: 'column', gap: 14,
                transform: hov ? 'translateY(-2px)' : 'none',
                transition: 'transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
              }}
            >
              <div style={{ display: 'flex', gap: 7 }}>
                {e.dots.map((hex, di) => (
                  <span key={di} style={{ width: 22, height: 22, borderRadius: '50%', background: hex, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 1px rgba(0,0,0,.25)' }} />
                ))}
              </div>
              <div>
                <div style={{ font: 'var(--weight-semibold) var(--text-lg)/1.1 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--text-strong)' }}>{e.label}</div>
                <div style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginTop: 5 }}>{e.intentLabel}</div>
              </div>
              <div style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)', textTransform: 'capitalize' }}>{e.moodText}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)', color: 'var(--accent)', marginTop: 2 }}>
                Use this setup<IconArrowRight />
              </span>
            </button>
          )
        })}
      </div>
      <p style={{ font: 'var(--type-body)', color: 'var(--text-faint)', marginTop: 18 }}>…or set your own color and mood above, then Generate.</p>
    </div>
  )
}

const ERROR_COPY = {
  input: {
    title: 'Couldn’t read that color',
    message: 'That color didn’t read. Enter a 6-digit hex like 2A6FDB — then generate again.',
  },
  api: {
    title: 'Couldn’t compose that palette',
    message: 'The palette engine hit a snag — a network hiccup or an off-spec response. Your inputs are fine; try generating again.',
  },
}

export function ErrorState({ kind = 'input', onRetry }) {
  const copy = ERROR_COPY[kind] || ERROR_COPY.input
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--accent-soft-bd)', boxShadow: 'var(--edge-top)', borderRadius: 'var(--radius-lg)', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <span style={{ display: 'inline-flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--warning-soft)', color: 'var(--warning)' }}>
        <IconAlert />
      </span>
      <div>
        <div style={{ font: 'var(--weight-semibold) var(--text-xl)/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>{copy.title}</div>
        <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-secondary)', margin: '8px 0 0', maxWidth: 420, textWrap: 'pretty' }}>
          {copy.message}
        </p>
      </div>
      <Button variant="secondary" onClick={onRetry}>Try again</Button>
    </div>
  )
}
