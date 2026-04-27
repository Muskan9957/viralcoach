import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLang } from '../i18n.jsx'

/* ─── Feature meta (icons + colors only — text comes from i18n) ─── */
const FEATURE_META = [
  { icon: '✦',  accent: '#00D4FF', tk: 'landing_f1_t', dk: 'landing_f1_d' },
  { icon: '◎',  accent: '#FF2D8B', tk: 'landing_f2_t', dk: 'landing_f2_d' },
  { icon: '📊', accent: '#A8FF3C', tk: 'landing_f3_t', dk: 'landing_f3_d' },
  { icon: '🎨', accent: '#FFB800', tk: 'landing_f4_t', dk: 'landing_f4_d' },
  { icon: '⇄',  accent: '#FF5F4C', tk: 'landing_f5_t', dk: 'landing_f5_d' },
  { icon: '🤖', accent: '#A855F7', tk: 'landing_f6_t', dk: 'landing_f6_d' },
]

/* ─── Studio Showcase — animated phone mockup ───────────────────── */
function StudioShowcase({ t }) {
  return (
    <div className="studio-showcase">
      {/* Behind-aura: rotating multi-color glow */}
      <div className="showcase-aura" aria-hidden />

      {/* Drifting sparkle particles */}
      <div className="showcase-sparkles" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={`spark spark-${i}`} />
        ))}
      </div>

      {/* Phone frame */}
      <div className="phone-frame">
        {/* Notch */}
        <div className="phone-notch" />

        <div className="phone-screen">
          {/* Header */}
          <div className="phone-header">
            <Logo size={22} showWordmark={false} />
            <span className="phone-title">Studio</span>
            <span className="phone-live">
              <span className="live-dot" /> live
            </span>
          </div>

          {/* Topic input — typing */}
          <div className="phone-section-label">topic</div>
          <div className="phone-input">
            <span className="phone-typed">{t('showcase_input_demo')}</span>
            <span className="phone-caret" />
          </div>

          {/* Script lines — appear one by one */}
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

          {/* Hook score gauge */}
          <div className="phone-score">
            <svg viewBox="0 0 100 56" width="100%" height="62">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#A8FF3C" />
                  <stop offset="50%"  stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#FF2D8B" />
                </linearGradient>
              </defs>
              {/* Track */}
              <path d="M 8 50 A 42 42 0 0 1 92 50" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" strokeLinecap="round" />
              {/* Fill */}
              <path className="gauge-fill" d="M 8 50 A 42 42 0 0 1 92 50" stroke="url(#gaugeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
            <div className="phone-score-num">94</div>
            <div className="phone-score-label">{t('showcase_score_label')}</div>
            <div className="phone-score-grade">{t('showcase_score_grade')}</div>
          </div>

          {/* Crosspost — platform icons popping in */}
          <div className="phone-section-label">crosspost</div>
          <div className="phone-platforms">
            <div className="phone-plat phone-plat-1" style={{ '--c': '#1DA1F2' }}>𝕏</div>
            <div className="phone-plat phone-plat-2" style={{ '--c': '#0077B5' }}>in</div>
            <div className="phone-plat phone-plat-3" style={{ '--c': '#FF0000' }}>▶</div>
            <div className="phone-plat phone-plat-4" style={{ '--c': '#C13584' }}>◈</div>
          </div>
        </div>
      </div>

      {/* Step labels — orbit around the phone */}
      <div className="showcase-step showcase-step-1"><span>1</span> {t('showcase_step_1')}</div>
      <div className="showcase-step showcase-step-2"><span>2</span> {t('showcase_step_2')}</div>
      <div className="showcase-step showcase-step-3"><span>3</span> {t('showcase_step_3')}</div>
      <div className="showcase-step showcase-step-4"><span>4</span> {t('showcase_step_4')}</div>
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
      borderRadius: 99, padding: 3, gap: 0,
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


/* ─── Feature Card ───────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, accent }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = accent + '55'
        e.currentTarget.style.boxShadow = `0 20px 60px ${accent}18, 0 0 0 1px ${accent}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}BB, transparent)`,
      }} />
      {/* icon chip */}
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: accent + '16',
        border: `1px solid ${accent}2E`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.35rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem',
          color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6,
        }}>
          {title}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

