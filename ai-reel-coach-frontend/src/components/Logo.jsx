/**
 * ViralCoach Logo — faithful SVG reproduction of the reference design
 *
 * LIGHT MODE: blue (#3B55F0) → purple (#7B40D0) V-arms, soft shadow
 * DARK  MODE: cyan (#00CCFF) → violet (#9060FF) V-arms, neon glow
 *
 * Colours driven by CSS custom properties (--logo-v1, --logo-v2) so
 * the mark recolours automatically when data-theme switches.
 *
 * Mark anatomy:
 *   Left arm  — enters loop from upper-right, sweeps left through loop,
 *               exits lower-right, descends to V-bottom
 *   Loop      — circular ring (fill:none stroke), drawn in front of arm
 *   Right arm — rises from V-bottom to play-circle
 *   Play circle — purple→pink filled circle with white ▶ inside
 *   Arrow     — coral→amber bold diagonal arrow (↗) from play circle
 *
 * 3-D ribbon effect: each arm = 3 stacked strokes (shadow / main / highlight)
 * Depth masking: SVG <mask> hides each arm where it passes behind its
 *   circle so no background-colour hack is needed (works on any bg).
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid = `vc-${Math.round(size)}`

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 10 : 7 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="vc-logo-mark"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>

          {/* ── V arm gradient: --logo-v1 (top-left) → --logo-v2 (bottom-right) ── */}
          <linearGradient id={`${uid}-v`} x1="8" y1="5" x2="82" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="var(--logo-v1, #00CCFF)" />
            <stop offset="100%" stopColor="var(--logo-v2, #9060FF)" />
          </linearGradient>

          {/* ── Highlight streak (inner shine on tube) ── */}
          <linearGradient id={`${uid}-h`} x1="8" y1="5" x2="82" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="var(--logo-h1, #80E8FF)" />
            <stop offset="100%" stopColor="var(--logo-h2, #C0A0FF)" />
          </linearGradient>

          {/* ── Play circle: purple → hot pink ── */}
          <linearGradient id={`${uid}-p`} x1="61" y1="7" x2="87" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#9040D8" />
            <stop offset="100%" stopColor="#FF2878" />
          </linearGradient>

          {/* ── Arrow: coral (base) → amber (tip) ── */}
          <linearGradient id={`${uid}-a`} x1="84" y1="16" x2="98" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FF4820" />
            <stop offset="100%" stopColor="#FFB040" />
          </linearGradient>

          {/* ── Mask: hides left arm INSIDE the loop circle ── */}
          <mask id={`${uid}-lm`}>
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <circle cx="18" cy="28" r="14" fill="black" />
          </mask>

          {/* ── Mask: hides right arm INSIDE the play circle ── */}
          <mask id={`${uid}-pm`}>
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <circle cx="74" cy="20" r="13" fill="black" />
          </mask>

        </defs>

        {/* ══════════════════════════════════════════════════════════════
            LEFT ARM
            Path: entry stub (30,18) → loop sweep (left, down, right) →
                  exit (30,36) → descent to V-bottom (50,78)
            Masked so the arm is hidden inside the loop circle.
        ══════════════════════════════════════════════════════════════ */}
        <g mask={`url(#${uid}-lm)`}>
          {/* Shadow */}
          <path
            d="M 30 18
               C 26 16, 16 14, 10 20
               C  4 26,  4 32, 10 38
               C 16 44, 26 42, 30 36
               C 36 42, 44 60, 50 78"
            stroke="var(--logo-shadow, #1020A0)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main gradient */}
          <path
            d="M 30 18
               C 26 16, 16 14, 10 20
               C  4 26,  4 32, 10 38
               C 16 44, 26 42, 30 36
               C 36 42, 44 60, 50 78"
            stroke={`url(#${uid}-v)`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Highlight streak */}
          <path
            d="M 30 18
               C 26 16, 16 14, 10 20
               C  4 26,  4 32, 10 38
               C 16 44, 26 42, 30 36
               C 36 42, 44 60, 50 78"
            stroke={`url(#${uid}-h)`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
          />
        </g>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT ARM
            From V-bottom (50,78) up to play circle edge (72,28).
            Masked inside play circle.
        ══════════════════════════════════════════════════════════════ */}
        <g mask={`url(#${uid}-pm)`}>
          <path
            d="M 50 78 C 56 64, 66 44, 72 28"
            stroke="var(--logo-shadow, #1020A0)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 50 78 C 56 64, 66 44, 72 28"
            stroke={`url(#${uid}-v)`}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 50 78 C 56 64, 66 44, 72 28"
            stroke={`url(#${uid}-h)`}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>

        {/* ══════════════════════════════════════════════════════════════
            LOOP CIRCLE  — drawn in front of left arm
            Three stroke layers create the 3-D ring.
            fill="none" so the masked-out arm stays hidden.
        ══════════════════════════════════════════════════════════════ */}
        <circle cx="18" cy="28" r="14"
          stroke="var(--logo-shadow, #1020A0)" strokeWidth="14" fill="none" />
        <circle cx="18" cy="28" r="14"
          stroke={`url(#${uid}-v)`} strokeWidth="10" fill="none" />
        <circle cx="18" cy="28" r="14"
          stroke={`url(#${uid}-h)`} strokeWidth="3.5" fill="none" opacity="0.45" />

        {/* ══════════════════════════════════════════════════════════════
            PLAY BUTTON CIRCLE — drawn in front of right arm
        ══════════════════════════════════════════════════════════════ */}
        <circle cx="74" cy="20" r="13" fill={`url(#${uid}-p)`} />
        {/* ▶ triangle centred inside circle */}
        <path d="M 69 14 L 69 26 L 83 20 Z" fill="white" opacity="0.93" />

        {/* ══════════════════════════════════════════════════════════════
            TRENDING ARROW  ↗
            Shaft from play circle edge to top-right corner.
            Right-angle bracket at tip = instant "trending" read.
        ══════════════════════════════════════════════════════════════ */}
        <line x1="84" y1="14" x2="97" y2="1"
          stroke={`url(#${uid}-a)`} strokeWidth="7.5" strokeLinecap="round" />
        <path d="M 90 1 L 97 1 L 97 8"
          stroke={`url(#${uid}-a)`} strokeWidth="7.5"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />

      </svg>

      {/* ── Wordmark ───────────────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      Math.max(size * 0.42, 14),
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            display:       'flex',
            alignItems:    'baseline',
          }}>
            {/* "Viral" — matches the V-mark gradient */}
            <span style={{
              background:           'linear-gradient(135deg, var(--logo-v1, #00CCFF) 0%, var(--logo-v2, #9060FF) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Viral
            </span>
            {/* "Coach" — auto dark/light via var(--text) */}
            <span style={{
              color:      'var(--text)',
              fontWeight: 500,
              opacity:    0.75,
            }}>
              Coach
            </span>
          </div>
        </div>
      )}

    </div>
  )
}
