import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLang } from '../i18n.jsx'

/* ─── Studio Showcase — animated phone mockup ───────────────────── */
function StudioShowcase({ t }) {
  return (
    <div className="studio-showcase">
      <div className="showcase-aura" aria-hidden />

      <div className="showcase-sparkles" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`spark spark-${i}`} />
        ))}
      </div>

      <div className="phone-frame">
        <div className="phone-notch" />

        <div className="phone-screen">
          <div className="phone-header">
            <Logo size={20} showWordmark={false} />
            <span className="phone-title">Studio</span>
            <span className="phone-live"><span className="live-dot" /> live</span>
          </div>

          <div className="phone-section-label">topic</div>
          <div className="phone-input">
            <span className="phone-typed">{t('showcase_input_demo')}</span>
            <span className="phone-caret" />
          </div>

          <div className="phone-section-label" style={{ marginTop: 14 }}>script</div>
          <div className="phone-script">
            <div className="phone-line phone-line-hook">
              <span className="line-tag">hook</span>
              <span>{t('showcase_line_1')}</span>
            </div>
            <div className="phone-line phone-line-body">
              <span>{t('showcase_line_2')}</span>
            </div>
            <div className="phone-line phone-line-cta">
              <span className="line-tag" data-tag="cta">CTA</span>
              <span>{t('showcase_line_3')}</span>
            </div>
          </div>

          <div className="phone-score">
            <svg viewBox="0 0 100 56" width="100%" height="58">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#A8FF3C" />
                  <stop offset="50%"  stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#FF2D8B" />
                </linearGradient>
              </defs>
              <path d="M 8 50 A 42 42 0 0 1 92 50" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path className="gauge-fill" d="M 8 50 A 42 42 0 0 1 92 50" stroke="url(#gaugeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
            <div className="phone-score-num">94</div>
            <div className="phone-score-label">{t('showcase_score_label')}</div>
          </div>

          <div className="phone-section-label">crosspost</div>
          <div className="phone-platforms">
            <div className="phone-plat phone-plat-1" style={{ '--c': '#1DA1F2' }}>𝕏</div>
            <div className="phone-plat phone-plat-2" style={{ '--c': '#0077B5' }}>in</div>
            <div className="phone-plat phone-plat-3" style={{ '--c': '#FF0000' }}>▶</div>
            <div className="phone-plat phone-plat-4" style={{ '--c': '#C13584' }}>◈</div>
          </div>
        </div>
      </div>
    </div>
  )
}

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

