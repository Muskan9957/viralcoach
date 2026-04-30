/**
 * ViralCoach Logo — "The Spark V"
 *
 * Concept: Two arms converging at a single ignition point.
 * The moment content goes viral. Clean, bold, memorable.
 *
 * Three layers:
 *   1. Wide blurred glow  — depth/atmosphere
 *   2. Bold gradient V    — the mark
 *   3. Thin inner shine   — polish
 *
 * + A bright spark node at the vertex — the focal point.
 *
 * Works on any background. Scales from 16px favicon to 400px hero.
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid  = `vc-${Math.round(size)}`
  const gid  = `${uid}-g`
  const fid  = `${uid}-f`
  const rid  = `${uid}-r`

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 10 : 6 }}
    >
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
          {/* Main V gradient — cyan left → indigo mid → violet right */}
          <linearGradient id={gid} x1="15" y1="12" x2="85" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00E5FF" />
            <stop offset="48%"  stopColor="#818CF8" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Glow blur filter */}
          <filter id={fid} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
          </filter>

          {/* Radial glow at the spark node */}
          <radialGradient id={rid} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00E5FF" stopOpacity="1" />
            <stop offset="60%"  stopColor="#818CF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Layer 1: Atmospheric glow behind the V ─────────────── */}
        <path
          d="M 15 12 L 50 85 L 85 12"
          stroke={`url(#${gid})`}
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.18"
          filter={`url(#${fid})`}
        />

        {/* ── Layer 2: Bold V — the mark ─────────────────────────── */}
        <path
          d="M 15 12 L 50 85 L 85 12"
          stroke={`url(#${gid})`}
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── Layer 3: Thin inner shine ───────────────────────────── */}
        <path
          d="M 15 12 L 50 85 L 85 12"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── Spark node at vertex ────────────────────────────────── */}
        {/* Outer radial glow */}
        <circle cx="50" cy="85" r="14" fill={`url(#${rid})`} opacity="0.55" />
        {/* Mid ring */}
        <circle cx="50" cy="85" r="6"  fill="#818CF8" opacity="0.5" />
        {/* Bright core */}
        <circle cx="50" cy="85" r="3.5" fill="#00E5FF" opacity="1" />
        {/* White hot centre */}
        <circle cx="50" cy="85" r="1.8" fill="white"   opacity="0.95" />

      </svg>

      {/* ── Wordmark ────────────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1, userSelect: 'none' }}>
          <span style={{
            fontFamily:    'var(--font-head)',
            fontSize:      Math.max(size * 0.44, 13),
            letterSpacing: '-0.03em',
            lineHeight:    1,
          }}>
            <span style={{
              fontWeight:           900,
              background:           'linear-gradient(135deg, #00E5FF 0%, #818CF8 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              viral
            </span>
            <span style={{
              fontWeight: 300,
              color:      'var(--text)',
              opacity:    0.65,
            }}>
              coach
            </span>
          </span>
        </div>
      )}

    </div>
  )
}
