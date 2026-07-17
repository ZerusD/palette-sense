// Ember Tabs — ported from the design system bundle.
// Controlled or uncontrolled. `pill` (segmented) and `underline` variants.
import React from 'react'

export default function Tabs({ items, value, defaultValue, onChange, variant = 'underline', style, ...rest }) {
  const first = defaultValue ?? (items && items[0] && items[0].value)
  const [internal, setInternal] = React.useState(first)
  const active = value !== undefined ? value : internal
  const select = (v) => {
    if (value === undefined) setInternal(v)
    onChange && onChange(v)
  }

  if (variant === 'pill') {
    return (
      <div
        style={{
          display: 'inline-flex',
          gap: 2,
          padding: 3,
          background: 'var(--surface-inset)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          ...style,
        }}
        {...rest}
      >
        {items.map((it) => {
          const on = it.value === active
          return (
            <button
              key={it.value}
              type="button"
              onClick={() => select(it.value)}
              disabled={it.disabled}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 28,
                padding: '0 12px',
                border: 'none',
                cursor: it.disabled ? 'not-allowed' : 'pointer',
                borderRadius: 'var(--radius-sm)',
                background: on ? 'var(--surface-raised)' : 'transparent',
                color: on ? 'var(--text-strong)' : 'var(--text-muted)',
                boxShadow: on ? 'var(--shadow-xs)' : 'none',
                font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
                transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
              }}
            >
              {it.icon}
              {it.label}
              {it.badge != null && (
                <span style={{ font: 'var(--type-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{it.badge}</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-subtle)', ...style }} {...rest}>
      {items.map((it) => {
        const on = it.value === active
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => select(it.value)}
            disabled={it.disabled}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              height: 38,
              padding: '0 12px',
              border: 'none',
              background: 'transparent',
              cursor: it.disabled ? 'not-allowed' : 'pointer',
              color: on ? 'var(--text-strong)' : 'var(--text-muted)',
              opacity: it.disabled ? 0.5 : 1,
              font: 'var(--weight-medium) var(--text-base)/1 var(--font-sans)',
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
          >
            {it.icon}
            {it.label}
            {it.badge != null && (
              <span style={{ font: 'var(--type-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{it.badge}</span>
            )}
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                background: 'var(--accent)',
                borderRadius: '2px 2px 0 0',
                opacity: on ? 1 : 0,
                boxShadow: on ? '0 0 10px var(--accent)' : 'none',
                transition: 'opacity var(--dur-base) var(--ease-out)',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
