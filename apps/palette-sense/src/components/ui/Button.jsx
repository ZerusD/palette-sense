// Ember Button — ported from the design system bundle.
// Variants: primary (coral fill), secondary (outline), ghost, danger. Sizes sm/md/lg.
import React from 'react'

function Spinner() {
  return (
    <span
      style={{
        width: 13,
        height: 13,
        borderRadius: '50%',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        display: 'inline-block',
        animation: 'ps-spin .7s linear infinite',
      }}
    />
  )
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  full = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: { height: 28, padding: '0 10px', font: 'var(--text-sm)', gap: 6, radius: 'var(--radius-sm)' },
    md: { height: 36, padding: '0 14px', font: 'var(--text-base)', gap: 8, radius: 'var(--radius-md)' },
    lg: { height: 44, padding: '0 20px', font: 'var(--text-md)', gap: 8, radius: 'var(--radius-md)' },
  }
  const s = sizes[size] || sizes.md
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--accent-fg)', border: '1px solid transparent', boxShadow: 'var(--edge-top)' },
    secondary: { background: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
    danger: { background: 'var(--danger)', color: '#fff', border: '1px solid transparent' },
  }
  const v = variants[variant] || variants.primary
  const isDisabled = disabled || loading
  const [hover, setHover] = React.useState(false)
  const [active, setActive] = React.useState(false)
  const hoverFx = !isDisabled && hover
    ? {
        primary: { background: 'var(--accent-hover)', boxShadow: 'var(--glow-sm)' },
        secondary: { background: 'var(--surface-hover)', borderColor: 'var(--border-strong)' },
        ghost: { background: 'var(--surface-hover)', color: 'var(--text-primary)' },
        danger: { background: 'var(--rose-600)' },
      }[variant]
    : {}
  const activeFx = active && !isDisabled ? { transform: 'translateY(0.5px) scale(0.99)' } : {}
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        width: full ? '100%' : undefined,
        font: `var(--weight-medium) ${s.font}/1 var(--font-sans)`,
        letterSpacing: '-0.01em',
        borderRadius: s.radius,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        transition:
          'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...v,
        ...hoverFx,
        ...activeFx,
        ...style,
      }}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  )
}
