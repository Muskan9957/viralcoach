/**
 * Nuovve Logo
 *
 * Icon     : Three overlapping capsule/pill shapes
 *            Built as SVG lines with round caps — the simplest and most
 *            reliable way to draw a pill in SVG (no transforms, no clip paths).
 *            Orange (back) → Blue (mid) → Pink (front)
 *
 * Wordmark : "NUOVVE" — Plus Jakarta Sans 900, uppercase
 *            --logo-word: gold on dark (#C9A844), navy on light (#0F1535)
 */

export default function Logo({ size = 40, showWordmark = true, className = '' }) {
  const iconH    = size
  const iconW    = Math.round(size * 1.35)   // viewBox is 68×50 → ratio 1.36
  const wordSize = Math.max(size * 0.76, 24)
  const gap      = Math.max(size * 0.20, 7)

  return (
    <div
      className={className}
      style={{
        display:    'flex',
        alignItems: 'center',
        gap,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* ── Pill icon ──────────────────────────────────────────────
          Each pill = <line> with strokeLinecap="round".
          A line from A to B with stroke-width W draws a capsule shape
          exactly — no rotation math, no clipping, works in all browsers.

          Layering (painter's order = back to front):
            1. Orange  — bottom-left → upper-right  (~−45°)
            2. Blue    — center-left → upper-right  (~+28°)
            3. Pink    — left-center → right-center (~−10°, horizontal)
      ─────────────────────────────────────────────────────────── */}
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 68 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
        aria-hidden="true"
      >
        {/* 1 — Orange pill  (back layer) */}
        <line
          x1="4"  y1="43"
          x2="37" y2="7"
          stroke="#F7931E"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* highlight strip */}
        <line
          x1="4"  y1="43"
          x2="37" y2="7"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 2 — Blue / cyan pill  (middle layer) */}
        <line
          x1="18" y1="7"
          x2="63" y2="31"
          stroke="#00B8D9"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="18" y1="7"
          x2="63" y2="31"
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 3 — Pink / magenta pill  (front layer) */}
        <line
          x1="6"  y1="32"
          x2="58" y2="22"
          stroke="#E91E8C"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <line
          x1="6"  y1="32"
          x2="58" y2="22"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────────── */}
      {showWordmark && (
        <span
          style={{
            fontFamily:    '"Plus Jakarta Sans", sans-serif',
            fontWeight:    900,
            fontSize:      `${wordSize}px`,
            lineHeight:    1,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color:         'var(--logo-word, #C9A844)',
            whiteSpace:    'nowrap',
          }}
        >
          Nuovve
        </span>
      )}
    </div>
  )
}