/* ─── Landing Page ───────────────────────────────────────────────── */
export default function Landing() {
  const { t } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 5%',
        background: 'rgba(7,9,28,0.92)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Logo size={44} showWordmark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LangFlip />
          <Link
            to="/auth"
            className="landing-signin"
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

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section style={{
        minHeight: 'calc(100vh - 57px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 5%',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* ── Colorful ambient mesh ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10%',  left: '15%',  width: 640, height: 520, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,212,255,0.11) 0%, transparent 65%)',  filter: 'blur(48px)' }} />
          <div style={{ position: 'absolute', top: '30%',  right: '10%', width: 520, height: 420, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,45,139,0.11) 0%, transparent 65%)', filter: 'blur(48px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '25%', width: 460, height: 360, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(168,255,60,0.07) 0%, transparent 65%)',  filter: 'blur(48px)' }} />
          <div style={{ position: 'absolute', bottom: '30%', right: '25%',width: 380, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.09) 0%, transparent 65%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '5%',   right: '5%',  width: 300, height: 240, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,184,0,0.08) 0%, transparent 65%)',  filter: 'blur(36px)' }} />
        </div>

        {/* ── H1 ── */}
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05,
          color: 'var(--text)', marginBottom: 24, maxWidth: 780,
          position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {t('landing_h1_a')}{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #FF2D8B 55%, #FFB800 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'inline-block',
            filter: 'drop-shadow(0 0 40px rgba(255,45,139,0.35))',
          }}>
            {t('landing_h1_b')}
          </span>
        </h1>

        {/* ── Sub ── */}
        <p style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'var(--text-muted)',
          lineHeight: 1.65, maxWidth: 560, marginBottom: 44,
          position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.16s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {t('landing_sub')}
        </p>

        {/* ── CTA buttons ── */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.22s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 195 }}>
            {t('landing_cta_primary')}
          </Link>
          <a href="#features" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
            {t('landing_cta_secondary')}
          </a>
        </div>
      </section>


      {/* ── Studio Showcase ──────────────────────────────────────────── */}
      <section style={{ padding: '60px 5% 80px', maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #00D4FF, #FF2D8B)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 14,
          }}>
            {t('showcase_eyebrow')}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.15,
            maxWidth: 580, margin: '0 auto',
          }}>
            {t('showcase_title_a')}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #FF2D8B 60%, #FFB800 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {t('showcase_title_b')}
            </span>
          </h2>
        </div>
        <StudioShowcase t={t} />
      </section>


      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 5%', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #00D4FF, #FF2D8B)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 14,
          }}>
            {t('landing_features_eyebrow')}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.15,
            maxWidth: 580, margin: '0 auto',
          }}>
            {t('landing_features_h2_a')}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #FF2D8B 60%, #FFB800 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {t('landing_features_h2_b')}
            </span>
          </h2>
        </div>

        <div className="landing-features-grid">
          {FEATURE_META.map(f => (
            <FeatureCard
              key={f.tk}
              icon={f.icon}
              accent={f.accent}
              title={t(f.tk)}
              desc={t(f.dk)}
            />
          ))}
        </div>
      </section>


      {/* ── CTA section ──────────────────────────────────────────────── */}
      <section style={{ padding: '100px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 700, height: 480, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,45,139,0.12) 0%, rgba(0,212,255,0.07) 50%, transparent 70%)',
            filter: 'blur(48px)',
          }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,184,0,0.09)', border: '1px solid rgba(255,184,0,0.28)',
            borderRadius: 99, padding: '5px 14px', marginBottom: 20,
            fontSize: '0.75rem', fontWeight: 600, color: '#FFB800',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {t('landing_cta_eyebrow')}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'var(--text)', lineHeight: 1.1, marginBottom: 20,
          }}>
            {t('landing_cta_h2')}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 36 }}>
            {t('landing_cta_sub')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', display: 'inline-flex', minWidth: 215 }}>
              {t('landing_cta_btn')}
            </Link>
          </div>
          <div style={{ marginTop: 18, fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            {t('landing_cta_fine')}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, background: 'var(--surface)',
      }}>
        <Logo size={40} showWordmark />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
          {t('landing_footer_legal')}
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/privacy" style={{ fontSize: '0.78rem', color: 'var(--text-faint)', textDecoration: 'none' }}>{t('landing_privacy')}</Link>
          <Link to="/terms"   style={{ fontSize: '0.78rem', color: 'var(--text-faint)', textDecoration: 'none' }}>{t('landing_terms')}</Link>
        </div>
      </footer>

      {/* ── Styles ───────────────────────────────────────────────────── */}
      <style>{`
        .landing-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .landing-features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .landing-features-grid { grid-template-columns: 1fr; }
        }

        /* Hide floating badges below 1300px so they never overlap hero text */
        @media (max-width: 1300px) {
          .hero-float { display: none !important; }
        }

        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }

        /* ════════════════════════════════════════════════════════════
           STUDIO SHOWCASE — animated phone mockup
           ════════════════════════════════════════════════════════════ */

        .studio-showcase {
          position: relative;
          width: 100%;
          min-height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1800px;
        }

        /* Rotating multi-color aura behind phone */
        .showcase-aura {
          position: absolute;
          width: min(680px, 90vw);
          height: 680px;
          border-radius: 50%;
          background:
            conic-gradient(from 0deg,
              rgba(0,212,255,0.18) 0%,
              rgba(255,45,139,0.18) 33%,
              rgba(255,184,0,0.16)  66%,
              rgba(168,85,247,0.18) 100%);
          filter: blur(70px);
          animation: showcaseSpin 24s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes showcaseSpin {
          to { transform: rotate(360deg); }
        }

        /* Drifting sparkles */
        .showcase-sparkles {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
        }
        .showcase-sparkles .spark {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: white;
          opacity: 0;
          animation: sparkDrift 5s ease-in-out infinite;
        }
        .spark-0  { left: 12%; top: 80%; animation-delay: 0.0s;  background: #00D4FF; }
        .spark-1  { left: 88%; top: 70%; animation-delay: 0.4s;  background: #FF2D8B; }
        .spark-2  { left: 18%; top: 30%; animation-delay: 0.8s;  background: #FFB800; }
        .spark-3  { left: 82%; top: 25%; animation-delay: 1.2s;  background: #A8FF3C; }
        .spark-4  { left: 50%; top: 12%; animation-delay: 1.6s;  background: #00D4FF; }
        .spark-5  { left: 25%; top: 60%; animation-delay: 2.0s;  background: #FF2D8B; }
        .spark-6  { left: 75%; top: 55%; animation-delay: 2.4s;  background: #FFB800; }
        .spark-7  { left: 8%;  top: 45%; animation-delay: 2.8s;  background: #A855F7; }
        .spark-8  { left: 92%; top: 40%; animation-delay: 3.2s;  background: #FF5F4C; }
        .spark-9  { left: 35%; top: 88%; animation-delay: 3.6s;  background: #A8FF3C; }
        .spark-10 { left: 65%; top: 90%; animation-delay: 4.0s;  background: #00D4FF; }
        .spark-11 { left: 5%;  top: 15%; animation-delay: 4.4s;  background: #FF2D8B; }
        .spark-12 { left: 95%; top: 10%; animation-delay: 4.8s;  background: #FFB800; }
        .spark-13 { left: 45%; top: 95%; animation-delay: 1.8s;  background: #A855F7; }
        @keyframes sparkDrift {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          20%  { opacity: 1; transform: translateY(-10px) scale(1); }
          80%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-60px) scale(1.1); }
        }

        /* Phone frame */
        .phone-frame {
          position: relative;
          width: 320px;
          height: 640px;
          background: linear-gradient(160deg, #0E1230 0%, #050714 100%);
          border-radius: 42px;
          box-shadow:
            0 60px 120px rgba(0,0,0,0.6),
            0 0 80px rgba(0,212,255,0.18),
            0 0 40px rgba(255,45,139,0.14),
            inset 0 0 0 1.5px rgba(255,255,255,0.06),
            inset 0 0 24px rgba(0,212,255,0.04);
          padding: 12px;
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
          top: 16px; left: 50%;
          transform: translateX(-50%);
          width: 92px; height: 24px;
          background: #050714;
          border-radius: 14px;
          z-index: 5;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
        }

        .phone-screen {
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #07091C 0%, #0B0F2E 60%, #07091C 100%);
          border-radius: 32px;
          padding: 48px 18px 18px;
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

        /* Header */
        .phone-header {
          display: flex; align-items: center; gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 14px;
          position: relative; z-index: 2;
        }
        .phone-title {
          font-family: var(--font-creator);
          font-weight: 800;
          font-size: 0.95rem;
          color: white;
          letter-spacing: -0.02em;
          flex: 1;
        }
        .phone-live {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 2px 8px;
          border-radius: 99;
          background: rgba(0,212,255,0.12);
          border: 1px solid rgba(0,212,255,0.25);
          color: #00D4FF;
          font-family: var(--font-mono);
          font-size: 0.6rem; font-weight: 700;
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

        /* Section labels */
        .phone-section-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          font-weight: 700;
          color: rgba(255,255,255,0.32);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 6px;
          position: relative; z-index: 2;
        }

        /* Topic input — typing animation */
        .phone-input {
          background: rgba(0,212,255,0.06);
          border: 1px solid rgba(0,212,255,0.22);
          border-radius: 10px;
          padding: 9px 12px;
          height: 36px;
          display: flex; align-items: center;
          font-family: var(--font-mono);
          font-size: 0.78rem;
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
        @keyframes typeIn {
          to { width: 100%; }
        }
        .phone-caret {
          display: inline-block;
          width: 1.5px; height: 14px;
          background: #00D4FF;
          margin-left: 2px;
          animation: caretBlink 0.7s steps(1) infinite;
        }
        @keyframes caretBlink {
          50% { opacity: 0; }
        }

        /* Script lines — appear sequentially after typing */
        .phone-script {
          display: flex; flex-direction: column; gap: 5px;
          margin-bottom: 16px;
          position: relative; z-index: 2;
        }
        .phone-line {
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 0.7rem;
          line-height: 1.35;
          color: rgba(255,255,255,0.85);
          opacity: 0;
          transform: translateY(8px);
          animation: scriptLineIn 0.4s ease forwards;
          display: flex; gap: 6px; align-items: flex-start;
        }
        .phone-line-hook { animation-delay: 2.2s; border-left: 2px solid #00D4FF; }
        .phone-line-body { animation-delay: 2.5s; border-left: 2px solid #A855F7; }
        .phone-line-cta  { animation-delay: 2.8s; border-left: 2px solid #FF2D8B; }
        .line-tag {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
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

        /* Hook score gauge */
        .phone-score {
          background: linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,45,139,0.06));
          border-radius: 14px;
          padding: 14px 14px 12px;
          margin-bottom: 14px;
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
        @keyframes gaugeFill {
          to { stroke-dashoffset: 8; }
        }
        .phone-score-num {
          font-family: var(--font-creator);
          font-weight: 800;
          font-size: 2.2rem;
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
          font-size: 0.62rem;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 6px;
          opacity: 0;
          animation: fadeOnly 0.4s ease 4.4s forwards;
        }
        .phone-score-grade {
          font-size: 0.62rem;
          color: #A8FF3C;
          font-family: var(--font-mono);
          font-weight: 700;
          margin-top: 2px;
          opacity: 0;
          animation: fadeOnly 0.4s ease 4.6s forwards;
        }
        @keyframes fadeOnly { to { opacity: 1; } }

        /* Crosspost — platform icons popping in */
        .phone-platforms {
          display: flex; gap: 8px; justify-content: center;
          position: relative; z-index: 2;
        }
        .phone-plat {
          width: 50px; height: 50px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--c);
          font-weight: 800;
          font-size: 1.05rem;
          opacity: 0;
          transform: scale(0.6);
          animation: platPop 0.45s cubic-bezier(0.34, 1.6, 0.64, 1) forwards;
          position: relative;
        }
        .phone-plat::after {
          content: '✓';
          position: absolute;
          top: -4px; right: -4px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #A8FF3C;
          color: #0B0F2E;
          font-size: 0.62rem;
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
        @keyframes platPop {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes checkPop {
          to { opacity: 1; transform: scale(1); }
        }

        /* Step labels orbiting the phone */
        .showcase-step {
          position: absolute;
          display: flex; align-items: center; gap: 9px;
          padding: 9px 16px;
          border-radius: 99px;
          background: rgba(8, 11, 36, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text);
          z-index: 3;
          opacity: 0;
          animation: stepIn 0.5s ease forwards;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .showcase-step span {
          width: 22px; height: 22px;
          border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 800;
          color: white;
        }
        .showcase-step-1 { top: 8%;  left: 10%; animation-delay: 0.6s; }
        .showcase-step-1 span { background: linear-gradient(135deg, #00D4FF, #0099CC); }
        .showcase-step-2 { top: 26%; right: 6%; animation-delay: 2.6s; }
        .showcase-step-2 span { background: linear-gradient(135deg, #A855F7, #7B40D0); }
        .showcase-step-3 { bottom: 30%; left: 8%; animation-delay: 3.6s; }
        .showcase-step-3 span { background: linear-gradient(135deg, #FF2D8B, #C41873); }
        .showcase-step-4 { bottom: 10%; right: 8%; animation-delay: 5.0s; }
        .showcase-step-4 span { background: linear-gradient(135deg, #FFB800, #FF8A00); }
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 980px) {
          .showcase-step { font-size: 0.74rem; padding: 7px 12px; }
          .showcase-step span { width: 19px; height: 19px; font-size: 0.62rem; }
        }
        @media (max-width: 720px) {
          .studio-showcase { min-height: 760px; flex-direction: column; gap: 24px; }
          .showcase-step { position: static; animation-delay: 0.5s !important; }
          .showcase-step-1, .showcase-step-2, .showcase-step-3, .showcase-step-4 {
            position: static;
          }
          .phone-frame { transform: none; animation: none; }
          .showcase-aura { width: 480px; height: 480px; }
        }
      `}</style>
    </div>
  )
}
