// Right column: the always-on "Why these colors" panel — the product's
// differentiator. Shows palette name + harmony + mood, then a per-color
// rationale. Placeholder/loading/result states mirror the imported design.
import React from 'react'
import { badgeStyle } from '../lib/ui.js'
import { cap } from '../lib/color.js'
import { harmonyWheel } from '../lib/patterns.jsx'

const overline = {
  font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)',
  textTransform: 'uppercase', color: 'var(--text-secondary)',
}

function PlaceholderRow({ color, title, body }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, marginTop: 5, flex: 'none' }} />
      <div>
        <div style={{ font: 'var(--weight-medium) var(--text-base)/1.2 var(--font-sans)', color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginTop: 2 }}>{body}</div>
      </div>
    </div>
  )
}

function Skel({ w, h, mt }) {
  return <span className="ps-pulse" style={{ width: w, height: h, borderRadius: 6, background: 'var(--surface-raised)', marginTop: mt }} />
}

export default function RationalePanel({ status, result, showWheel = true }) {
  const isResult = status === 'result' && !!result
  const isLoading = status === 'generating'

  return (
    <div style={{ background: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--edge-top)', borderRadius: 'var(--radius-lg)', padding: '22px 22px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)', flex: 'none' }} />
        <span style={overline}>Why these colors</span>
      </div>

      {isResult && (
        <div className="ps-rise" style={{ paddingBottom: 14 }}>
          <h2 style={{ font: 'var(--weight-semibold) var(--text-2xl)/1.08 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: '14px 0 0' }}>{result.paletteName}</h2>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 11 }}>
            {/* long harmony strings must wrap inside the panel, not overflow it */}
            <span style={badgeStyle('accent', { height: 'auto', minHeight: 22, maxWidth: '100%', padding: '3px 9px', fontSize: 'var(--text-xs)', whiteSpace: 'normal', lineHeight: 1.45, textAlign: 'left' })}>{result.harmonyType}</span>
            <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>harmony</span>
          </div>
          <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-secondary)', margin: '16px 0 0', textWrap: 'pretty' }}>{result.moodExplanation}</p>

          {showWheel && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 6px' }}>{harmonyWheel(result.palette)}</div>
          )}

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '18px 0 2px' }} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {result.palette.map((c, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 13, padding: '15px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ width: 13, height: 13, borderRadius: '50%', background: c.hex, flex: 'none', marginTop: 4, boxShadow: '0 0 0 1px var(--border-strong)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--weight-semibold) var(--text-base)/1.2 var(--font-sans)', color: 'var(--text-primary)' }}>{c.name}</span>
                    <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{cap(c.role)}</span>
                    <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>{c.hex}</span>
                  </div>
                  <p style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', margin: '7px 0 0', textWrap: 'pretty' }}>{c.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{ padding: '16px 0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Skel w="60%" h={24} />
          <Skel w="38%" h={16} />
          <Skel w="100%" h={12} mt={6} />
          <Skel w="92%" h={12} />
          <Skel w="80%" h={12} />
        </div>
      )}

      {!isResult && !isLoading && (
        <div style={{ paddingBottom: 14 }}>
          <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-secondary)', margin: '14px 0 0', textWrap: 'pretty' }}>
            Every palette comes with its reasoning. Generate to see the harmony it uses, the mood it sets, and the job each color does — always in view, never hidden.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
            <PlaceholderRow color="var(--coral-400)" title="Harmony" body="how the hues relate on the wheel" />
            <PlaceholderRow color="var(--azure-500)" title="Mood" body="the feeling the combination creates" />
            <PlaceholderRow color="var(--emerald-500)" title="Per-color" body="why each one is in the set" />
          </div>
        </div>
      )}
    </div>
  )
}
