/**
 * ViralCoach Logo — "The Signal V"
 *
 * Concept: A single bold stroke forming a V where the right arm
 * rises slightly above the left — subtle upward momentum.
 * The mark reads as both the letter V and a trending-up signal.
 *
 * Design principles:
 *   - One element only. No stars, arrows, or ornaments.
 *   - Stroke-based (not filled) for a modern, minimal feel.
 *   - Right tip sits higher than left: (85,10) vs (15,18) — going viral.
 *   - Three depth layers: glow → mark → glass shine.
 *   - Gradient: cyan (left) → indigo (centre) → violet (right).
 *
 * Wordmark: mark acts as the "V" in viral.
 *   [mark] + "iral" (bold gradient) + "coach" (light muted) = "viralcoach"
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid = `vc-${Math.round(size)}`
  const g   = `${uid}-g`    // stroke gradient
  const f   = `${uid}-f`    // glow blur

  // The V path — right arm terminates higher to suggest rising/viral momentum
  const V = 'M 14 20 L 50 84 L 86 10'

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 6 : 4 }}
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
          {/* Left → right brand gradient */}
          <linearGradient id={g} x1="14" y1="50" x2="86" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00E5FF" />
            <stop offset="48%"  stopColor="#818CF8" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Soft glow filter */}
          <filter id={f} x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Layer 1 — atmospheric glow */}
        <path
          d={V}
          stroke={`url(#${g})`}
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.25"
          filter={`url(#${f})`}
        />

        {/* Layer 2 — main bold stroke */}
        <path
          d={V}
          stroke={`url(#${g})`}
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Layer 3 — inner glass shine */}
        <path
          d={V}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right-tip accent — the highest point, brightest, signals upward */}
        <circle cx="86" cy="10" r="4"   fill="rgba(168,85,247,0.6)"  />
        <circle cx="86" cy="10" r="2"   fill="white" opacity="0.85" />
      </svg>

      {showWordmark && (
        <div style={{ lineHeight: 1, userSelect: 'none' }}>
          <span style={{
            fontFamily:    'var(--font-head)',
            fontSize:      Math.max(size * 0.44, 13),
            letterSpacing: '-0.03em',
            lineHeight:    1,
          }}>
            {/* "iral" — bold gradient, completes the word "viral" with the mark */}
            <span style={{
              fontWeight:           900,
              background:           'linear-gradient(135deg, #00E5FF 0%, #818CF8 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              iral
            </span>
            {/* "coach" — light weight, understated */}
            <span style={{
              fontWeight: 300,
              color:      'var(--text)',
              opacity:    0.6,
            }}>
              coach
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
