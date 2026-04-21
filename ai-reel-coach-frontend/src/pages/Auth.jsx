import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store'
import { useToast } from '../components/Toast'
import Logo from '../components/Logo'

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg width="20" height="14" viewBox="0 0 24 17" fill="white" aria-hidden="true">
    <path d="M23.495 2.205a3.02 3.02 0 0 0-2.122-2.136C19.548 0 12 0 12 0S4.452 0 2.627.069a3.02 3.02 0 0 0-2.122 2.136C0 4.04 0 8.667 0 8.667s0 4.627.505 6.462a3.02 3.02 0 0 0 2.122 2.136C4.452 17.334 12 17.334 12 17.334s7.548 0 9.373-.069a3.02 3.02 0 0 0 2.122-2.136C24 13.294 24 8.667 24 8.667s0-4.627-.505-6.462zM9.545 12.001V5.333l6.273 3.334-6.273 3.334z"/>
  </svg>
)

/* ─── Left Panel app mockup ──────────────────────────────────────── */
function AppMockup() {
  return (
    <div style={{
      background: 'rgba(11,15,46,0.9)',
      border: '1px solid rgba(0,200,255,0.12)',
      borderRadius: 16,
      padding: '18px',
      width: '100%',
      maxWidth: 320,
      boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,255,0.06)',
    }}>
      {/* Mock header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F5F' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginLeft: 4 }} />
      </div>
      {/* Mock title */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ height: 8, width: '60%', background: 'rgba(0,200,255,0.15)', borderRadius: 4, marginBottom: 6 }} />
        <div style={{ height: 6, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
      </div>
      {/* Hook score card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,200,255,0.12), rgba(123,92,240,0.08))',
        border: '1px solid rgba(0,200,255,0.2)',
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
      }}>
        <div style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1.8rem', lineHeight: 1, background: 'linear-gradient(135deg, #00E5FF, #7B5CF0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>94</div>
        <div>
          <div style={{ height: 6, width: 80, background: 'rgba(0,200,255,0.2)', borderRadius: 4, marginBottom: 4 }} />
          <div style={{ height: 5, width: 55, background: 'rgba(0,212,177,0.3)', borderRadius: 4 }} />
        </div>
      </div>
      {/* Script section mock */}
      <div style={{ background: 'rgba(16,21,56,0.8)', borderRadius: 8, padding: '10px 12px', marginBottom: 8, borderLeft: '3px solid #00C8FF' }}>
        <div style={{ height: 5, width: '45%', background: 'rgba(0,200,255,0.15)', borderRadius: 3, marginBottom: 6 }} />
        <div style={{ height: 5, width: '90%', background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 4 }} />
        <div style={{ height: 5, width: '75%', background: 'rgba(255,255,255,0.1)', borderRadius: 3 }} />
      </div>
      <div style={{ background: 'rgba(16,21,56,0.8)', borderRadius: 8, padding: '10px 12px', borderLeft: '3px solid #00D4B1' }}>
        <div style={{ height: 5, width: '40%', background: 'rgba(0,212,177,0.15)', borderRadius: 3, marginBottom: 6 }} />
        <div style={{ height: 5, width: '95%', background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 4 }} />
        <div style={{ height: 5, width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 4 }} />
        <div style={{ height: 5, width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: 3 }} />
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Auth() {
  const [mode, setMode]       = useState('login')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register }   = useAuth()
  const toast                 = useToast()
  const navigate              = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        toast('Welcome back!', 'success')
      } else {
        await register(email, password, name)
        toast('Account created!', 'success')
      }
      navigate('/dashboard')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialClick = (platform) => {
    const base = import.meta.env.VITE_API_URL || ''
    window.location.href = `${base}/api/auth/${platform}`
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* ── Left Brand Panel (desktop only) ──────────────────────── */}
      <div className="auth-left-panel">
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: -100, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, right: -60, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,92,240,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', pointerEvents: 'none', transform: 'translate(-50%, -50%)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Logo — same component as dashboard/landing */}
          <div style={{ marginBottom: 52 }}>
            <Logo size={40} showWordmark />
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'var(--font-head)', fontWeight: 900,
              fontSize: '2.2rem', lineHeight: 1.1, letterSpacing: '-0.04em',
              color: 'var(--text)', marginBottom: 14,
            }}>
              Make content that<br />
              <span style={{ background: 'linear-gradient(135deg, #00E5FF, #00C8FF 50%, #7B5CF0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                actually goes viral.
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              AI-powered scripts, hook scoring & performance insights — built for creators.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
            {[
              { icon: '✦', color: '#00C8FF', title: 'Script Generator', desc: 'Viral-ready scripts in 15 seconds' },
              { icon: '◎', color: '#7B5CF0', title: 'Hook Scorer',       desc: 'Know if your first 3 seconds will stop the scroll' },
              { icon: '◈', color: '#00D4B1', title: 'AI Coach',           desc: 'Personal strategy for your niche, 24/7' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: f.color + '18',
                  border: `1px solid ${f.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', flexShrink: 0, color: f.color,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: 1 }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* App mockup */}
          <div style={{ marginBottom: 'auto' }}>
            <AppMockup />
          </div>

          {/* Social proof footer */}
          <div style={{ borderTop: '1px solid rgba(0,200,255,0.1)', paddingTop: 20, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex' }}>
                {['T', 'P', 'R', 'S', 'A'].map((l, i) => (
                  <div key={i} style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: `hsl(${i * 42 + 190}, 65%, 58%)`,
                    border: '2px solid var(--bg)',
                    marginLeft: i > 0 ? -7 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 800, color: '#fff',
                    fontFamily: 'var(--font-head)',
                  }}>{l}</div>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--text)', fontWeight: 700 }}>10,000+</span> creators growing with ViralCoach
              </div>
            </div>
            <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
              Free to start · No credit card · Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ─────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        minHeight: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }} className="page-enter">

          {/* Mobile-only logo */}
          <div className="auth-mobile-logo">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <Logo size={36} showWordmark />
            </div>
          </div>

          {/* Auth card */}
          <div style={{
            background: 'rgba(11,15,46,0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(0,200,255,0.12)',
            borderRadius: 20,
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,200,255,0.04)',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-head)', fontWeight: 800,
              fontSize: '1.6rem', letterSpacing: '-0.03em',
              color: 'var(--text)', marginBottom: 4, lineHeight: 1.2,
            }}>
              {mode === 'login' ? 'Welcome back' : 'Get started free'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
              {mode === 'login' ? 'Sign in to your ViralCoach studio' : 'No credit card required'}
            </p>

            {/* Social buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
              {[
                { id: 'google',    label: 'Continue with Google',    icon: <GoogleIcon />,    bg: '#fff',              color: '#1f1f1f', border: '1px solid rgba(0,0,0,0.15)' },
                { id: 'instagram', label: 'Continue with Instagram',  icon: <InstagramIcon />, bg: 'linear-gradient(45deg, #405DE6, #833AB4, #C13584, #E1306C)', color: '#fff', border: 'none' },
                { id: 'youtube',   label: 'Continue with YouTube',    icon: <YouTubeIcon />,   bg: '#FF0000',           color: '#fff', border: 'none' },
              ].map(btn => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleSocialClick(btn.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', height: 44, padding: '0 16px',
                    borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                    fontWeight: 600, transition: 'opacity 0.15s, transform 0.15s',
                    background: btn.bg, color: btn.color, border: btn.border || 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>{btn.icon}</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Email form */}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'register' && (
                <div className="field">
                  <label>Name</label>
                  <input className="input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0 }}>Password</label>
                  {mode === 'login' && (
                    <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input className="input" type="password" placeholder={mode === 'register' ? 'Min 8 characters' : '••••••••'} value={password} onChange={e => setPass(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
                style={{ marginTop: 4, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.01em' }}
              >
                {loading
                  ? <><span className="spinner" /> Processing...</>
                  : mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 18 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-body)', padding: 0 }}
              >
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Feature chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
            {['✦ Script generation', '◎ Hook scoring', '◈ Performance analysis', '🎙 Voice input'].map(c => (
              <div key={c} style={{
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(0,200,255,0.04)',
                border: '1px solid rgba(0,200,255,0.1)',
                fontSize: '0.7rem', color: 'var(--text-faint)',
              }}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Responsive styles ────────────────────────────────────── */}
      <style>{`
        .auth-left-panel {
          flex: 0 0 460px;
          background: linear-gradient(160deg, #07091C 0%, #0B0F2E 60%, #07091C 100%);
          border-right: 1px solid rgba(0,200,255,0.08);
          padding: 40px 44px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .auth-mobile-logo { display: none; }
        @media (max-width: 900px) {
          .auth-left-panel { display: none !important; }
          .auth-mobile-logo { display: block !important; }
        }
      `}</style>
    </div>
  )
}
