/**
 * ViralCoach Logo
 *
 * Mark anatomy (matches reference design):
 *  - Flowing V shape made of two rounded, 3D-ribbon-style strokes
 *  - Left arm has a loop/swirl at the top (script-V style)
 *  - Right arm leads into a play-button circle (▶) at its tip
 *  - A trending arrow (↗) shoots diagonally upward from the circle
 *
 * Colour scheme:
 *  - V strokes  : deep blue → indigo gradient with depth layers
 *  - Play circle: indigo → hot pink gradient
 *  - Arrow      : coral → amber gradient
 *  - Wordmark   : "Viral" in blue-indigo gradient / "Coach" via var(--text)
 *
 * Theme adaptation:
 *  - dark  mode: purple-blue glow via .vc-logo-mark CSS class (index.css)
 *  - light mode: subtle directional shadow, no neon glow
 *
 * Watermark utility: <Logo className="vc-logo-watermark" />
 *  applies opacity 0.35 + mix-blend-mode:difference for video overlays
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const uid = `vc-${Math.round(size)}`

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 10 : 7 }}
    >

      {/* ── Mark ────────────────────────────────────────────────────────── */}
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
          {/* V strokes — deep blue → indigo */}
          <linearGradient
            id={`${uid}-v`}
            x1="10" y1="5" x2="80" y2="95"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#2B4EE8" />
            <stop offset="100%" stopColor="#6B28DC" />
          </linearGradient>

          {/* Highlight streak on top of V strokes */}
          <linearGradient
            id={`${uid}-h`}
            x1="10" y1="5" x2="80" y2="95"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#7096FF" />
            <stop offset="100%" stopColor="#A070FF" />
          </linearGradient>

          {/* Play circle — indigo → hot pink */}
          <linearGradient
            id={`${uid}-p`}
            x1="0%" y1="0%" x2="100%" y2="100%"
          >
            <stop offset="0%"   stopColor="#8B30CC" />
            <stop offset="100%" stopColor="#FF2878" />
          </linearGradient>

          {/* Trending arrow — coral → amber */}
          <linearGradient
            id={`${uid}-a`}
            x1="0%" y1="100%" x2="100%" y2="0%"
          >
            <stop offset="0%"   stopColor="#FF5020" />
            <stop offset="100%" stopColor="#FFAA30" />
          </linearGradient>
        </defs>

        {/*
          ── Left arm of V ───────────────────────────────────────────────
          Starts at (26, 16), makes a loop/swirl going out-left and back,
          then descends diagonally to the V bottom at (53, 80).

          Three layers create the 3D ribbon effect:
            1. Dark shadow  (widest  — dark border/depth)
            2. Main colour  (mid     — gradient fill)
            3. Light streak (narrow  — inner highlight/shine)
        */}

        {/* Layer 1 — depth shadow */}
        <path
          d="M 26 16 C 8 8, 4 30, 14 37 C 20 41, 29 35, 25 25
             C 21 17, 28 12, 35 19 C 43 27, 51 55, 54 81"
          stroke="#1428A0"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Layer 2 — main gradient */}
        <path
          d="M 26 16 C 8 8, 4 30, 14 37 C 20 41, 29 35, 25 25
             C 21 17, 28 12, 35 19 C 43 27, 51 55, 54 81"
          stroke={`url(#${uid}-v)`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Layer 3 — inner highlight streak */}
        <path
          d="M 26 16 C 8 8, 4 30, 14 37 C 20 41, 29 35, 25 25
             C 21 17, 28 12, 35 19 C 43 27, 51 55, 54 81"
          stroke={`url(#${uid}-h)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />

        {/*
          ── Right arm of V ───────────────────────────────────────────────
          From the V bottom (54, 81) up to the play button circle (81, 16).
          Same three-layer approach for consistent 3D depth.
        */}

        {/* Layer 1 — depth shadow */}
        <path
          d="M 54 81 C 58 67, 65 49, 72 31 C 76 21, 79 14, 81 10"
          stroke="#36009A"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Layer 2 — main gradient */}
        <path
          d="M 54 81 C 58 67, 65 49, 72 31 C 76 21, 79 14, 81 10"
          stroke={`url(#${uid}-v)`}
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Layer 3 — inner highlight streak */}
        <path
          d="M 54 81 C 58 67, 65 49, 72 31 C 76 21, 79 14, 81 10"
          stroke={`url(#${uid}-h)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/*
          ── Play button circle ───────────────────────────────────────────
          Sits at the top of the right arm. Circle filled indigo→pink,
          white play triangle inside. Matches the reference reference.
        */}
        <circle cx="82" cy="18" r="14" fill={`url(#${uid}-p)`} />
        {/* Play triangle: centred inside circle */}
        <path
          d="M 77 12 L 77 24 L 91 18 Z"
          fill="white"
          opacity="0.92"
        />

        {/*
          ── Trending arrow (↗) ───────────────────────────────────────────
          Shoots diagonally up-right from the circle edge.
          Shaft + right-angle bracket at the tip = classic "trending" icon.
          Coral → amber gradient.
        */}
        {/* Shaft */}
        <line
          x1="88" y1="13"
          x2="97" y2="4"
          stroke={`url(#${uid}-a)`}
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Arrowhead — L-bracket at the tip */}
        <path
          d="M 90 4 L 97 4 L 97 11"
          stroke={`url(#${uid}-a)`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

      </svg>

      {/* ── Wordmark ──────────────────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily:    'var(--font-head)',
            fontWeight:    900,
            fontSize:      Math.max(size * 0.4, 14),
            letterSpacing: '-0.025em',
            lineHeight:    1.1,
            display:       'flex',
            alignItems:    'baseline',
          }}>
            {/* "Viral" matches the V-mark gradient */}
            <span style={{
              background:           'linear-gradient(135deg, #2B4EE8 0%, #6B28DC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Viral
            </span>
            {/* "Coach" uses --text so it auto-adapts dark ↔ light */}
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
