export default function Logo({ size = 40, showWordmark = true }) {
  const uid = `vc-${size}`
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ filter: `drop-shadow(0 0 ${Math.round(size * 0.28)}px rgba(0,200,255,0.45)) drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(123,92,240,0.25))` }}>
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00E5FF" />
            <stop offset="45%"  stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#7B5CF0" />
          </linearGradient>
        </defs>

        {/* ── Background — same gradient as dashboard logoIconBox ── */}
        <rect width="40" height="40" rx="10" fill={`url(#${uid}-bg)`} />
        <rect width="40" height="40" rx="10" fill="none"
          stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

        {/* ── V / Wings ── */}
        <path
          d="M5 34 L13 19 L19 27 L25 19 L33 34"
          fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* ── Rocket body ── */}
        <path d="M18 27 L27 9 L37 9 L37 19 Z" fill="rgba(255,255,255,0.92)" />

        {/* ── Rocket tip ── */}
        <path d="M31 9 L37 9 L37 15 Z" fill="rgba(0,229,255,0.95)" />

        {/* ── Lightning bolt ── */}
        <path
          d="M31 10 L26 20 L30 20 L25 30"
          stroke="rgba(0,229,255,1)" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M31 10 L26 20 L30 20 L25 30"
          stroke="rgba(255,255,255,0.6)" strokeWidth="0.7"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* ── Circuit node ── */}
        <circle cx="33" cy="13" r="2.2" fill="rgba(0,229,255,0.95)" />
        <line x1="33" y1="13" x2="30" y2="20"
          stroke="rgba(255,255,255,0.25)" strokeWidth="0.9" />

        {/* ── Constellation ── */}
        <circle cx="10" cy="15" r="2"   fill="rgba(255,255,255,0.72)" />
        <circle cx="7"  cy="22" r="1.4" fill="rgba(255,255,255,0.48)" />
        <circle cx="14" cy="11" r="1.3" fill="rgba(255,255,255,0.58)" />
        <line x1="10" y1="15" x2="7"  y2="22" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
        <line x1="10" y1="15" x2="14" y2="11" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />

        {/* ── Sparkles ── */}
        <circle cx="22" cy="6"  r="0.9" fill="white" opacity="0.5" />
        <circle cx="35" cy="27" r="1"   fill="rgba(0,229,255,0.7)" />
      </svg>

      {showWordmark && (
        <div>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: Math.max(size * 0.38, 14),
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.1,
          }}>
            <span style={{ fontWeight: 900 }}>Viral</span><span style={{ fontWeight: 400 }}>Coach</span>
          </div>
          {size >= 40 && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: Math.max(size * 0.18, 9),
              color: 'var(--accent)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: 2,
              opacity: 0.65,
              whiteSpace: 'nowrap',
            }}>
              Script · Score · Go Viral
            </div>
          )}
        </div>
      )}
    </div>
  )
}
