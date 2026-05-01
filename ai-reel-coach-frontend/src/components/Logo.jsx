/**
 * ViralCoach Logo
 *
 * Mark  : Film clapperboard with a play-button triangle inside.
 *         Body + two clapper boards (lower horizontal, upper angled).
 *         Classic diagonal stripes on the clapper boards.
 *
 * Wordmark : "Viral" stacked above "coach" in Caveat (handwritten feel).
 *
 * Colours adapt to theme:
 *   dark  → bright gold  (#FFE566 → #FFA520 → #C47800)
 *   light → warm amber   (#C8880A → #8B5E06 → #5C3A03)
 */
import { useTheme } from '../context/ThemeContext'

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const { theme } = useTheme() || {}
  const isDark = theme !== 'light'

  const uid  = `vc-${Math.round(size)}`
  const gG   = `${uid}-g`    // gold gradient
  const sP   = `${uid}-sp`   // stripe pattern
  const cLo  = `${uid}-clo`  // clip — lower bar
  const cUp  = `${uid}-cup`  // clip — upper board
  const blr  = `${uid}-b`    // glow blur

  // Theme-aware gold palette
  const [hi, mid, lo] = isDark
    ? ['#FFE566', '#FFA520', '#C47800']
    : ['#D4960A', '#9A6600', '#5C3A03']

  // Wordmark gradient string
  const wGrad = isDark
    ? 'linear-gradient(135deg, #FFE566 0%, #FFA520 100%)'
    : 'linear-gradient(135deg, #D4960A 0%, #9A6600 100%)'

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 8 : 5 }}
    >
      {/* ─── Clapperboard mark ─────────────────────────────── */}
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
          {/* Gold gradient — top-left → bottom-right */}
          <linearGradient id={gG} x1="5" y1="5" x2="95" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={hi}  />
            <stop offset="55%"  stopColor={mid} />
            <stop offset="100%" stopColor={lo}  />
          </linearGradient>

          {/* Diagonal stripe pattern for clapper boards */}
          <pattern
            id={sP}
            x="0" y="0" width="14" height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-48)"
          >
            <rect x="0" y="0" width="7"  height="14" fill="rgba(0,0,0,0.28)" />
            <rect x="7" y="0" width="7"  height="14" fill="rgba(255,255,255,0.08)" />
          </pattern>

          {/* ClipPath — lower bar */}
          <clipPath id={cLo}>
            <rect x="5" y="32" width="90" height="14" rx="1" />
          </clipPath>

          {/* ClipPath — upper board */}
          <clipPath id={cUp}>
            <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" />
          </clipPath>

          {/* Glow filter */}
          <filter id={blr} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Subtle outer glow behind body */}
        <rect
          x="5" y="44" width="90" height="52" rx="5"
          fill={mid} opacity="0.18"
          filter={`url(#${blr})`}
        />

        {/* ── Body ──────────────────────────────────────────── */}
        <rect x="5" y="44" width="90" height="52" rx="5" fill={`url(#${gG})`} />
        {/* Body inner highlight — top edge shine */}
        <rect x="5" y="44" width="90" height="6" rx="5" fill="rgba(255,255,255,0.18)" />

        {/* ── Lower clapper bar ─────────────────────────────── */}
        <rect x="5" y="32" width="90" height="14" rx="2" fill={`url(#${gG})`} />
        {/* Diagonal stripes clipped to lower bar */}
        <rect
          x="5" y="32" width="90" height="14"
          fill={`url(#${sP})`}
          clipPath={`url(#${cLo})`}
        />
        {/* Bottom border of lower bar */}
        <line x1="5" y1="46" x2="95" y2="46" stroke="rgba(0,0,0,0.20)" strokeWidth="1" />

        {/* ── Upper clapper board (angled — open position) ───── */}
        {/* Parallelogram: left side lower, right side raised */}
        <path d="M 5 32 L 95 19 L 95 9 L 5 22 Z" fill={`url(#${gG})`} />
        {/* Diagonal stripes clipped to upper board */}
        <path
          d="M 5 32 L 95 19 L 95 9 L 5 22 Z"
          fill={`url(#${sP})`}
          clipPath={`url(#${cUp})`}
        />
        {/* Hinge pin — small circle on the left */}
        <circle cx="10" cy="27" r="3.5" fill={lo} />
        <circle cx="10" cy="27" r="1.8" fill={hi} opacity="0.7" />

        {/* ── Play triangle ─────────────────────────────────── */}
        {/*  Centred in the body (y 44→96 → centre y≈70)        */}
        <path
          d="M 35 57 L 35 80 L 68 68.5 Z"
          fill="rgba(255,255,255,0.55)"
        />
      </svg>

      {/* ─── Wordmark: stacked "Viral" / "coach" ───────────── */}
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
