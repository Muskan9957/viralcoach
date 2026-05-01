/**
 * ViralCoach Logo
 *
 * Colours come entirely from CSS variables (--logo-v1, --logo-v2, --logo-h1,
 * --logo-shadow) defined in index.css for both dark and light themes.
 * The browser resolves these when data-theme switches on <html> — no React
 * state, no useTheme hook, no gradient defs in SVG.  This is why the logo
 * stays correct on every theme toggle without any glitches.
 *
 * Mark     : Clapperboard
 *   boards (top)  → --logo-v1  (cyan  / blue)
 *   body          → --logo-v2  (violet / purple)
 *   play ▶        → white 70%
 *
 * Wordmark : "Viral" / "coach" stacked in Caveat
 *   "Viral" → --logo-v1
 *   "coach" → --logo-v2
 */
import { useState } from 'react'

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  // Stable per-instance ID — prevents SVG defs collision when multiple
  // Logo instances are on the same page (sidebar + mobile header).
  const [uid] = useState(() => `vc${Math.random().toString(36).slice(2, 7)}`)

  const sP  = `${uid}-sp`   // stripe pattern
  const cLo = `${uid}-cl`   // clipPath lower bar
  const cUp = `${uid}-cu`   // clipPath upper board

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 8 : 5 }}
    >
      {/* ── Clapperboard SVG ─────────────────────────────────── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="vc-logo-mark"
        style={{ flexShrink: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* Stripe pattern — no colour value, safe in defs */}
          <pattern
            id={sP}
            x="0" y="0" width="14" height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-48)"
          >
            <rect x="0" y="0" width="7" height="14" fill="rgba(0,0,0,0.26)" />
            <rect x="7" y="0" width="7" height="14" fill="rgba(255,255,255,0.09)" />
          </pattern>

          <clipPath id={cLo}>
            <rect x="5" y="32" width="90" height="14" />
          </clipPath>
          <clipPath id={cUp}>
            <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" />
          </clipPath>
        </defs>

        {/* ── Body — var(--logo-v2) violet/purple ─────────── */}
        {/* Subtle depth shadow */}
        <rect x="8" y="47" width="88" height="50" rx="5"
          fill="var(--logo-shadow)" opacity="0.30" />
        {/* Main body */}
        <rect x="5" y="44" width="90" height="52" rx="5"
          fill="var(--logo-v2)" />
        {/* Top-edge shine */}
        <rect x="5" y="44" width="90" height="7" rx="5"
          fill="rgba(255,255,255,0.18)" />

        {/* ── Lower clapper bar — var(--logo-v1) cyan/blue ─── */}
        <rect x="5" y="32" width="90" height="14" rx="2"
          fill="var(--logo-v1)" />
        {/* Diagonal stripes */}
        <rect x="5" y="32" width="90" height="14"
          fill={`url(#${sP})`} clipPath={`url(#${cLo})`} />
        {/* Shine */}
        <rect x="5" y="32" width="90" height="5" rx="2"
          fill="rgba(255,255,255,0.22)" />
        {/* Divider line */}
        <line x1="5" y1="46" x2="95" y2="46"
          stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

        {/* ── Upper clapper board — angled, var(--logo-v1) ─── */}
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z"
          fill="var(--logo-v1)" />
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z"
          fill={`url(#${sP})`} clipPath={`url(#${cUp})`} />
        {/* Top-edge shine */}
        <path d="M 5 22 L 95 9 L 95 12 L 5 25 Z"
          fill="rgba(255,255,255,0.20)" />

        {/* Hinge pin */}
        <circle cx="10" cy="27" r="3.5" fill="var(--logo-shadow)" />
        <circle cx="10" cy="27" r="2"   fill="var(--logo-h1)" opacity="0.9" />

        {/* ── Play ▶ ──────────────────────────────────────── */}
        <path d="M 35 57 L 35 80 L 68 68.5 Z"
          fill="rgba(255,255,255,0.70)" />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1.1, userSelect: 'none' }}>
          <div style={{
            fontFamily:    '"Caveat", cursive',
            fontWeight:    700,
            fontSize:      Math.max(size * 0.50, 16),
            color:         'var(--logo-v1)',
            letterSpacing: '0.01em',
          }}>
            Viral
          </div>
          <div style={{
            fontFamily:    '"Caveat", cursive',
            fontWeight:    600,
            fontSize:      Math.max(size * 0.46, 15),
            color:         'var(--logo-v2)',
            letterSpacing: '0.01em',
            marginTop:     -2,
          }}>
            coach
          </div>
        </div>
      )}
    </div>
  )
}
