/**
 * ViralCoach Logo
 *
 * Exact match to reference image:
 *  - Thick flowing V with 3-D ribbon look
 *  - Left arm: entry stub → 270° loop arc (goes around left) → descent to V-bottom
 *  - Right arm: V-bottom up to play circle
 *  - Play circle: purple→pink gradient with white ▶ triangle
 *  - Arrow: coral→amber bold diagonal arrow (↗)
 *
 * Loop technique: SVG arc (A command, 270° counterclockwise) so no masking
 * or background-colour hack needed — works on any background.
 *
 * Theme colours via CSS custom properties:
 *   dark  → cyan (#00CCFF) → violet (#9060FF)  + neon glow
 *   light → blue (#3B55F0) → purple (#7B40D0)  + soft shadow
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid = `vc-${Math.round(size)}`

  const vGrad      = `url(#${uid}-v)`
  const hGrad      = `url(#${uid}-h)`
  const shadow     = 'var(--logo-shadow,#0A1880)'
  const SW         = 13   // shadow stroke width
  const MW         = 9    // main stroke width
  const HW         = 3    // highlight stroke width
  const cap        = 'round'

  // 3-layer path renderer: shadow → gradient → highlight
  const arm = (d, key) => (
    <g key={key}>
      <path d={d} stroke={shadow}  strokeWidth={SW} strokeLinecap={cap} strokeLinejoin={cap} fill="none" />
      <path d={d} stroke={vGrad}   strokeWidth={MW} strokeLinecap={cap} strokeLinejoin={cap} fill="none" />
      <path d={d} stroke={hGrad}   strokeWidth={HW} strokeLinecap={cap} strokeLinejoin={cap} fill="none" opacity="0.42" />
    </g>
  )

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
          {/* V arms — CSS vars flip between dark (cyan/violet) and light (blue/purple) */}
          <linearGradient id={`${uid}-v`} x1="8" y1="4" x2="84" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="var(--logo-v1,#00CCFF)" />
            <stop offset="100%" stopColor="var(--logo-v2,#9060FF)" />
          </linearGradient>

          {/* Inner shine streak */}
          <linearGradient id={`${uid}-h`} x1="8" y1="4" x2="84" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="var(--logo-h1,#80EEFF)" />
            <stop offset="100%" stopColor="var(--logo-h2,#C0A0FF)" />
          </linearGradient>

          {/* Play circle: indigo → hot-pink */}
          <linearGradient id={`${uid}-p`} x1="57" y1="6" x2="89" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#9040D8" />
            <stop offset="100%" stopColor="#FF2878" />
          </linearGradient>

          {/* Arrow: coral → amber */}
          <linearGradient id={`${uid}-a`} x1="83" y1="14" x2="98" y2="1" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FF4820" />
            <stop offset="100%" stopColor="#FFB040" />
          </linearGradient>
        </defs>

        {/*
          ══ LEFT ARM ══════════════════════════════════════════════════════

          Three separate path segments, each drawn with 3 stroke layers.
          They share start/end points so they blend seamlessly.

          Loop geometry:
            Circle center  : (30, 36)
            Radius         : 17
            Upper-right pt : (30 + 17·cos45°, 36 − 17·sin45°) ≈ (42, 24)
            Lower-right pt : (30 + 17·cos45°, 36 + 17·sin45°) ≈ (42, 48)

          Arc command "A 17 17 0 1 0" draws 270° counterclockwise arc
          from (42,24) going LEFT around the circle to (42,48).
          This creates the visible loop (the hidden 90° right arc is
          replaced by the entry + exit stubs).
        */}

        {/* 1. Entry stub: from arm entry point down to where the arc starts */}
        {arm('M 50 15 C 48 15, 46 18, 42 24', 'le')}

        {/* 2. Loop arc: 270° going left-around → creates the visible ring */}
        {arm('M 42 24 A 17 17 0 1 0 42 48', 'la')}

        {/* 3. Descent: from arc exit down to V-bottom */}
        {arm('M 42 48 C 46 44, 52 64, 52 84', 'ld')}

        {/*
          ══ RIGHT ARM ═════════════════════════════════════════════════════
          Rises from V-bottom (52,84) to the play circle (73,22).
          The filled play circle covers the arm end — no masking needed.
        */}
        {arm('M 52 84 C 60 68, 68 46, 73 28', 'ra')}

        {/*
          ══ PLAY BUTTON CIRCLE ════════════════════════════════════════════
          Filled circle sits on top of right arm, hiding the arm inside.
          White ▶ triangle centred at (73, 22).
        */}
        <circle cx="73" cy="22" r="16" fill={`url(#${uid}-p)`} />
        <path d="M 68 16 L 68 28 L 82 22 Z" fill="white" opacity="0.93" />

        {/*
          ══ TRENDING ARROW ↗ ══════════════════════════════════════════════
          Shaft from play-circle edge to top-right corner.
          Right-angle bracket at tip = instant "trending" signal.
        */}
        <line
          x1="83" y1="12" x2="97" y2="1"
          stroke={`url(#${uid}-a)`} strokeWidth="8" strokeLinecap="round"
        />
        <path
          d="M 91 1 L 97 1 L 97 8"
          stroke={`url(#${uid}-a)`} strokeWidth="8"
          strokeLinecap="round" strokeLinejoin="round" fill="none"
        />

      </svg>

      {/* ── Wordmark ──────────────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily:    'var(--font-head)',
            fontWeight:    900,
            fontSize:      Math.max(size * 0.42, 14),
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            display:       'flex',
            alignItems:    'baseline',
          }}>
            <span style={{
              background:           'linear-gradient(135deg,var(--logo-v1,#00CCFF) 0%,var(--logo-v2,#9060FF) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Viral
            </span>
            <span style={{
              color:      'var(--text)',
              fontWeight: 400,
              opacity:    0.78,
            }}>
              Coach
            </span>
          </div>
        </div>
      )}

    </div>
  )
}
