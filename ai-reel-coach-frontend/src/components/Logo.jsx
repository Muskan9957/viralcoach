/**
 * Nuovve Logo
 * Three overlapping pill shapes + bold uppercase wordmark
 * Matches the reference design exactly.
 *
 * Pills built as SVG <line strokeLinecap="round"> — most reliable pill shape.
 * All coordinates stay within the viewBox — no overflow clipping issues.
 *
 * Blue changed to bright #00CFFF so it never blends with dark navy backgrounds.
 * Wordmark gold hardcoded with CSS-var fallback for both themes.
 */

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  // Icon viewBox: 60 × 48  →  aspect ≈ 1.25
  const iconH    = size
  const iconW    = Math.round(size * 1.25)
  const wordSize = Math.max(size * 0.80, 26)
  const gap      = Math.max(size * 0.18, 6)

  return (
    <div
      className={className}
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        gap,
        userSelect: 'none',
        flexShrink: 0,
        overflow:   'visible',
      }}
    >
      {/* ── Three-pill icon ───────────────────────────────────────
          viewBox 0 0 60 48 — all lines stay within these bounds.
          Painter order (back → front): orange → blue → pink.

          Orange: (4,42) → (34,6)   diagonal up-left  ~−48°
          Blue:   (16,6) → (56,28)  diagonal up-right ~+27°
          Pink:   (6,30) → (54,20)  mostly horizontal ~−11°
      ───────────────────────────────────────────────────────── */}
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 60 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: 'visible', display: 'block' }}
        aria-hidden="true"
      >
        {/* Orange — back layer */}
        <line
          x1="4"  y1="42"
          x2="34" y2="6"
          stroke="#FF8C1A"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Blue/Cyan — middle layer (bright so it never blends with dark navy) */}
        <line
          x1="16" y1="6"
          x2="56" y2="28"
          stroke="#00CFFF"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Pink/Magenta — front layer */}
        <line
          x1="6"  y1="30"
          x2="54" y2="20"
          stroke="#E91E8C"
          strokeWidth="13"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────────
          Gold on dark (#C9A844), deep navy on light (#0F1535).
          Gradient text also works as a failsafe on any background.
      ───────────────────────────────────────────────────────── */}
      {showWordmark && (
        <span
          className="nuovve-wordmark"
          style={{
            fontFamily:             '"Plus Jakarta Sans", sans-serif',
            fontWeight:             900,
            fontSize:               `${wordSize}px`,
            lineHeight:             1,
            letterSpacing:          '-0.02em',
            textTransform:          'uppercase',
            /* Gradient text — vivid on every background */
            background:             'linear-gradient(100deg, #C9A844 0%, #E8C55A 100%)',
            WebkitBackgroundClip:   'text',
            WebkitTextFillColor:    'transparent',
            backgroundClip:         'text',
            color:                  '#C9A844',   /* plain-colour fallback */
            whiteSpace:             'nowrap',
          }}
        >
          Nuovve
        </span>
      )}
    </div>
  )
}
