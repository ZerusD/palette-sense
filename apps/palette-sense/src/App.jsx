// Palette Sense — single-screen app. Recreation of the imported Claude Design
// (Ember design system). Generate makes ONE call to /api/generate (the
// serverless Anthropic call); the validated response is decorated with the
// derived contrast/surface fields and rendered. Friendly error on any failure.
import React from 'react'
import Controls from './components/Controls.jsx'
import PaletteResult from './components/PaletteResult.jsx'
import RationalePanel from './components/RationalePanel.jsx'
import ProcessPage from './components/ProcessPage.jsx'
import { LoadingState, InitialState, ErrorState } from './components/States.jsx'
import { isHex, readable, hsl, san } from './lib/color.js'
import { decoratePalette, MOODS } from './lib/palette.js'
import { validatePaletteResponse } from './lib/validate.js'

const ACCENT_TINT = true // tint the UI accent to the user's main color (design default)
const SHOW_WHEEL = true

const INITIAL = {
  main: '3B82C4', c2: '', c3: '', moods: [], intent: '', size: 5,
  status: 'initial', result: null, pattern: 'landing', surface: 'dark',
  copied: null, tip: false, dirty: false, hoverSwatch: null, errorKind: 'input',
  view: 'tool', // 'tool' | 'process' — state-toggled page, no router by design
}

