import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
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
          <ThemeToggle size="sm" />
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

        {/* ── Badge ── */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,45,139,0.09)',
          border: '1px solid rgba(255,45,139,0.28)',
          borderRadius: 99, padding: '6px 16px', marginBottom: 26,
          position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.04s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FF6EB4', fontFamily: 'var(--font-body)', letterSpacing: '0.01em' }}>
            {t('landing_pill')}
          </span>
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
      `}</style>
    </div>
  )
}