/* ─── Landing Page ───────────────────────────────────────────────── */
export default function Landing() {
  const { t } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
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

      {/* ── Hero (split — text left, phone right) ──────────────────── */}
      <section className="hero-split">
        {/* Background ambient mesh */}
        <div className="hero-bg" aria-hidden>
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        {/* Left: text */}
        <div className="hero-text">
          <h1 className="hero-h1">
            {t('landing_h1_a')}{' '}
            <span className="hero-h1-grad">{t('landing_h1_b')}</span>
          </h1>
          <p className="hero-sub">{t('landing_sub')}</p>
          <div className="hero-ctas">
            <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 180 }}>
              {t('landing_cta_primary')}
            </Link>
          </div>
        </div>

        {/* Right: animated phone mockup */}
        <div className="hero-visual">
          <StudioShowcase t={t} />
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
        /* ════════════════════════════════════════════════════════
           HERO SPLIT LAYOUT — Instagram-login style
           ════════════════════════════════════════════════════════ */
        .hero-split {
          position: relative;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 40px 5% 60px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          min-height: calc(100vh - 60px);
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
        }
        .hero-orb {
          position: absolute; border-radius: 50%; filter: blur(60px);
        }
        .hero-orb-1 {
          top: 0; left: -10%; width: 500px; height: 400px;
          background: radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 65%);
        }
        .hero-orb-2 {
          bottom: 0; right: -10%; width: 500px; height: 400px;
          background: radial-gradient(ellipse, rgba(255,45,139,0.12) 0%, transparent 65%);
        }
        .hero-orb-3 {
          top: 30%; left: 40%; width: 400px; height: 300px;
          background: radial-gradient(ellipse, rgba(255,184,0,0.06) 0%, transparent 65%);
        }
        .hero-text {
          position: relative; z-index: 1;
          animation: fadeUp 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hero-h1 {
          font-family: var(--font-head);
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 4rem);
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text);
          margin: 0 0 20px;
        }
        .hero-h1-grad {
          background: linear-gradient(135deg, #00D4FF 0%, #FF2D8B 55%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          filter: drop-shadow(0 0 36px rgba(255,45,139,0.30));
        }
        .hero-sub {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 480px;
          margin: 0 0 30px;
        }
        .hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .hero-visual {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          animation: fadeUp 0.6s 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }

        @media (max-width: 880px) {
          .hero-split {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
            padding-top: 32px;
          }
          .hero-text { order: 1; }
          .hero-visual { order: 2; }
          .hero-sub { margin-left: auto; margin-right: auto; }
          .hero-ctas { justify-content: center; }
        }

        /* ════════════════════════════════════════════════════════
           STUDIO SHOWCASE — phone mockup
           ════════════════════════════════════════════════════════ */
        .studio-showcase {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1500px;
          width: 100%;
        }
        .showcase-aura {
          position: absolute;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: conic-gradient(from 0deg,
            rgba(0,212,255,0.16) 0%,
            rgba(255,45,139,0.16) 33%,
            rgba(255,184,0,0.14)  66%,
            rgba(168,85,247,0.16) 100%);
          filter: blur(60px);
          animation: showcaseSpin 24s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes showcaseSpin { to { transform: rotate(360deg); } }

        .showcase-sparkles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .showcase-sparkles .spark {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          opacity: 0;
          animation: sparkDrift 5s ease-in-out infinite;
        }
        .spark-0 { left: 12%; top: 80%; animation-delay: 0.0s; background: #00D4FF; }
        .spark-1 { left: 88%; top: 70%; animation-delay: 0.5s; background: #FF2D8B; }
        .spark-2 { left: 18%; top: 30%; animation-delay: 1.0s; background: #FFB800; }
        .spark-3 { left: 82%; top: 25%; animation-delay: 1.5s; background: #A8FF3C; }
        .spark-4 { left: 50%; top: 12%; animation-delay: 2.0s; background: #00D4FF; }
        .spark-5 { left: 25%; top: 60%; animation-delay: 2.5s; background: #FF2D8B; }
        .spark-6 { left: 75%; top: 55%; animation-delay: 3.0s; background: #FFB800; }
        .spark-7 { left: 8%;  top: 45%; animation-delay: 3.5s; background: #A855F7; }
        .spark-8 { left: 92%; top: 40%; animation-delay: 4.0s; background: #FF5F4C; }
        .spark-9 { left: 50%; top: 88%; animation-delay: 4.5s; background: #A8FF3C; }
        @keyframes sparkDrift {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          20%  { opacity: 1; transform: translateY(-10px) scale(1); }
          80%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-60px) scale(1.1); }
        }

        .phone-frame {
          position: relative;
          width: 280px;
          height: 560px;
          background: linear-gradient(160deg, #0E1230 0%, #050714 100%);
          border-radius: 38px;
          box-shadow:
            0 50px 100px rgba(0,0,0,0.55),
            0 0 70px rgba(0,212,255,0.18),
            0 0 35px rgba(255,45,139,0.14),
            inset 0 0 0 1.5px rgba(255,255,255,0.06);
          padding: 11px;
          z-index: 2;
          transform: rotateY(-7deg) rotateX(3deg);
          animation: phoneFloat 6s ease-in-out infinite;
        }
        @keyframes phoneFloat {
          0%, 100% { transform: rotateY(-7deg) rotateX(3deg) translateY(0); }
          50%       { transform: rotateY(-7deg) rotateX(3deg) translateY(-8px); }
        }
        .phone-notch {
          position: absolute;
          top: 14px; left: 50%;
          transform: translateX(-50%);
          width: 80px; height: 22px;
          background: #050714;
          border-radius: 12px;
          z-index: 5;
        }
        .phone-screen {
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #07091C 0%, #0B0F2E 60%, #07091C 100%);
          border-radius: 28px;
          padding: 44px 16px 16px;
          overflow: hidden;
          position: relative;
        }
        .phone-screen::after {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at top right, rgba(255,45,139,0.08), transparent 50%),
            radial-gradient(ellipse at bottom left, rgba(0,212,255,0.10), transparent 50%);
          pointer-events: none;
          border-radius: inherit;
        }

        .phone-header {
          display: flex; align-items: center; gap: 9px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 12px;
          position: relative; z-index: 2;
        }
        .phone-title {
          font-family: var(--font-creator);
          font-weight: 800;
          font-size: 0.85rem;
          color: white;
          letter-spacing: -0.02em;
          flex: 1;
        }
        .phone-live {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 7px;
          border-radius: 99;
          background: rgba(0,212,255,0.12);
          border: 1px solid rgba(0,212,255,0.25);
          color: #00D4FF;
          font-family: var(--font-mono);
          font-size: 0.55rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00D4FF;
          box-shadow: 0 0 8px #00D4FF;
          animation: livePulse 1.4s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .phone-section-label {
          font-family: var(--font-mono);
          font-size: 0.54rem;
          font-weight: 700;
          color: rgba(255,255,255,0.32);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 5px;
          position: relative; z-index: 2;
        }
        .phone-input {
          background: rgba(0,212,255,0.06);
          border: 1px solid rgba(0,212,255,0.22);
          border-radius: 9px;
          padding: 8px 10px;
          height: 32px;
          display: flex; align-items: center;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #00D4FF;
          position: relative; z-index: 2;
        }
        .phone-typed {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          animation: typeIn 1.4s steps(28, end) 0.5s forwards;
        }
        @keyframes typeIn { to { width: 100%; } }
        .phone-caret {
          display: inline-block;
          width: 1.5px; height: 12px;
          background: #00D4FF;
          margin-left: 2px;
          animation: caretBlink 0.7s steps(1) infinite;
        }
        @keyframes caretBlink { 50% { opacity: 0; } }

        .phone-script {
          display: flex; flex-direction: column; gap: 4px;
          margin-bottom: 14px;
          position: relative; z-index: 2;
        }
        .phone-line {
          background: rgba(255,255,255,0.04);
          border-radius: 7px;
          padding: 6px 9px;
          font-size: 0.65rem;
          line-height: 1.35;
          color: rgba(255,255,255,0.85);
          opacity: 0;
          transform: translateY(8px);
          animation: scriptLineIn 0.4s ease forwards;
          display: flex; gap: 5px; align-items: flex-start;
        }
        .phone-line-hook { animation-delay: 2.2s; border-left: 2px solid #00D4FF; }
        .phone-line-body { animation-delay: 2.5s; border-left: 2px solid #A855F7; }
        .phone-line-cta  { animation-delay: 2.8s; border-left: 2px solid #FF2D8B; }
        .line-tag {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 3px;
          background: rgba(0,212,255,0.18);
          color: #00D4FF;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .line-tag[data-tag="cta"] {
          background: rgba(255,45,139,0.18);
          color: #FF2D8B;
        }
        @keyframes scriptLineIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .phone-score {
          background: linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,45,139,0.06));
          border-radius: 12px;
          padding: 12px 12px 10px;
          margin-bottom: 12px;
          text-align: center;
          position: relative; z-index: 2;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .gauge-fill {
          stroke-dasharray: 132;
          stroke-dashoffset: 132;
          animation: gaugeFill 1.4s cubic-bezier(0.22, 1, 0.36, 1) 3.4s forwards;
          filter: drop-shadow(0 0 6px rgba(0,212,255,0.6));
        }
        @keyframes gaugeFill { to { stroke-dashoffset: 8; } }
        .phone-score-num {
          font-family: var(--font-creator);
          font-weight: 800;
          font-size: 1.95rem;
          line-height: 1;
          margin-top: -22px;
          background: linear-gradient(135deg, #00D4FF 0%, #FF2D8B 60%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          animation: scoreNumIn 0.5s ease 4.2s forwards;
        }
        @keyframes scoreNumIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .phone-score-label {
          font-size: 0.58rem;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 5px;
          opacity: 0;
          animation: fadeOnly 0.4s ease 4.4s forwards;
        }
        @keyframes fadeOnly { to { opacity: 1; } }

        .phone-platforms {
          display: flex; gap: 7px; justify-content: center;
          position: relative; z-index: 2;
        }
        .phone-plat {
          width: 44px; height: 44px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--c);
          font-weight: 800;
          font-size: 0.95rem;
          opacity: 0;
          transform: scale(0.6);
          animation: platPop 0.45s cubic-bezier(0.34, 1.6, 0.64, 1) forwards;
          position: relative;
        }
        .phone-plat::after {
          content: '✓';
          position: absolute;
          top: -4px; right: -4px;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #A8FF3C;
          color: #0B0F2E;
          font-size: 0.55rem;
          font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transform: scale(0);
          animation: checkPop 0.3s ease forwards;
          box-shadow: 0 0 8px rgba(168,255,60,0.5);
        }
        .phone-plat-1 { animation-delay: 5.0s; }
        .phone-plat-2 { animation-delay: 5.2s; }
        .phone-plat-3 { animation-delay: 5.4s; }
        .phone-plat-4 { animation-delay: 5.6s; }
        .phone-plat-1::after { animation-delay: 5.4s; }
        .phone-plat-2::after { animation-delay: 5.6s; }
        .phone-plat-3::after { animation-delay: 5.8s; }
        .phone-plat-4::after { animation-delay: 6.0s; }
        @keyframes platPop { to { opacity: 1; transform: scale(1); } }
        @keyframes checkPop { to { opacity: 1; transform: scale(1); } }

        @media (max-width: 880px) {
          .phone-frame {
            width: 260px; height: 520px;
            transform: none; animation: none;
          }
          .showcase-aura { width: 380px; height: 380px; }
        }
      `}</style>
    </div>
  )
}
