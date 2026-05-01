/**
 * ViralCoach Logo
 *
 * Mark     : Clapperboard — cyan boards (top) + violet body + white play ▶
 * Wordmark : "Viral" / "coach" stacked in Caveat (handwritten font)
 * Colours  : cyan + violet on dark  |  deeper teal + indigo on light
 *
 * Note: IDs are per-instance random so multiple Logo instances on the same
 * page never share SVG defs (avoids gradient/filter glitches on theme toggle).
 */
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  // Stable unique prefix — never collides across instances
  const [uid] = useState(() => `vc${Math.random().toString(36).slice(2, 7)}`)

  const { theme } = useTheme() || {}
  const isDark = theme !== 'light'

  // IDs used in <defs>
  const ids = {
    vG:  `${uid}-v`,    // violet gradient  (body)
    cG:  `${uid}-c`,    // cyan gradient    (boards)
    sP:  `${uid}-sp`,   // stripe pattern
    cLo: `${uid}-cl`,   // clip lower bar
    cUp: `${uid}-cu`,   // clip upper board
    blr: `${uid}-b`,    // blur filter
  }

  // ── Palette ─────────────────────────────────────────────────────────
  const violet = isDark
    ? { hi: '#C084FC', lo: '#7C3AED' }
    : { hi: '#7C3AED', lo: '#5B21B6' }

  const cyan = isDark
    ? { hi: '#67E8F9', lo: '#0EA5E9' }
    : { hi: '#06B6D4', lo: '#0369A1' }

  const wordGrad = isDark
    ? 'linear-gradient(135deg, #67E8F9 0%, #C084FC 100%)'
    : 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)'

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 8 : 5 }}
    >
      {/* ── Clapperboard SVG mark ──────────────────────────── */}
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
          <linearGradient id={ids.vG} x1="5" y1="44" x2="95" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={violet.hi} />
            <stop offset="100%" stopColor={violet.lo} />
          </linearGradient>

          <linearGradient id={ids.cG} x1="5" y1="9" x2="95" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={cyan.hi} />
            <stop offset="100%" stopColor={cyan.lo} />
          </linearGradient>

          <pattern
            id={ids.sP}
            x="0" y="0" width="14" height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-48)"
          >
            <rect x="0" y="0" width="7" height="14" fill="rgba(0,0,0,0.25)" />
            <rect x="7" y="0" width="7" height="14" fill="rgba(255,255,255,0.08)" />
          </pattern>

          <clipPath id={ids.cLo}>
            <rect x="5" y="32" width="90" height="14" />
          </clipPath>
          <clipPath id={ids.cUp}>
            <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" />
          </clipPath>

          <filter id={ids.blr} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Glow behind body */}
        <rect x="5" y="44" width="90" height="52" rx="5"
          fill={violet.hi} opacity="0.18" filter={`url(#${ids.blr})`} />

        {/* ── Body — violet ───────────────────────────────── */}
        <rect x="5" y="44" width="90" height="52" rx="5" fill={`url(#${ids.vG})`} />
        <rect x="5" y="44" width="90" height="7"  rx="5" fill="rgba(255,255,255,0.14)" />

        {/* ── Lower clapper bar — cyan ─────────────────────── */}
        <rect x="5" y="32" width="90" height="14" rx="2" fill={`url(#${ids.cG})`} />
        <rect x="5" y="32" width="90" height="14"
          fill={`url(#${ids.sP})`} clipPath={`url(#${ids.cLo})`} />
        <line x1="5" y1="46" x2="95" y2="46" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

        {/* ── Upper clapper board — angled, cyan ──────────── */}
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" fill={`url(#${ids.cG})`} />
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z"
          fill={`url(#${ids.sP})`} clipPath={`url(#${ids.cUp})`} />

        {/* Hinge pin */}
        <circle cx="10" cy="27" r="3.5" fill={violet.lo} />
        <circle cx="10" cy="27" r="1.8" fill={cyan.hi} opacity="0.9" />

        {/* ── Play ▶ inside violet body ────────────────────── */}
        <path d="M 35 57 L 35 80 L 68 68.5 Z" fill="rgba(255,255,255,0.65)" />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1.1, userSelect: 'none' }}>
          {['Viral', 'coach'].map((word, i) => (
            <div
              key={word}
              style={{
                fontFamily:           '"Caveat", cursive',
                fontWeight:           i === 0 ? 700 : 600,
                fontSize:             Math.max(size * (i === 0 ? 0.50 : 0.46), i === 0 ? 16 : 15),
                background:           wordGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
                color:                'transparent',
                letterSpacing:        '0.01em',
                marginTop:            i === 1 ? -2 : 0,
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
