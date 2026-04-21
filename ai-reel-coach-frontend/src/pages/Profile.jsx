import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/Toast'
import { api } from '../api'

const AVATAR_STYLES = [
  { id: 'cyberpunk',  label: 'Cyberpunk',  emoji: '🤖', color: '#00C8FF' },
  { id: 'anime',      label: 'Anime',      emoji: '✨', color: '#FF6EE7' },
  { id: 'fantasy',    label: 'Fantasy',    emoji: '🧙', color: '#9B72FF' },
  { id: 'neon',       label: 'Neon',       emoji: '⚡', color: '#00FF88' },
  { id: 'minimal',    label: 'Minimal',    emoji: '◈',  color: '#A8C4E8' },
  { id: 'cosmic',     label: 'Cosmic',     emoji: '🌌', color: '#7B5CF0' },
  { id: 'pixel',      label: 'Pixel Art',  emoji: '🕹️', color: '#FFD60A' },
  { id: 'watercolor', label: 'Watercolor', emoji: '🎨', color: '#FF9F7F' },
]

const PLAN_META = {
  FREE:    { label: 'Free',    color: '#6B6B90', bg: 'rgba(107,107,144,0.12)', limit: 10  },
  STARTER: { label: 'Starter', color: '#00D4B1', bg: 'rgba(0,212,177,0.12)',   limit: 50  },
  PRO:     { label: 'Pro',     color: '#00C8FF', bg: 'rgba(0,200,255,0.12)',   limit: 999 },
}

