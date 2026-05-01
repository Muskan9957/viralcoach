/**
 * ViralCoach Logo — Victory Hand ✌
 *
 * The mark IS the letter V in "viral":
 *   [✌] + "iral" + "coach"  →  reads as "viralcoach"
 *
 * Anatomy:
 *   - Two rounded-tip finger strokes (index + middle finger)
 *   - Each finger curves slightly outward — organic, not geometric
 *   - A filled palm base connecting them at the bottom
 *   - Gradient: cyan (left finger) → indigo (palm) → violet (right finger)
 *   - Three depth layers: glow → mark → shine
 *
 * The negative space between the fingers forms the V naturally.
 * StrokeLinecap "round" gives the fingertip roundness for free.
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid = `vc-${Math.round(size)}`
  const g   = `${uid}-g`   // main gradient
  const f   = `${uid}-f`   // blur filter
  const pg  = `${uid}-pg`  // palm gradient (radial, centred)

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 9 : 5 }}
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
          {/* Main left→right gradient */}
          <linearGradient id={g} x1="12" y1="50" x2="88" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00E5FF" />
            <stop offset="46%"  stopColor="#818CF8" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Radial glow for the palm */}
          <radialGradient id={pg} cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.6" />
          </radialGradient>

          {/* Blur for atmospheric glow */}
          <filter id={f} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* ── Layer 1: Soft atmospheric glow ─────────────────────── */}
        <g opacity="0.22" filter={`url(#${f})`}>
          {/* Left finger glow */}
          <path
            d="M 43 79 Q 28 46 18 12"
            stroke={`url(#${g})`}
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right finger glow */}
          <path
            d="M 57 79 Q 72 46 82 12"
            stroke={`url(#${g})`}
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ── Layer 2: Palm base ──────────────────────────────────── */}
        {/*
            Arch shape:  top edge curves up slightly (like the back of a hand),
            bottom edge is a smooth arc (the heel of the palm).
            Sits behind the finger strokes — fingers appear to grow from the palm.
        */}
        <path
          d="
            M 30 82
            Q 36 75 43 79
            Q 50 82 57 79
            Q 64 75 70 82
            Q 64 96 50 97
            Q 36 96 30 82
            Z
          "
          fill={`url(#${pg})`}
          opacity="0.92"
        />

        {/* ── Layer 3: Finger strokes ─────────────────────────────── */}
        {/*
            Left finger  — index finger, tilts upper-left.
            Bezier control point pulls the stroke outward slightly
            so it curves naturally, like a real finger.
        */}
        <path
          d="M 43 79 Q 28 46 18 12"
          stroke={`url(#${g})`}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        {/*
            Right finger — middle finger, tilts upper-right.
            Mirror of left.
        */}
        <path
          d="M 57 79 Q 72 46 82 12"
          stroke={`url(#${g})`}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Layer 4: Inner shine — glass / 3-D effect ───────────── */}
        <path
          d="M 43 79 Q 28 46 18 12"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 57 79 Q 72 46 82 12"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Fingertip accent dots — tiny highlights at the tips ─── */}
        <circle cx="18" cy="12" r="3.5" fill="rgba(0,229,255,0.55)" />
        <circle cx="82" cy="12" r="3.5" fill="rgba(168,85,247,0.55)" />
        <circle cx="18" cy="12" r="1.8" fill="white"              opacity="0.7" />
        <circle cx="82" cy="12" r="1.8" fill="white"              opacity="0.7" />
      </svg>

      {/* ── Wordmark: [✌] acts as the V, so text = "iral" + "coach" ── */}
      {showWordmark && (
        <div style={{ lineHeight: 1, userSelect: 'none' }}>
          <span style={{
            fontFamily:    'var(--font-head)',
            fontSize:      Math.max(size * 0.44, 13),
            letterSpacing: '-0.03em',
            lineHeight:    1,
          }}>
            {/* "iral" — bold gradient, completes the word "viral" */}
            <span style={{
              fontWeight:           900,
              background:           'linear-gradient(135deg, #00E5FF 0%, #818CF8 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              iral
            </span>
            {/* "coach" — light weight, muted */}
            <span style={{
              fontWeight: 300,
              color:      'var(--text)',
              opacity:    0.62,
            }}>
              coach
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
