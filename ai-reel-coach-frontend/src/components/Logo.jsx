/**
 * ViralCoach Logo
 *
 * Mark: Play-V — a play button (▶) silhouette where the flat left edge
 *       has a triangular V-notch cut into it. Reads simultaneously as
 *       ▶ (video / reels) and V (viral). Single clean polygon, scales
 *       perfectly from 16px favicon to large hero use.
 *
 * Colors: purple → cyan gradient, inherits from CSS custom properties.
 *         In dark mode: warm purple glow via .vc-logo-mark CSS class.
 *         In light mode: subtle shadow, no glow.
 *
 * Watermark use: add className="vc-logo-watermark" on the wrapper div
 *                for mix-blend-mode:difference overlay on video content.
 */
export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  // Unique gradient ID per size — avoids SVG defs collision when multiple
  // sizes render on the same page (e.g. sidebar + mobile header).
  const uid = `vc-${Math.round(size)}`

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: size > 28 ? 10 : 7 }}
    >

      {/* ── Mark ────────────────────────────────────────────────────── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="vc-logo-mark"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/*
            Diagonal gradient: purple (top-left) → cyan (bottom-right)
            Matches the app's --accent2 → --accent brand direction.
          */}
          <linearGradient
            id={`${uid}-g`}
            x1="3" y1="4"
            x2="38" y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#7B5CF0" />
            <stop offset="100%" stopColor="#00C8FF" />
          </linearGradient>
        </defs>

        {/*
          Play-V mark
          ───────────
          M 3  4   ← top-left  (back of play button)
          L 38 20  ← right tip (apex of play button ▶)
          L 3  36  ← bottom-left
          L 13 20  ← V-notch   (inner point — creates the V)
          Z        ← back to top-left

          The notch at (13, 20) cuts a triangular bite from the flat left
          side of the standard play button shape, forming the V.
        */}
        <path
          d="M3 4 L38 20 L3 36 L13 20 Z"
          fill={`url(#${uid}-g)`}
        />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily:    'var(--font-head)',
            fontWeight:    900,
            fontSize:      Math.max(size * 0.4, 14),
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
            display:       'flex',
            alignItems:    'baseline',
          }}>
            {/* "Viral" — gradient, matches the mark */}
            <span style={{
              background:             'linear-gradient(135deg, #7B5CF0 0%, #00C8FF 100%)',
              WebkitBackgroundClip:   'text',
              WebkitTextFillColor:    'transparent',
              backgroundClip:         'text',
            }}>
              Viral
            </span>
            {/* "Coach" — neutral text color, lighter weight */}
            <span style={{
              color:      'var(--text)',
              fontWeight: 400,
              opacity:    0.80,
            }}>
              Coach
            </span>
          </div>
        </div>
      )}

    </div>
  )
}
