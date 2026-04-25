export default function Logo({ size = 40, showWordmark = true }) {
  const uid = `vc-${Math.round(size)}`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 10 : 7 }}>

      {/* ── Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0 0 ${Math.round(size * 0.18)}px rgba(0,200,255,0.55))
                   drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(123,92,240,0.35))`,
          flexShrink: 0,
        }}
      >
        <defs>
          {/* Diagonal gradient: purple (bottom-left) → cyan (top-right) */}
          <linearGradient
            id={`${uid}-g`}
            x1="4" y1="34" x2="36" y2="4"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#7B5CF0" />
            <stop offset="50%"  stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          {/* Radial glow behind spark */}
          <radialGradient id={`${uid}-spark`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00E5FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* ── Main V-mark ─────────────────────────────────────────── */}
        {/* Left arm: down-left anchor  |  Right arm: shoots up-right  */}
        <path
          d="M5 13 L18 32 L36 4"
          stroke={`url(#${uid}-g)`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── Spark at the peak (top-right tip) ────────────────────── */}
        {/* Soft glow halo */}
        <circle cx="36" cy="4" r="7"  fill={`url(#${uid}-spark)`} />
        {/* Bright core dot */}
        <circle cx="36" cy="4" r="3"  fill="#00E5FF" opacity="0.95" />
        {/* Tiny cross sparkle lines */}
        <line x1="36" y1="0"  x2="36" y2="3"  stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <line x1="36" y1="5"  x2="36" y2="8"  stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <line x1="32" y1="4"  x2="35" y2="4"  stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <line x1="37" y1="4"  x2="40" y2="4"  stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 900,
            fontSize: Math.max(size * 0.4, 14),
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            display: 'flex',
            alignItems: 'baseline',
            gap: 0,
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #00C8FF 45%, #7B5CF0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Viral
            </span>
            <span style={{
              color: 'var(--text)',
              fontWeight: 500,
              opacity: 0.88,
            }}>
              Coach
            </span>
          </div>
          {size >= 30 && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: Math.max(size * 0.2, 8),
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: 2,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.7,
              whiteSpace: 'nowrap',
            }}>
              Go Viral
            </div>
          )}
        </div>
      )}

    </div>
  )
}
