// Inline icons used by the design (Lucide paths, matched to the source SVGs).
// Outline only, currentColor, 2px stroke — per the Ember iconography rules.
import React from 'react'

function Svg({ size = 16, strokeWidth = 2, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconPlus = (p) => (
  <Svg size={15} {...p}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Svg>
)

export const IconX = (p) => (
  <Svg size={14} {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
)

export const IconSparkle = (p) => (
  <Svg size={16} {...p}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
  </Svg>
)

export const IconShuffle = (p) => (
  <Svg size={15} {...p}>
    <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
    <path d="m18 2 4 4-4 4" />
    <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
    <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
    <path d="m18 14 4 4-4 4" />
  </Svg>
)

export const IconInfo = (p) => (
  <Svg size={14} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </Svg>
)

export const IconArrowRight = (p) => (
  <Svg size={14} {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
)

export const IconCheck = (p) => (
  <Svg size={12} strokeWidth={2.6} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
)

export const IconAlert = (p) => (
  <Svg size={20} {...p}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </Svg>
)
