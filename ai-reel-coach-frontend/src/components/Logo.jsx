/**
 * ViralCoach Logo
 *
 * Mark  : Film clapperboard — two-colour design.
 *   • Clapper boards (striped top section) → CYAN   (#00E5FF family)
 *   • Body (main rectangle + play button)  → VIOLET (#A855F7 family)
 *
 * Wordmark : "Viral" stacked above "coach" in Caveat (handwritten).
 *   • Both lines use the cyan → violet brand gradient.
 *
 * Theme adaptation:
 *   dark  → vivid cyan + vivid violet  (pops on dark backgrounds)
 *   light → deeper teal + deeper indigo (readable on white)
 */
import { useTheme } from '../context/ThemeContext'

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const { theme } = useTheme() || {}
  const isDark = theme !== 'light'

  const uid = `vc-${Math.round(size)}`
  const vG  = `${uid}-v`    // violet gradient  (body)
  const cG  = `${uid}-c`    // cyan gradient    (clapper boards)
  const sP  = `${uid}-sp`   // stripe pattern
  const cLo = `${uid}-clo`  // clip — lower bar
  const cUp = `${uid}-cup`  // clip — upper board
  const blr = `${uid}-b`    // glow blur

  // Violet palette
  const [v1, v2] = isDark
    ? ['#C084FC', '#7C3AED']   // bright violet → deep indigo
    : ['#7C3AED', '#4C1D95']   // deeper for light bg

  // Cyan palette
  const [c1, c2] = isDark
    ? ['#67E8F9', '#00B4D8']   // bright cyan → teal
    : ['#0891B2', '#0E7490']   // deeper for light bg

  // Wordmark gradient
  const wGrad = isDark
    ? 'linear-gradient(135deg, #67E8F9 0%, #C084FC 100%)'
    : 'linear-gradient(135deg, #0891B2 0%, #7C3AED 100%)'

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 8 : 5 }}
    >
      {/* ─── Clapperboard mark ───────────────────────────── */}
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
          {/* Violet gradient — body */}
          <linearGradient id={vG} x1="5" y1="44" x2="95" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={v1} />
            <stop offset="100%" stopColor={v2} />
          </linearGradient>

          {/* Cyan gradient — clapper boards */}
          <linearGradient id={cG} x1="5" y1="9" x2="95" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>

          {/* Diagonal stripes pattern */}
          <pattern
            id={sP}
            x="0" y="0" width="14" height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-48)"
          >
            <rect x="0" y="0" width="7" height="14" fill="rgba(0,0,0,0.22)" />
            <rect x="7" y="0" width="7" height="14" fill="rgba(255,255,255,0.10)" />
          </pattern>

          {/* ClipPath — lower bar */}
          <clipPath id={cLo}>
            <rect x="5" y="32" width="90" height="14" rx="1" />
          </clipPath>

          {/* ClipPath — upper board */}
          <clipPath id={cUp}>
            <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" />
          </clipPath>

          {/* Soft glow */}
          <filter id={blr} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Glow behind body */}
        <rect
          x="5" y="44" width="90" height="52" rx="5"
          fill={v1} opacity="0.20"
          filter={`url(#${blr})`}
        />

        {/* ── Body (violet) ──────────────────────────────── */}
        <rect x="5" y="44" width="90" height="52" rx="5" fill={`url(#${vG})`} />
        {/* Top-edge shine */}
        <rect x="5" y="44" width="90" height="7" rx="5" fill="rgba(255,255,255,0.15)" />

        {/* ── Lower clapper bar (cyan) ────────────────────── */}
        <rect x="5" y="32" width="90" height="14" rx="2" fill={`url(#${cG})`} />
        <rect
          x="5" y="32" width="90" height="14"
          fill={`url(#${sP})`}
          clipPath={`url(#${cLo})`}
        />
        <line x1="5" y1="46" x2="95" y2="46" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

        {/* ── Upper clapper board — angled, open (cyan) ───── */}
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" fill={`url(#${cG})`} />
        <path
          d="M 5 32 L 95 19 L 95 9 L 5 22 Z"
          fill={`url(#${sP})`}
          clipPath={`url(#${cUp})`}
        />

        {/* Hinge pin */}
        <circle cx="10" cy="27" r="3.5" fill={v2} />
        <circle cx="10" cy="27" r="1.8" fill={c1} opacity="0.8" />

        {/* ── Play triangle (white, inside violet body) ────── */}
        <path d="M 35 57 L 35 80 L 68 68.5 Z" fill="rgba(255,255,255,0.60)" />
      </svg>

      {/* ─── Wordmark ────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1.1, userSelect: 'none' }}>
          <div style={{
            fontFamily:           '"Caveat", cursive',
            fontWeight:           700,
            fontSize:             Math.max(size * 0.50, 16),
            background:           wGrad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            letterSpacing:        '0.01em',
          }}>
            Viral
          </div>
          <div style={{
            fontFamily:           '"Caveat", cursive',
            fontWeight:           600,
            fontSize:             Math.max(size * 0.46, 15),
            background:           wGrad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            letterSpacing:        '0.01em',
            marginTop:            -2,
          }}>
            coach
          </div>
        </div>
      )}
    </div>
  )
}
