import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLang } from '../i18n.jsx'

/* ─── Language flip button ───────────────────────────────────────── */
function LangFlip() {
  const { lang, setLanguage } = useLang()
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 99, padding: 3,
    }}>
      {[
        { code: 'en', label: 'EN'  },
        { code: 'hi', label: 'हिं' },
      ].map(o => {
        const active = lang === o.code
        return (
          <button
            key={o.code}
            type="button"
            onClick={() => !active && setLanguage(o.code)}
            aria-pressed={active}
            style={{
              border: 'none', cursor: active ? 'default' : 'pointer',
              padding: '4px 11px', borderRadius: 99,
              background: active ? 'linear-gradient(135deg, #00D4FF, #FF2D8B)' : 'transparent',
              color: active ? '#fff' : 'var(--text-muted)',
              fontFamily: o.code === 'hi' ? 'var(--font-body)' : 'var(--font-mono)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
              transition: 'background 0.18s, color 0.18s',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── *
 *  HOOK STUDIO                                                        *
 *  The entire right column is a single tall card that cycles through  *
 *  3 real AI-written hooks — topic tag → hook text → score bar →     *
 *  stats. Pure CSS animation, no JS state, no phone, no chips.        *
 * ─────────────────────────────────────────────────────────────────── */
const HOOKS = [
  {
    n: 1,
    topic:  'FITNESS',
    accent: '#FF2D8B',
    grad:   'linear-gradient(180deg,#FF6B35 0%,#FF2D8B 100%)',
    hook:   'Most beginners quit the gym in week 2. Here\'s the single habit that kept me going for 2 years straight.',
    score:  94,
    views:  '2.4M',
    likes:  '847K',
    bar:    '94%',
  },
  {
    n: 2,
    topic:  'TECH',
    accent: '#00D4FF',
    grad:   'linear-gradient(180deg,#A855F7 0%,#00D4FF 100%)',
    hook:   'I handed my content calendar to AI. From 5K to 100K followers in 60 days — here\'s the exact system.',
    score:  91,
    views:  '1.8M',
    likes:  '392K',
    bar:    '91%',
  },
  {
    n: 3,
    topic:  'FINANCE',
    accent: '#A8FF3C',
    grad:   'linear-gradient(180deg,#FFB800 0%,#A8FF3C 100%)',
    hook:   'The daily habit quietly costing you ₹50,000 a year. Most people will go their whole life not noticing.',
    score:  88,
    views:  '3.1M',
    likes:  '1.2M',
    bar:    '88%',
  },
]

function HookStudio() {
  return (
    <div className="hs-wrap">

      {/* ── Slow rotating aurora ──────────────────────────────────── */}
      <div className="hs-aurora" aria-hidden />

      {/* ── Subtle drift particles ────────────────────────────────── */}
      <div className="hs-particles" aria-hidden>
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`hs-pt hs-pt-${i}`} />
        ))}
      </div>

      {/* ── Rotating hook panels ──────────────────────────────────── */}
      {HOOKS.map(h => (
        <div key={h.n} className={`hs-panel hs-panel-${h.n}`} aria-hidden={h.n !== 1}>

          {/* Left gradient stripe */}
          <div className="hs-stripe" style={{ background: h.grad }} />

          {/* Main content */}
          <div className="hs-body">

            {/* Topic tag */}
            <div className="hs-tag" style={{ '--ac': h.accent }}>
              <span className="hs-tag-dot" />
              {h.topic}
            </div>

            {/* The hook — this IS the product */}
            <blockquote className="hs-hook-text">
              {h.hook}
            </blockquote>

            {/* Hook score */}
            <div className="hs-score-block">
              <div className="hs-score-header">
                <span className="hs-score-label">Hook Score</span>
                <span className="hs-score-num" style={{ color: h.accent }}>{h.score}</span>
              </div>
              <div className="hs-track">
                <div
                  className={`hs-bar hs-bar-${h.n}`}
                  style={{ '--ac': h.accent, '--w': h.bar }}
                />
              </div>
            </div>

            {/* Engagement stats */}
            <div className={`hs-stats hs-stats-${h.n}`}>
              <div className="hs-stat">
                <span className="hs-stat-icon">👁</span>
                <span className="hs-stat-val">{h.views}</span>
                <span className="hs-stat-unit">views</span>
              </div>
              <div className="hs-sep" />
              <div className="hs-stat">
                <span className="hs-stat-icon">❤️</span>
                <span className="hs-stat-val">{h.likes}</span>
                <span className="hs-stat-unit">likes</span>
              </div>
              <div className="hs-sep" />
              <div className="hs-plats">
                <span>◈</span>
                <span>▶</span>
                <span>in</span>
                <span>𝕏</span>
              </div>
            </div>

          </div>
        </div>
      ))}

      {/* ── Progress + dot indicators ─────────────────────────────── */}
      <div className="hs-footer">
        <div className="hs-progress-track">
          <div className="hs-progress-fill" />
        </div>
        <div className="hs-dots">
          <div className="hs-dot hs-dot-1" />
          <div className="hs-dot hs-dot-2" />
          <div className="hs-dot hs-dot-3" />
        </div>
      </div>

    </div>
  )
}

/* ─── Landing Page ───────────────────────────────────────────────── */
export default function Landing() {
  const { t } = useLang()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 5%',
        background: 'rgba(7,9,28,0.92)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Logo size={42} showWordmark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LangFlip />
          <Link
            to="/auth"
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem',
              color: 'var(--text-muted)', textDecoration: 'none',
              padding: '8px 16px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.background = 'var(--surface2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {t('landing_signin')}
          </Link>
          <Link to="/auth" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            {t('landing_get_started')}
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero-split">

        {/* Background orbs */}
        <div className="hero-bg" aria-hidden>
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>

        {/* Left: headline + CTA */}
        <div className="hero-text">
          <h1 className="hero-h1">
            {t('landing_h1_a')}{' '}
            <span className="hero-h1-grad">{t('landing_h1_b')}</span>
          </h1>
          <p className="hero-sub">{t('landing_sub')}</p>
          <div className="hero-ctas">
            <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 190 }}>
              {t('landing_cta_primary')}
            </Link>
          </div>
        </div>

        {/* Right: Hook Studio */}
        <div className="hero-visual">
          <HookStudio />
        </div>

      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 14, background: 'var(--surface)',
        marginTop: 'auto',
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
          {t('landing_footer_legal')}
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <Link to="/privacy" style={{ fontSize: '0.74rem', color: 'var(--text-faint)', textDecoration: 'none' }}>{t('landing_privacy')}</Link>
          <Link to="/terms"   style={{ fontSize: '0.74rem', color: 'var(--text-faint)', textDecoration: 'none' }}>{t('landing_terms')}</Link>
        </div>
      </footer>

      {/* ── Styles ───────────────────────────────────────────────── */}
      <style>{`

        /* ════════════════════════════════════════════════════════════
           HERO LAYOUT
        ════════════════════════════════════════════════════════════ */
        .hero-split {
          position: relative;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: stretch;
          padding: 60px 6% 60px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          min-height: calc(100vh - 130px);
        }
        .hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); }
        .hero-orb-1 {
          top: -10%; left: -8%; width: 500px; height: 400px;
          background: radial-gradient(ellipse, rgba(0,212,255,0.09) 0%, transparent 65%);
        }
        .hero-orb-2 {
          bottom: -5%; right: -5%; width: 500px; height: 450px;
          background: radial-gradient(ellipse, rgba(255,45,139,0.10) 0%, transparent 65%);
        }

        .hero-text {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; justify-content: center;
          animation: fadeUp 0.55s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hero-h1 {
          font-family: var(--font-head);
          font-weight: 900;
          font-size: clamp(2.5rem, 4.8vw, 4.2rem);
          letter-spacing: -0.035em;
          line-height: 1.05;
          color: var(--text);
          margin: 0 0 22px;
        }
        .hero-h1-grad {
          background: linear-gradient(135deg, #00D4FF 0%, #FF2D8B 55%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          filter: drop-shadow(0 0 40px rgba(255,45,139,0.28));
        }
        .hero-sub {
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          color: var(--text-muted);
          line-height: 1.65;
          max-width: 440px;
          margin: 0 0 36px;
        }
        .hero-ctas { display: flex; gap: 12px; }

        .hero-visual {
          position: relative; z-index: 1;
          display: flex; align-items: stretch;
          animation: fadeUp 0.65s 0.15s cubic-bezier(0.22,1,0.36,1) both;
        }

        @media (max-width: 860px) {
          .hero-split {
            grid-template-columns: 1fr;
            gap: 36px;
            text-align: center;
            padding: 36px 5% 48px;
            min-height: auto;
          }
          .hero-text { order: 1; align-items: center; }
          .hero-visual { order: 2; min-height: 380px; }
          .hero-sub { margin-left: auto; margin-right: auto; }
          .hero-ctas { justify-content: center; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ════════════════════════════════════════════════════════════
           HOOK STUDIO
           18-second cycle · 3 hooks · 6s each · pure CSS
        ════════════════════════════════════════════════════════════ */

        /* Timing constants (18s total, 6s per hook):
           Panel shows: 0–33.3% of the cycle
           In:    0–5%    (fade up)
           Hold:  5–28%
           Out:   28–33%  (fade up out)
           Rest:  33–100% (invisible) */

        .hs-wrap {
          position: relative;
          width: 100%;
          border-radius: 22px;
          overflow: hidden;
          background: linear-gradient(155deg, #07091E 0%, #0C0F2E 60%, #080C22 100%);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            0 50px 100px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          min-height: 400px;
        }

        /* ── Aurora ─────────────────── */
        .hs-aurora {
          position: absolute; inset: -50%;
          background: conic-gradient(
            from 200deg at 30% 60%,
            rgba(0,212,255,0.07)   0deg,
            rgba(255,45,139,0.07) 120deg,
            rgba(168,85,247,0.07) 240deg,
            rgba(0,212,255,0.07)  360deg
          );
          filter: blur(50px);
          animation: auroraRotate 28s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes auroraRotate { to { transform: rotate(360deg); } }

        /* ── Drift particles ────────── */
        .hs-particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .hs-pt {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          opacity: 0;
          animation: ptDrift 8s ease-in-out infinite;
        }
        .hs-pt-0  { left:8%;  bottom:10%; background:#FF2D8B; animation-delay:0.0s; }
        .hs-pt-1  { left:18%; bottom:20%; background:#00D4FF; animation-delay:0.8s; }
        .hs-pt-2  { left:28%; bottom:5%;  background:#FFB800; animation-delay:1.6s; }
        .hs-pt-3  { left:38%; bottom:15%; background:#FF2D8B; animation-delay:2.4s; }
        .hs-pt-4  { left:52%; bottom:8%;  background:#A8FF3C; animation-delay:3.2s; }
        .hs-pt-5  { left:63%; bottom:18%; background:#00D4FF; animation-delay:4.0s; }
        .hs-pt-6  { left:74%; bottom:6%;  background:#A855F7; animation-delay:4.8s; }
        .hs-pt-7  { left:85%; bottom:22%; background:#FF5F4C; animation-delay:5.6s; }
        .hs-pt-8  { left:92%; bottom:12%; background:#FFB800; animation-delay:6.4s; }
        .hs-pt-9  { left:5%;  bottom:40%; background:#00D4FF; animation-delay:1.2s; }
        .hs-pt-10 { left:48%; bottom:45%; background:#FF2D8B; animation-delay:3.6s; }
        .hs-pt-11 { left:78%; bottom:38%; background:#A8FF3C; animation-delay:5.2s; }
        @keyframes ptDrift {
          0%   { opacity: 0; transform: translateY(0)   scale(1); }
          15%  { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-90px) scale(0.5); }
        }

        /* ── Hook panels ────────────── */
        .hs-panel {
          position: absolute; inset: 0;
          display: flex;
          opacity: 0;
          z-index: 2;
          animation: panelCycle 18s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .hs-panel-1 { animation-delay: 0s; }
        .hs-panel-2 { animation-delay: 6s; }
        .hs-panel-3 { animation-delay: 12s; }

        @keyframes panelCycle {
          0%    { opacity: 0; transform: translateY(18px); }
          5%    { opacity: 1; transform: translateY(0);    }
          28%   { opacity: 1; transform: translateY(0);    }
          33%   { opacity: 0; transform: translateY(-14px);}
          100%  { opacity: 0; transform: translateY(-14px);}
        }

        /* Left gradient stripe */
        .hs-stripe {
          width: 4px;
          flex-shrink: 0;
          border-radius: 0;
        }

        /* Body */
        .hs-body {
          flex: 1;
          padding: clamp(32px,5vw,52px) clamp(28px,4.5vw,48px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        /* Topic tag */
        .hs-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ac);
          background: color-mix(in srgb, var(--ac) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--ac) 30%, transparent);
          border-radius: 99px;
          padding: 5px 14px;
          width: fit-content;
          margin-bottom: 24px;
        }
        .hs-tag-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--ac);
          box-shadow: 0 0 7px var(--ac);
          animation: tagPulse 1.6s ease-in-out infinite;
        }
        @keyframes tagPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.4; transform: scale(0.65); }
        }

        /* Hook text — the hero of the card */
        .hs-hook-text {
          margin: 0 0 32px;
          font-family: var(--font-head);
          font-size: clamp(1.25rem, 2.2vw, 1.65rem);
          font-weight: 800;
          color: rgba(255,255,255,0.96);
          line-height: 1.4;
          letter-spacing: -0.025em;
          quotes: none;
          position: relative;
          padding-left: 0;
        }

        /* Score block */
        .hs-score-block { margin-bottom: 24px; }
        .hs-score-header {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 9px;
        }
        .hs-score-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.35);
        }
        .hs-score-num {
          font-family: var(--font-head);
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          filter: drop-shadow(0 0 12px currentColor);
        }
        .hs-track {
          height: 5px;
          background: rgba(255,255,255,0.07);
          border-radius: 5px;
          overflow: hidden;
        }
        .hs-bar {
          height: 100%;
          border-radius: 5px;
          background: var(--ac);
          box-shadow: 0 0 10px var(--ac);
          width: 0;
          animation: barFill 18s ease-in-out infinite;
        }
        .hs-bar-1 { animation-delay: 0s; }
        .hs-bar-2 { animation-delay: 6s; }
        .hs-bar-3 { animation-delay: 12s; }

        @keyframes barFill {
          0%,6%  { width: 0%; }
          20%    { width: var(--w, 90%); }
          28%    { width: var(--w, 90%); }
          33%    { width: 0%; }
          100%   { width: 0%; }
        }

        /* Stats row */
        .hs-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          opacity: 0;
          animation: statsFade 18s ease-in-out infinite;
        }
        .hs-stats-1 { animation-delay: 0s; }
        .hs-stats-2 { animation-delay: 6s; }
        .hs-stats-3 { animation-delay: 12s; }

        @keyframes statsFade {
          0%,14%  { opacity: 0; transform: translateY(6px); }
          22%     { opacity: 1; transform: translateY(0); }
          28%     { opacity: 1; }
          33%     { opacity: 0; }
          100%    { opacity: 0; }
        }

        .hs-stat {
          display: flex; align-items: baseline; gap: 5px;
        }
        .hs-stat-icon { font-size: 0.85rem; }
        .hs-stat-val {
          font-family: var(--font-head);
          font-size: 1.05rem;
          font-weight: 800;
          color: rgba(255,255,255,0.92);
          letter-spacing: -0.02em;
        }
        .hs-stat-unit {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .hs-sep {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .hs-plats {
          display: flex;
          gap: 9px;
          margin-left: 4px;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
        }
        .hs-plats span { transition: color 0.2s; cursor: default; }

        /* ── Footer: progress + dots ── */
        .hs-footer {
          position: relative; z-index: 3;
          margin-top: auto;
          padding: 18px 32px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.12);
        }
        .hs-progress-track {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
        }
        .hs-progress-fill {
          height: 100%;
          border-radius: 2px;
          animation: progressCycle 18s linear infinite;
        }
        @keyframes progressCycle {
          /* 3 segments of 33.33% each — color shifts at each boundary */
          0%      { width: 0%;    background: #FF2D8B; }
          32%     { width: 100%;  background: #FF2D8B; }
          33.3%   { width: 0%;    background: #00D4FF; }
          65.3%   { width: 100%;  background: #00D4FF; }
          66.6%   { width: 0%;    background: #A8FF3C; }
          98.6%   { width: 100%;  background: #A8FF3C; }
          100%    { width: 100%;  background: #A8FF3C; }
        }

        .hs-dots { display: flex; gap: 6px; align-items: center; }
        .hs-dot {
          height: 6px;
          border-radius: 3px;
          animation: dotCycle 18s ease-in-out infinite;
        }
        .hs-dot-1 { background: #FF2D8B; animation-delay: 0s; }
        .hs-dot-2 { background: #00D4FF; animation-delay: 6s; }
        .hs-dot-3 { background: #A8FF3C; animation-delay: 12s; }

        @keyframes dotCycle {
          0%,4%    { width: 22px; opacity: 1; }
          29%,100% { width: 6px;  opacity: 0.28; }
        }

        /* ── Responsive ──────────────────────────────────────────── */
        @media (max-width: 860px) {
          .hs-wrap { min-height: 340px; border-radius: 18px; }
          .hs-body  { padding: 28px 24px; }
          .hs-hook-text { font-size: 1.1rem; }
          .hs-score-num { font-size: 1.2rem; }
        }

      `}</style>
    </div>
  )
}
