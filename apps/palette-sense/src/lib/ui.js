// Small style helpers shared across components — ported from the design.

// Pill badge used for AA / contrast indicators and the harmony tag.
export function badgeStyle(tone, extra) {
  const map = {
    neutral: ['var(--text-secondary)', 'var(--ash-800)', 'var(--ash-400)'],
    success: ['var(--success)', 'var(--success-soft)', 'var(--success)'],
    warning: ['var(--warning)', 'var(--warning-soft)', 'var(--warning)'],
    accent: ['var(--coral-300)', 'var(--accent-soft)', 'var(--accent)'],
  }
  const t = map[tone] || map.neutral
  return Object.assign(
    {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 8px',
      borderRadius: 'var(--radius-pill)',
      font: 'var(--weight-medium) var(--text-2xs)/1 var(--font-sans)',
      background: t[1],
      color: t[0],
      border: '1px solid color-mix(in oklab, ' + t[2] + ' 24%, transparent)',
      whiteSpace: 'nowrap',
    },
    extra || {},
  )
}
