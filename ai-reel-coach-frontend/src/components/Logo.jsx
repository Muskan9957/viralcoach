/**
 * ViralCoach Logo
 *
 * Mark     : Clapperboard — cyan boards + violet body + white ▶
 * Wordmark : "Viral" / "coach" stacked in Caveat (handwritten)
 *
 * Intentionally uses NO SVG <linearGradient> — browser caches SVG gradient
 * defs and they don't always update on React theme re-renders, causing visual
 * glitches.  All colours are applied as direct fill/stroke attribute values
 * computed from the current theme, which React always patches correctly.
 *
 * Only the stripe <pattern> stays in <defs> (it has no colour dependency).
 */
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const [uid] = useState(() => `vc${Math.random().toString(36).slice(2, 7)}`)
  const { theme } = useTheme() || {}
  const isDark = theme !== 'light'

  /* ── Palette ──────────────────────────────────────────────────── */
  const cyan   = isDark ? '#22D3EE' : '#0891B2'   // board fill
  const cyanHi = isDark ? '#67E8F9' : '#22D3EE'   // board shine
  const violet = isDark ? '#A855F7' : '#7C3AED'   // body fill
  const vDark  = isDark ? '#7C3AED' : '#5B21B6'   // body shadow edge

  /* ── IDs (only needed for pattern + clipPaths) ─────────────────── */
  const sP  = `${uid}-sp`
  const cLo = `${uid}-cl`
  const cUp = `${uid}-cu`

  /* ── Wordmark gradient (CSS, not SVG — always reliable) ───────── */
  const wGrad = isDark
    ? 'linear-gradient(135deg, #67E8F9 0%, #C084FC 100%)'
    : 'linear-gradient(135deg, #0891B2 0%, #7C3AED 100%)'

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 8 : 5 }}
    >
      {/* ── Clapperboard ──────────────────────────────────────── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* Stripe pattern — no colour dependency, safe in defs */}
          <pattern
            id={sP}
            x="0" y="0" width="14" height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-48)"
          >
            <rect x="0" y="0" width="7" height="14" fill="rgba(0,0,0,0.28)" />
            <rect x="7" y="0" width="7" height="14" fill="rgba(255,255,255,0.10)" />
          </pattern>

          <clipPath id={cLo}>
            <rect x="5" y="32" width="90" height="14" />
          </clipPath>
          <clipPath id={cUp}>
            <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" />
          </clipPath>
        </defs>

        {/* ── Body — violet solid fill ──────────────────────── */}
        {/* Soft drop shadow via a blurred duplicate */}
        <rect x="8" y="47" width="88" height="50" rx="5" fill={vDark} opacity="0.35" />
        {/* Main body */}
        <rect x="5" y="44" width="90" height="52" rx="5" fill={violet} />
        {/* Top-edge shine */}
        <rect x="5" y="44" width="90" height="7" rx="5" fill="rgba(255,255,255,0.18)" />
        {/* Right-edge depth shadow */}
        <rect x="88" y="44" width="7" height="52" rx="0" fill="rgba(0,0,0,0.15)" />

        {/* ── Lower clapper bar — cyan solid fill ───────────── */}
        <rect x="5" y="32" width="90" height="14" rx="2" fill={cyan} />
        <rect x="5" y="32" width="90" height="14"
          fill={`url(#${sP})`} clipPath={`url(#${cLo})`} />
        {/* Shine strip */}
        <rect x="5" y="32" width="90" height="5" rx="2" fill="rgba(255,255,255,0.20)" />
        <line x1="5" y1="46" x2="95" y2="46" stroke="rgba(0,0,0,0.20)" strokeWidth="1" />

        {/* ── Upper clapper board — angled, cyan solid fill ─── */}
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" fill={cyan} />
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z"
          fill={`url(#${sP})`} clipPath={`url(#${cUp})`} />
        {/* Shine along top edge of upper board */}
        <path d="M 5 22 L 95 9 L 95 12 L 5 25 Z" fill="rgba(255,255,255,0.22)" />

        {/* Hinge pin */}
        <circle cx="10" cy="27" r="3.5" fill={vDark} />
        <circle cx="10" cy="27" r="2"   fill={cyanHi} opacity="0.9" />

        {/* ── Play ▶ — white, centred in violet body ─────────── */}
        <path d="M 35 57 L 35 80 L 68 68.5 Z" fill="rgba(255,255,255,0.70)" />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1.1, userSelect: 'none' }}>
          {[['Viral', 700, 0.50, 16], ['coach', 600, 0.46, 15]].map(([word, fw, scale, min], i) => (
            <div
              key={word}
              style={{
                fontFamily:           '"Caveat", cursive',
                fontWeight:           fw,
                fontSize:             Math.max(size * scale, min),
                background:           wGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                letterSpacing:        '0.01em',
                marginTop:            i === 1 ? -2 : 0,
                display:              'block',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
