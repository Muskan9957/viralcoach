/**
 * Nuovve Logo
 *
 * Mark     : Clapperboard SVG (icon-only when showWordmark=false)
 * Wordmark : "Nuovve" — Bricolage Grotesque 800, gradient cyan→purple
 *
 * Sizing philosophy (matches Linear, Framer, Loom):
 *   - Wordmark font-size ≈ 78% of icon height — stays readable at every size
 *   - Negative letter-spacing (-0.04em) for premium modern feel
 *   - Single line — never stack a one-word brand name
 *   - Gradient runs the full word; double-V is the brand signature
 *
 * Colours come from CSS variables so dark/light theme switches
 * work without any React state or re-render.
 */
import { useState } from 'react'

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const [uid] = useState(() => `nv${Math.random().toString(36).slice(2, 7)}`)

  const sP  = `${uid}-sp`   // stripe pattern
  const cLo = `${uid}-cl`   // clipPath lower bar
  const cUp = `${uid}-cu`   // clipPath upper board

  const iconSize    = size
  const wordSize    = Math.max(iconSize * 0.78, 26)   // never below 26px
  const gap         = Math.max(iconSize * 0.22, 8)

  return (
    <div
      className={className}
      style={{
        display:     'flex',
        alignItems:  'center',
        gap,
        userSelect:  'none',
      }}
    >
      {/* ── Clapperboard mark ──────────────────────────── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={sP}
            x="0" y="0" width="14" height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-48)"
          >
            <rect x="0" y="0" width="7"  height="14" fill="rgba(0,0,0,0.24)" />
            <rect x="7" y="0" width="7"  height="14" fill="rgba(255,255,255,0.08)" />
          </pattern>
          <clipPath id={cLo}>
            <rect x="5" y="32" width="90" height="14" />
          </clipPath>
          <clipPath id={cUp}>
            <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" />
          </clipPath>
        </defs>

        {/* Body — purple */}
        <rect x="5" y="44" width="90" height="52" rx="6" fill="var(--logo-v2)" />
        <rect x="5" y="44" width="90" height="8"  rx="6" fill="rgba(255,255,255,0.14)" />

        {/* Lower clapper bar — cyan */}
        <rect x="5" y="32" width="90" height="14" rx="2" fill="var(--logo-v1)" />
        <rect x="5" y="32" width="90" height="14" fill={`url(#${sP})`} clipPath={`url(#${cLo})`} />
        <rect x="5" y="32" width="90" height="5"  rx="2" fill="rgba(255,255,255,0.20)" />
        <line x1="5" y1="46" x2="95" y2="46" stroke="rgba(0,0,0,0.16)" strokeWidth="1" />

        {/* Upper clapper board — angled, cyan */}
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" fill="var(--logo-v1)" />
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" fill={`url(#${sP})`} clipPath={`url(#${cUp})`} />
        <path d="M 5 22 L 95 9 L 95 12 L 5 25 Z" fill="rgba(255,255,255,0.18)" />

        {/* Hinge pin */}
        <circle cx="10" cy="27" r="3.5" fill="var(--logo-shadow)" />
        <circle cx="10" cy="27" r="2"   fill="var(--logo-h1)" opacity="0.9" />

        {/* Play ▶ */}
        <path d="M 36 58 L 36 80 L 69 69 Z" fill="rgba(255,255,255,0.82)" />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────
          Bricolage Grotesque 800 — a display grotesque with
          subtle optical quirks that read well at all sizes.
          Gradient text via WebkitBackgroundClip (same technique
          used by Framer, Arc, Raycast wordmarks).
      ─────────────────────────────────────────────────── */}
      {showWordmark && (
        <span
          style={{
            fontFamily:             '"Bricolage Grotesque", "Plus Jakarta Sans", sans-serif',
            fontWeight:             800,
            fontSize:               `${wordSize}px`,
            lineHeight:             1,
            letterSpacing:          '-0.04em',
            background:             'linear-gradient(100deg, var(--logo-v1) 0%, var(--logo-v2) 100%)',
            WebkitBackgroundClip:   'text',
            WebkitTextFillColor:    'transparent',
            backgroundClip:         'text',
            color:                  'transparent',   /* fallback */
          }}
        >
          Nuovve
        </span>
      )}
    </div>
  )
}