export default function App() {
  const [state, setStateRaw] = React.useState(INITIAL)
  const setState = (patch) => setStateRaw((s) => ({ ...s, ...patch }))
  const copyTimer = React.useRef()
  const abortRef = React.useRef()
  const stateRef = React.useRef(state)
  stateRef.current = state

  React.useEffect(() => () => { clearTimeout(copyTimer.current); abortRef.current?.abort() }, [])

  // ---- core: ONE POST to /api/generate per Generate press ----
  async function run(inp) {
    if (!isHex(inp.main)) { setState({ status: 'error', errorKind: 'input' }); return }
    setState({ status: 'generating' })
    abortRef.current?.abort() // a re-press supersedes the in-flight request
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      // Request contract (PRD §7): { mainColor, color2?, color3?, moodTags[], freeText?, count }
      const body = { mainColor: '#' + inp.main, moodTags: inp.moods, count: inp.size }
      if (isHex(inp.c2)) body.color2 = '#' + inp.c2
      if (isHex(inp.c3)) body.color3 = '#' + inp.c3
      const intent = String(inp.intent || '').trim()
      if (intent) body.freeText = intent

      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      })
      const data = await r.json().catch(() => null)
      if (!r.ok || !data) throw new Error((data && data.error) || 'request failed: ' + r.status)

      // Validate the contract (schema + hex + count) before rendering (G2)
      const problem = validatePaletteResponse(data, inp.size)
      if (problem) throw new Error(problem)

      setState({ status: 'result', result: decoratePalette(data), dirty: false })
    } catch (e) {
      if (e.name === 'AbortError') return
      console.error('generate failed:', e.message)
      setState({ status: 'error', errorKind: 'api' })
    }
  }

  // ---- handlers (mirror the imported design) ----
  const isResultDirty = () => (stateRef.current.status === 'result')
  const h = {
    generate: () => {
      const s = stateRef.current
      run({ main: s.main, c2: s.c2, c3: s.c3, moods: s.moods, intent: s.intent, size: s.size })
    },
    useExample: (ex) => {
      setState({ main: ex.main, c2: '', c3: '', moods: ex.moods.slice(), intent: ex.intent, size: ex.size })
      run({ main: ex.main, c2: '', c3: '', moods: ex.moods, intent: ex.intent, size: ex.size })
    },
    surpriseMe: () => {
      const hue = Math.floor(Math.random() * 360)
      const main = hsl(hue, 52 + Math.random() * 30, 48 + Math.random() * 12).replace('#', '').toUpperCase()
      const pool = MOODS.slice()
      const picks = []
      const n = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < n; i++) picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
      const size = 4 + Math.floor(Math.random() * 3)
      setState({ main, c2: '', c3: '', moods: picks, intent: '', size })
      run({ main, c2: '', c3: '', moods: picks, intent: '', size })
    },
    retry: () => h.generate(),
    onMainPick: (e) => setState({ main: e.target.value.replace('#', '').toUpperCase(), dirty: isResultDirty() }),
    onMainHex: (e) => setState({ main: san(e.target.value), dirty: isResultDirty(), status: stateRef.current.status === 'error' ? 'initial' : stateRef.current.status }),
    onC2Pick: (e) => setState({ c2: e.target.value.replace('#', '').toUpperCase(), dirty: isResultDirty() }),
    onC2Hex: (e) => setState({ c2: san(e.target.value), dirty: isResultDirty() }),
    clearC2: () => setState({ c2: '', dirty: isResultDirty() }),
    onC3Pick: (e) => setState({ c3: e.target.value.replace('#', '').toUpperCase(), dirty: isResultDirty() }),
    onC3Hex: (e) => setState({ c3: san(e.target.value), dirty: isResultDirty() }),
    clearC3: () => setState({ c3: '', dirty: isResultDirty() }),
    onIntent: (e) => setState({ intent: e.target.value, dirty: isResultDirty() }),
    onSize: (v) => setState({ size: +v, dirty: isResultDirty() }),
    onSurface: (v) => setState({ surface: v }),
    onPattern: (v) => setState({ pattern: v }),
    toggleMood: (k) => {
      const set = new Set(stateRef.current.moods)
      set.has(k) ? set.delete(k) : set.add(k)
      setState({ moods: [...set], dirty: isResultDirty() })
    },
    copyHex: (hex) => {
      try { if (navigator.clipboard) navigator.clipboard.writeText(hex) } catch (e) { /* clipboard unavailable */ }
      setState({ copied: hex })
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setState({ copied: null }), 1300)
    },
    setHoverSwatch: (idx) => setState({ hoverSwatch: idx }),
    tipOn: () => setState({ tip: true }),
    tipOff: () => setState({ tip: false }),
    toggleProcess: () => {
      setState({ view: stateRef.current.view === 'process' ? 'tool' : 'process' })
      window.scrollTo(0, 0)
    },
  }

  // ---- derived ----
  const mainValid = isHex(state.main)
  const accentColor = ACCENT_TINT && mainValid ? '#' + state.main : '#ff5c38'
  const accentInk = readable(accentColor)
  const accentGlow = '0 0 0 1px color-mix(in oklab, ' + accentColor + ' 32%, transparent), 0 0 22px color-mix(in oklab, ' + accentColor + ' 26%, transparent)'
  const accent = { color: accentColor, ink: accentInk, glow: accentGlow }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)', font: 'var(--type-body)', paddingBottom: 64, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 320, pointerEvents: 'none', background: 'radial-gradient(62% 100% at 50% -36%, color-mix(in oklab, ' + accentColor + ' 8%, transparent), transparent 72%)' }} />

      {/* header */}
      <header style={{ position: 'relative', maxWidth: 1264, margin: '0 auto', padding: '26px 32px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: accentColor, boxShadow: '0 0 10px ' + accentColor, flex: 'none' }} />
          <span style={{ font: 'var(--weight-semibold) var(--text-xl)/1 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>Palette Sense</span>
          <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-faint)', border: '1px solid var(--border-default)', padding: '4px 8px', borderRadius: 'var(--radius-pill)' }}>color theory</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Pick a color · set a mood · understand every choice</span>
          <button
            onClick={h.toggleProcess}
            style={{
              appearance: 'none', cursor: 'pointer',
              font: 'var(--type-overline)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
              padding: '4px 8px', borderRadius: 'var(--radius-pill)',
              background: state.view === 'process' ? 'var(--accent-soft)' : 'none',
              border: '1px solid ' + (state.view === 'process' ? 'var(--accent-soft-bd)' : 'var(--border-default)'),
              color: state.view === 'process' ? 'var(--coral-200)' : 'var(--text-faint)',
              transition: 'all var(--dur-fast) var(--ease-out)',
            }}
          >
            Process
          </button>
        </div>
      </header>

      {/* main */}
      <main style={{ position: 'relative', maxWidth: 1264, margin: '0 auto', padding: '0 32px' }}>
        {state.view === 'process' ? (
          <ProcessPage onBack={h.toggleProcess} />
        ) : (
          <>
            <Controls state={state} h={h} accent={accent} mainValid={mainValid} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(332px,1fr)', gap: 26, marginTop: 26, alignItems: 'start' }}>
              <div style={{ minWidth: 0 }}>
                {state.status === 'result' && state.result && <PaletteResult result={state.result} ui={state} h={h} />}
                {state.status === 'generating' && <LoadingState size={state.size} />}
                {state.status === 'initial' && <InitialState onUse={h.useExample} />}
                {state.status === 'error' && <ErrorState kind={state.errorKind} onRetry={h.retry} />}
              </div>

              <aside style={{ position: 'sticky', top: 18 }}>
                <RationalePanel status={state.status} result={state.result} showWheel={SHOW_WHEEL} />
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
