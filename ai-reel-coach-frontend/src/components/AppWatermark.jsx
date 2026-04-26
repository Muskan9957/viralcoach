/**
 * AppWatermark
 *
 * Large, faint background watermark — fixed bottom-right on every
 * authenticated page. Renders the exact Logo mark (V + loop + play
 * circle + arrow) at 580px with:
 *   • AI circuit nodes at key junctions (loop centre, V-bottom, entry)
 *   • Dashed connector lines extending outward like a neural net
 *   • A slow scan-dot that travels along the V path (AI data-flow feel)
 *   • Outer ring pulse on the loop node
 *
 * Opacity: 0.055 dark / 0.028 light — invisible to casual eye, just
 * enough to feel branded when noticed.
 */
export default function AppWatermark() {
  return (
    <>
      <style>{`
        /* Scan dot travels the full V path length (~210 units) */
        .wm-scan {
          stroke-dasharray: 7 220;
          stroke-dashoffset: 0;
          animation: wmScan 6s linear infinite;
        }
        @keyframes wmScan {
          to { stroke-dashoffset: -227; }
        }

        /* Outer ring breathes at the loop-centre node */
        .wm-ring {
          animation: wmRing 3.2s ease-in-out infinite;
          transform-origin: 30px 36px;
        }
        @keyframes wmRing {
          0%,100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.70; transform: scale(1.45); }
        }

        /* Tiny terminal dots fade in/out at different phases */
        .wm-blink-a { animation: wmBlink 4s 0s   ease-in-out infinite; }
        .wm-blink-b { animation: wmBlink 4s 1.3s ease-in-out infinite; }
        .wm-blink-c { animation: wmBlink 4s 2.6s ease-in-out infinite; }
        @keyframes wmBlink {
          0%,100% { opacity: 0.20; }
          50%      { opacity: 0.50; }
        }

        [data-theme="light"] .app-watermark { opacity: 0.028 !important; }
      `}</style>

      <div
        className="app-watermark"
        style={{
          position: 'fixed',
          bottom: '-8%',
          right:  '-6%',
          width:  'min(52vw, 580px)',
          height: 'min(52vw, 580px)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.055,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >

          {/* ── Shadow depth layer ─────────────────────────────────── */}
          <path d="M 50 15 C 48 15, 46 18, 42 24"  stroke="#000820" strokeWidth="13" strokeLinecap="round" />
          <path d="M 42 24 A 17 17 0 1 0 42 48"    stroke="#000820" strokeWidth="13" strokeLinecap="round" />
          <path d="M 42 48 C 46 44, 52 64, 52 84"  stroke="#000820" strokeWidth="13" strokeLinecap="round" />
          <path d="M 52 84 C 60 68, 68 46, 73 28"  stroke="#000820" strokeWidth="13" strokeLinecap="round" />

          {/* ── Main V-mark strokes ─────────────────────────────────── */}
          <path d="M 50 15 C 48 15, 46 18, 42 24"  stroke="white" strokeWidth="9" strokeLinecap="round" />
          <path d="M 42 24 A 17 17 0 1 0 42 48"    stroke="white" strokeWidth="9" strokeLinecap="round" />
          <path d="M 42 48 C 46 44, 52 64, 52 84"  stroke="white" strokeWidth="9" strokeLinecap="round" />
          <path d="M 52 84 C 60 68, 68 46, 73 28"  stroke="white" strokeWidth="9" strokeLinecap="round" />

          {/* ── Play circle ─────────────────────────────────────────── */}
          <circle cx="73" cy="22" r="16" fill="white" />
          <path d="M 68 16 L 68 28 L 82 22 Z" fill="black" opacity="0.22" />

          {/* ── Trending arrow ──────────────────────────────────────── */}
          <line x1="83" y1="12" x2="97" y2="1"  stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M 91 1 L 97 1 L 97 8"         stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* ── AI circuit: loop-centre node (cx=30, cy=36) ─────────── */}
          {/* breathing outer ring */}
          <circle cx="30" cy="36" r="5.5" stroke="white" strokeWidth="0.9" fill="none" className="wm-ring" />
          {/* solid inner dot */}
          <circle cx="30" cy="36" r="2.2" fill="white" opacity="0.65" />

          {/* ── AI circuit: V-bottom node ───────────────────────────── */}
          <circle cx="52" cy="84" r="3"   stroke="white" strokeWidth="0.9" fill="none" opacity="0.45" />
          <circle cx="52" cy="84" r="1.4" fill="white" opacity="0.50" />

          {/* ── AI circuit: entry node ──────────────────────────────── */}
          <circle cx="50" cy="15" r="1.8" fill="white" opacity="0.45" />

          {/* ── Neural net: dashed connector lines + terminals ──────── */}
          <line x1="30" y1="36" x2="12" y2="22" stroke="white" strokeWidth="0.8" strokeDasharray="1.8 2.8" opacity="0.28" />
          <line x1="30" y1="36" x2="6"  y2="48" stroke="white" strokeWidth="0.8" strokeDasharray="1.8 2.8" opacity="0.22" />
          <line x1="52" y1="84" x2="32" y2="95" stroke="white" strokeWidth="0.8" strokeDasharray="1.8 2.8" opacity="0.20" />
          <line x1="50" y1="15" x2="38" y2="4"  stroke="white" strokeWidth="0.8" strokeDasharray="1.8 2.8" opacity="0.22" />

          {/* Terminal nodes at line ends */}
          <circle cx="12" cy="22" r="1.6" fill="white" className="wm-blink-a" />
          <circle cx="6"  cy="48" r="1.3" fill="white" className="wm-blink-b" />
          <circle cx="32" cy="95" r="1.2" fill="white" className="wm-blink-c" />
          <circle cx="38" cy="4"  r="1.4" fill="white" className="wm-blink-a" />

          {/* ── AI scan dot — travels along V path ─────────────────── */}
          <path
            className="wm-scan"
            d="M 50 15 C 48 15, 46 18, 42 24 M 42 24 A 17 17 0 1 0 42 48 M 42 48 C 46 44, 52 64, 52 84 M 52 84 C 60 68, 68 46, 73 28"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

        </svg>
      </div>
    </>
  )
}
