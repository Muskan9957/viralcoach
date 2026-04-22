import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

/* ─── Data ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '✦',
    title: 'Script Generator',
    desc: 'Viral-ready scripts in 15 seconds. Hindi, Hinglish, or English — just describe your idea.',
    accent: '#00C8FF',
  },
  {
    icon: '◎',
    title: 'Hook Scorer',
    desc: 'Know if your hook stops the scroll before you post. AI scores your first 3 seconds.',
    accent: '#7B5CF0',
  },
  {
    icon: '📊',
    title: 'Performance Coach',
    desc: 'Turn your video numbers into actionable insights. Know exactly what to do next.',
    accent: '#00C9A7',
  },
  {
    icon: '🎨',
    title: 'Caption Generator',
    desc: '4 caption styles + 25 trending hashtags, instantly. Stand out in every feed.',
    accent: '#7B61FF',
  },
  {
    icon: '🔁',
    title: 'Content Remix',
    desc: 'One script, every platform. Repurpose from Instagram to YouTube Shorts in seconds.',
    accent: '#FFD60A',
  },
  {
    icon: '🤖',
    title: 'AI Coach',
    desc: 'Your personal content strategist, available 24/7. Ask anything about growth.',
    accent: '#00C8FF',
  },
]


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
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = accent + '55'
        e.currentTarget.style.boxShadow = `0 16px 48px ${accent}1A`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}00, ${accent}CC, ${accent}00)`, borderRadius: '20px 20px 0 0' }} />
      <div style={{ width: 44, height: 44, borderRadius: 12, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, border: `1px solid ${accent}25` }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>
    </div>
  )
}


/* ─── Floating UI element ────────────────────────────────────────── */
function FloatingCard({ style, className = '', children }) {
  return (
    <div className={`hero-float ${className}`.trim()} style={{
      background: 'rgba(11,15,46,0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14,
      padding: '12px 16px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,255,0.08)',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─── Landing Page ───────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 5%',
        background: 'rgba(7,9,28,0.9)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Logo size={44} showWordmark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle size="sm" />
          <Link
            to="/auth"
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem',
              color: 'var(--text-muted)', textDecoration: 'none',
              padding: '8px 16px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.background = 'var(--surface2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
          >
            Sign In
          </Link>
          <Link to="/auth" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            Get Started →
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section style={{
        minHeight: 'calc(100vh - 57px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 5% 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Extra hero glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,200,255,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', right: '10%', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(123,92,240,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Floating cards — decorative, only shown on wide screens via .hero-float CSS class */}

        {/* Hook Score — left side, level with "Script." */}
        <FloatingCard style={{
          position: 'absolute', top: '28%', left: 'calc(50% - 460px)',
          animation: 'floatCardA 6s ease-in-out infinite',
          display: 'flex', alignItems: 'center', gap: 12,
          zIndex: 1,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00C8FF, #7B5CF0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', flexShrink: 0,
            boxShadow: '0 0 12px rgba(0,200,255,0.4)',
          }}>✦</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Hook Score: 94</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--teal)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>Grade A — Excellent</div>
          </div>
        </FloatingCard>

        {/* Streak — just left of the "Start for Free" button */}
        <FloatingCard style={{
          position: 'absolute', top: '62%', left: 'calc(50% - 420px)',
          animation: 'floatCardB 7s ease-in-out infinite',
          zIndex: 1, minWidth: 110,
        }}>
          <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Streak</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1, color: '#00C8FF' }}>12</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>days 🔥</span>
          </div>
        </FloatingCard>

        {/* Script generated — right side, level with "Go Viral." */}
        <FloatingCard style={{
          position: 'absolute', top: '32%', right: 'calc(50% - 420px)',
          animation: 'floatCardC 5.5s ease-in-out infinite',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(0,200,255,0.18), rgba(123,92,240,0.18))',
              border: '1px solid rgba(0,200,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem',
              boxShadow: '0 0 10px rgba(0,200,255,0.15)',
            }}>✦</div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', marginBottom: 2 }}>Script generated</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>Hinglish · 12s · fitness</div>
            </div>
          </div>
        </FloatingCard>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05,
          color: 'var(--text)', marginBottom: 24, maxWidth: 760,
          position: 'relative', zIndex: 3,
          padding: '0 8px',
          animation: 'fadeUp 0.5s 0.08s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          Script. Score.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00E5FF 0%, #00C8FF 45%, #7B5CF0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'inline-block',
            filter: 'drop-shadow(0 0 32px rgba(0,200,255,0.25))',
          }}>
            Go Viral.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'var(--text-muted)',
          lineHeight: 1.65, maxWidth: 560, marginBottom: 44,
          position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.14s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          AI-powered content studio for creators. Generate viral scripts in seconds, score your hooks, and grow with data.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: 40, position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', minWidth: 190 }}>
            Start for Free →
          </Link>
          <a href="#features" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
            See how it works ↓
          </a>
        </div>

        {/* Feature pills */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
          position: 'relative', zIndex: 3,
          animation: 'fadeUp 0.5s 0.26s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {['✦ Hindi + Hinglish scripts', '◎ Hook scoring', '🎙 Voice input', '🤖 AI Coach 24/7'].map(pill => (
            <div key={pill} style={{
              padding: '6px 14px', borderRadius: 99,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)',
            }}>
              {pill}
            </div>
          ))}
        </div>
      </section>


      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 5%', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            Everything you need
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.15,
            maxWidth: 580, margin: '0 auto',
          }}>
            Your full content toolkit,{' '}
            <span style={{ background: 'linear-gradient(135deg, #00C8FF, #7B5CF0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              powered by AI
            </span>
          </h2>
        </div>

        <div className="landing-features-grid">
          {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>


      {/* ── CTA section ──────────────────────────────────────────────── */}
      <section style={{ padding: '100px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,200,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>
            Start today — it's free
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'var(--text)', lineHeight: 1.1, marginBottom: 20,
          }}>
            Ready to grow faster?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 36 }}>
            Generate viral scripts, score your hooks, and grow with data — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', display: 'inline-flex', minWidth: 210 }}>
              Start Free Today →
            </Link>
          </div>
          <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            No credit card · Cancel anytime · Free to start
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
          © Anahat Aura LLP · ViralCoach
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/privacy" style={{ fontSize: '0.78rem', color: 'var(--text-faint)', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms"   style={{ fontSize: '0.78rem', color: 'var(--text-faint)', textDecoration: 'none' }}>Terms</Link>
        </div>
      </footer>

      {/* ── Responsive + Animation styles ────────────────────────────── */}
      <style>{`
        .landing-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .landing-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .landing-features-grid { grid-template-columns: repeat(2, 1fr); }
          .landing-testimonials-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .landing-features-grid { grid-template-columns: 1fr; }
        }
        @keyframes floatCardA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatCardB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatCardC {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 900px) {
          .landing-float-card { display: none !important; }
        }
      `}</style>
    </div>
  )
}
