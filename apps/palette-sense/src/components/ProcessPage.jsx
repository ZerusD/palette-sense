// The "Process" page — the portfolio note, structured as a rationale panel for
// the product itself: the same dot + role + "why" anatomy the palette rows use.
// State-toggled from the header (no router, by design).
import React from 'react'
import Button from './ui/Button.jsx'
import { IconArrowRight } from './icons.jsx'

const overline = {
  font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)',
  textTransform: 'uppercase', color: 'var(--text-muted)',
}

const REPO = 'https://github.com/ZerusD/palette-sense'

const ROWS = [
  {
    dot: 'var(--coral-400)', title: 'Definition', role: 'strategy',
    body: 'One thesis, honestly positioned: generators like Coolors make palettes faster than this ever will — but they paywall the reasoning. Palette Sense competes only on explained, intent-driven color. The designer sets the base colors, mood, and count; the AI proposes and explains, never overrides.',
  },
  {
    dot: 'var(--azure-500)', title: 'PRD, kept light', role: 'requirements',
    body: 'A prototype-light PRD pinned the behavior before the build: an always-on rationale panel (never a hidden tab), a user-set palette size, WCAG AA made legible to non-designers, and a strict JSON contract between model and UI. Resisting scope was a requirement too.',
  },
  {
    dot: 'var(--emerald-500)', title: 'A cited knowledge base', role: 'grounding',
    body: 'The difference between “five nice colors” and an explanation is grounding. A compact, cited color-theory KB — harmony systems, OKLCH perceptual reasoning, WCAG AA versus newer contrast models, color-vision deficiency, 60-30-10, honest mood framing — compiles into the system prompt, so every rationale argues from theory instead of vibes.',
    link: { href: REPO + '/blob/main/docs/product/p01-explained-palette/PSENSE_P01_F01_Research_ColorTheoryKB.md', label: 'Read the KB' },
  },
  {
    dot: 'var(--coral-400)', title: 'The design system', role: 'craft',
    body: 'The UI was designed in Claude Design on Ember, a personal warm-dark design system, then rebuilt as a React + Vite + Tailwind SPA with the tokens carried over verbatim — minimalist and a little edgy, so the palettes stay the loudest thing on screen.',
  },
  {
    dot: 'var(--azure-500)', title: 'One call, cost-aware', role: 'engineering',
    body: 'Generate makes exactly one Anthropic call (claude-sonnet-4-6) from a serverless function: structured outputs for guaranteed-parseable JSON, the KB prompt served from cache, strict validation with friendly failure, and a key that never leaves the server. About a cent per generate.',
  },
  {
    dot: 'var(--emerald-500)', title: 'Palette in context', role: 'visualize',
    body: 'Previews apply the palette to surfaces designers actually ship — a landing hero, a dashboard, an editorial page — plus two generative pieces. In Chromatic Currents the palette itself is the seed: every color becomes a body on an invisible hue wheel at its real hue angle, so the artwork renders the same harmony the panel explains in words.',
    link: { href: REPO + '/blob/main/docs/product/p01-explained-palette/PSENSE_P01_F01_DS_ChromaticCurrents.md', label: 'The movement doc' },
  },
]

export default function ProcessPage({ onBack }) {
  return (
    <div className="ps-rise" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ background: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--edge-top)', borderRadius: 'var(--radius-lg)', padding: '30px 32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)', flex: 'none' }} />
          <span style={{ ...overline, color: 'var(--text-secondary)' }}>Process</span>
        </div>
        <h2 style={{ font: 'var(--weight-semibold) var(--text-2xl)/1.08 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: '14px 0 0' }}>
          Why this tool
        </h2>
        <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-secondary)', margin: '14px 0 0', textWrap: 'pretty' }}>
          Palette Sense explains its colors — so its process page should explain itself the same
          way. Each row below is a rationale: what the stage was, what it did, and how it helped,
          from definition to deploy.
        </p>

        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '22px 0 2px' }} />

        {ROWS.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 13, padding: '17px 0', borderBottom: i < ROWS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: r.dot, flex: 'none', marginTop: 4, boxShadow: '0 0 0 1px var(--border-strong)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ font: 'var(--weight-semibold) var(--text-base)/1.2 var(--font-sans)', color: 'var(--text-primary)' }}>{r.title}</span>
                <span style={overline}>{r.role}</span>
              </div>
              <p style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', margin: '7px 0 0', textWrap: 'pretty' }}>{r.body}</p>
              {r.link && (
                <a href={r.link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)', marginTop: 8 }}>
                  {r.link.label}<IconArrowRight />
                </a>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>
            React · Vite · Tailwind · Vercel · claude-sonnet-4-6 · built with Claude Design + Claude Code
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={REPO} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-raised)', color: 'var(--text-primary)', font: 'var(--weight-medium) var(--text-base)/1 var(--font-sans)', letterSpacing: '-0.01em' }}>
              GitHub
            </a>
            <Button onClick={onBack}>Back to the tool</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
