/**
 * ViralCoach Logo
 *
 * Mark: Bold teal V + diagonal orange upward arrow + gold star at intersection
 * Wordmark: "viral" (bold teal gradient) + "coach" (light, muted)
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid = `vc-${Math.round(size)}`
  const tG  = `${uid}-t`   // teal gradient (V arms)
  const oG  = `${uid}-o`   // orange gradient (arrow)
  const sG  = `${uid}-sg`  // gold gradient (star)
  const blr = `${uid}-b`   // blur / glow filter

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 7 : 4 }}
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
          {/* Teal — V arms, top-bright to bottom-dark */}
          <linearGradient id={tG} x1="18" y1="8" x2="50" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00DDD4" />
            <stop offset="100%" stopColor="#006E6B" />
          </linearGradient>

          {/* Orange — arrow base-to-tip */}
          <linearGradient id={oG} x1="50" y1="74" x2="86" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#C82B00" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>

          {/* Gold — star */}
          <linearGradient id={sG} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFE566" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>

          {/* Soft glow blur */}
          <filter id={blr} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ── Glow layer ─────────────────────────── */}
        <path
          d="M 18 8 L 50 83 L 82 8"
          stroke={`url(#${tG})`}
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.20"
          filter={`url(#${blr})`}
        />

        {/* ── V arms — teal ─────────────────────── */}
        <path
          d="M 18 8 L 50 83 L 82 8"
          stroke={`url(#${tG})`}
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Inner shine — gives the arms a 3-D rounded feel */}
        <path
          d="M 18 8 L 50 83 L 82 8"
          stroke="rgba(255,255,255,0.30)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── Orange upward arrow ────────────────── */}
        {/*
          Shaft from (50,74) → tip at (86,8)
          Direction unit ≈ (0.47, -0.88)
          Perpendicular ≈ (0.88, 0.47)
          shaft half-width = 4 | head half-width = 10 | head length = 16

          Polygon points (clockwise from shaft base-right):
            base-right        (53.5, 75.9)
            neck-right        (80.3, 24.5)
            head-base-right   (85.2, 27.2)
            tip               (86, 8)
            head-base-left    (69.0, 17.6)
            neck-left         (73.9, 21.2)
            base-left         (46.5, 72.1)
        */}
        <path
          d="M 54 76 L 80 25 L 85 27 L 86 8 L 69 18 L 74 21 L 47 72 Z"
          fill={`url(#${oG})`}
        />

        {/* ── Star glow ──────────────────────────── */}
        <circle
          cx="76" cy="18" r="11"
          fill="rgba(255,160,0,0.28)"
          filter={`url(#${blr})`}
        />

        {/* ── Star — 5-pointed, centre (76,18), R=7, r=3 ── */}
        {/*
          Outer: (76,11) (82.7,15.8) (80.1,23.7) (71.9,23.7) (69.3,15.8)
          Inner: (77.8,15.6) (78.9,18.9) (76,21) (73.2,18.9) (74.2,15.6)
        */}
        <path
          d="
            M 76 11
            L 77.8 15.6  L 82.7 15.8
            L 78.9 18.9  L 80.1 23.7
            L 76 21
            L 71.9 23.7  L 73.2 18.9
            L 69.3 15.8  L 74.2 15.6
            Z
          "
          fill={`url(#${sG})`}
        />
      </svg>

      {showWordmark && (
        <div style={{ lineHeight: 1, userSelect: 'none' }}>
          <span style={{
            fontFamily:    'var(--font-head)',
            fontSize:      Math.max(size * 0.44, 13),
            letterSpacing: '-0.03em',
            lineHeight:    1,
          }}>
            {/* "viral" — bold teal gradient */}
            <span style={{
              fontWeight:           900,
              background:           'linear-gradient(135deg, #00DDD4 0%, #009E98 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              viral
            </span>
            {/* "coach" — light, understated */}
            <span style={{
              fontWeight: 300,
              color:      'var(--text)',
              opacity:    0.58,
            }}>
              coach
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