function Avatar({ user, size = 80 }) {
  const initials = (user?.name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return user?.avatar ? (
    <img src={user.avatar} alt={user.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
  ) : (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF5F1F, #FF3CAC)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-head)',
      fontWeight: 800,
      fontSize: size * 0.34,
      color: '#fff',
      letterSpacing: '-0.02em',
      flexShrink: 0,
      boxShadow: '0 4px 16px rgba(255,60,172,0.3)',
    }}>
      {initials}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-faint)',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: '1px solid var(--border)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Row({ icon, label, value, action }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 36, height: 36,
        background: 'var(--surface2)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

export default function Profile() {
  const { user, logout }   = useAuth()
  const { theme, toggle }  = useTheme()
  const navigate           = useNavigate()
  const toast              = useToast()
  const [showDanger, setShowDanger]       = useState(false)
  const [showAvatarGen, setShowAvatarGen] = useState(false)
  const [avatarStyle, setAvatarStyle]     = useState('cyberpunk')
  const [genLoading, setGenLoading]       = useState(false)
  const [previewUrl, setPreviewUrl]       = useState(null)

  const prefs    = (() => { try { return JSON.parse(localStorage.getItem('vs_prefs') || '{}') } catch { return {} } })()
  const planMeta = PLAN_META[user?.plan] || PLAN_META.FREE
  const usagePercent = Math.min(100, Math.round((user?.generationsUsed / planMeta.limit) * 100))
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const handleGenerateAvatar = async () => {
    setGenLoading(true)
    setPreviewUrl(null)
    try {
      const data = await api.generateAvatar(avatarStyle)
      setPreviewUrl(data.url)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setGenLoading(false)
    }
  }

  const handleSaveAvatar = async () => {
    if (!previewUrl) return
    try {
      await api.saveAvatar(previewUrl)
      toast('Avatar updated!', 'success')
      setShowAvatarGen(false)
      setPreviewUrl(null)
      window.location.reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <div className="page-enter" style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 40px' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,95,31,0.08), rgba(255,60,172,0.06))',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '36px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* bg decoration */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 180, height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,60,172,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Avatar user={user} size={80} />
          </div>
          <button
            onClick={() => setShowAvatarGen(true)}
            style={{
              background: 'linear-gradient(135deg, #00C8FF, #7B5CF0)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              padding: '6px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
            }}
          >
            ✦ AI Avatar
          </button>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <h1 style={{
              fontFamily: 'var(--font-head)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
            }}>
              {user?.name || 'Creator'}
            </h1>
            <span style={{
              background: planMeta.bg,
              color: planMeta.color,
              fontSize: '0.68rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: 99,
            }}>
              {planMeta.label}
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 12 }}>{user?.email}</div>

          {/* Usage bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Monthly scripts</span>
              <span style={{ fontSize: '0.75rem', color: usagePercent >= 80 ? '#ff6b6b' : 'var(--text-muted)', fontWeight: 600 }}>
                {user?.generationsUsed} / {planMeta.limit === 999 ? '∞' : planMeta.limit}
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${usagePercent}%`,
                background: usagePercent >= 80
                  ? 'linear-gradient(90deg, #FF9933, #ff4444)'
                  : 'linear-gradient(90deg, #00C8FF, #7B5CF0)',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Day Streak',    value: `${user?.streak || 0}🔥`,    sub: 'Keep posting daily' },
          { label: 'Scripts Made',  value: user?.generationsUsed || 0,   sub: 'Total all time' },
          { label: 'Member Since',  value: joinDate.split(' ')[2] || '2025', sub: joinDate.split(' ').slice(0,2).join(' ') },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-head)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              marginBottom: 2,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Account info */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 24px', marginBottom: 16 }}>
        <Section title="Account">
          <Row icon="👤" label="Full name"    value={user?.name || 'Not set'} />
          <Row icon="📧" label="Email"        value={user?.email || '—'} />
          <Row icon="🌐" label="Language"     value={user?.language === 'hi' ? 'Hindi' : user?.language === 'en-IN' ? 'Hinglish' : 'English'} />
          <Row
            icon="🎯"
            label="Niche"
            value={prefs.niche ? prefs.niche.charAt(0).toUpperCase() + prefs.niche.slice(1) : 'Not set'}
            action={
              <button
                onClick={() => { localStorage.removeItem('vs_onboarded'); navigate('/onboarding') }}
                style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}
              >
                Edit
              </button>
            }
          />
          <Row icon="📅" label="Joined"       value={joinDate} />
        </Section>
      </div>

      {/* Plan */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 24px', marginBottom: 16 }}>
        <Section title="Plan & Billing">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #00C8FF, #7B5CF0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>
                ✦
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>
                  {planMeta.label} Plan
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {planMeta.limit === 999 ? 'Unlimited scripts' : `${planMeta.limit} scripts / month`}
                </div>
              </div>
            </div>
            {user?.plan === 'FREE' && (
              <button
                onClick={() => navigate('/pricing')}
                className="btn btn-primary btn-sm"
              >
                Upgrade ↗
              </button>
            )}
          </div>
          {user?.plan === 'FREE' && (
            <div style={{
              padding: '14px 0',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.1rem' }}>💎</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem', marginBottom: 2 }}>
                  Unlock unlimited scripts
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Go Pro for ₹799/month — unlimited AI scripts, all features, priority support.
                </div>
              </div>
            </div>
          )}
        </Section>
      </div>

      {/* Preferences */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 24px', marginBottom: 16 }}>
        <Section title="Preferences">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, background: 'var(--surface2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>Appearance</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</div>
              </div>
            </div>
            <button onClick={toggle} style={styles.toggle(theme)}>
              <div style={styles.toggleKnob(theme)} />
            </button>
          </div>
        </Section>
      </div>

      {/* Danger zone */}
      <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,70,70,0.15)', borderRadius: 20, padding: '8px 24px' }}>
        <Section title="⚠ Danger Zone">
          {!showDanger ? (
            <button
              onClick={() => setShowDanger(true)}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, marginTop: 4,
                background: 'transparent',
                border: '1px solid rgba(255,70,70,0.3)',
                color: '#ff6b6b',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              🚪 Sign out of Viral Studio
            </button>
          ) : (
            <div style={{ padding: '12px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>
                Are you sure you want to sign out?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowDanger(false)} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleLogout} style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  background: 'rgba(255,70,70,0.15)',
                  border: '1px solid rgba(255,70,70,0.3)',
                  color: '#ff6b6b',
                  fontSize: '0.875rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>
                  Yes, sign out
                </button>
              </div>
            </div>
          )}
        </Section>
      </div>

      {/* AI Avatar Generator Modal */}
      {showAvatarGen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(4,5,18,0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }} onClick={e => { if (e.target === e.currentTarget) setShowAvatarGen(false) }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-bright)',
            borderRadius: 24,
            padding: '32px 28px',
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  ✦ AI Avatar Generator
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>
                  Pick a style and generate your unique avatar
                </p>
              </div>
              <button onClick={() => setShowAvatarGen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: 4 }}>✕</button>
            </div>

            {/* Style picker */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {AVATAR_STYLES.map(s => (
                <button key={s.id} onClick={() => setAvatarStyle(s.id)} style={{
                  padding: '10px 6px',
                  borderRadius: 12,
                  border: avatarStyle === s.id ? `2px solid ${s.color}` : '1px solid var(--border)',
                  background: avatarStyle === s.id ? `rgba(${s.color === '#00C8FF' ? '0,200,255' : s.color === '#FF6EE7' ? '255,110,231' : '123,92,240'},0.12)` : 'var(--surface2)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{s.emoji}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: avatarStyle === s.id ? s.color : 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div style={{
              height: 200,
              borderRadius: 16,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              overflow: 'hidden',
              position: 'relative',
            }}>
              {genLoading ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '3px solid var(--border)',
                    borderTopColor: 'var(--accent)',
                    animation: 'spin 0.7s linear infinite',
                    margin: '0 auto 12px',
                  }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Generating your avatar…</p>
                </div>
              ) : previewUrl ? (
                <img src={previewUrl} alt="Generated avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-faint)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>✦</div>
                  <p style={{ fontSize: '0.82rem' }}>Your avatar will appear here</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleGenerateAvatar} disabled={genLoading} className="btn btn-primary" style={{ flex: 1 }}>
                {genLoading ? 'Generating…' : previewUrl ? '↺ Regenerate' : '✦ Generate'}
              </button>
              {previewUrl && (
                <button onClick={handleSaveAvatar} className="btn btn-teal" style={{ flex: 1 }}>
                  Set as Avatar ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  toggle: (theme) => ({
    width: 48, height: 26,
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #00C8FF, #7B5CF0)'
      : 'var(--surface3)',
    borderRadius: 99,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.25s ease',
    flexShrink: 0,
  }),
  toggleKnob: (theme) => ({
    position: 'absolute',
    top: 3, left: theme === 'dark' ? 25 : 3,
    width: 20, height: 20,
    background: '#fff',
    borderRadius: '50%',
    transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  }),
}
